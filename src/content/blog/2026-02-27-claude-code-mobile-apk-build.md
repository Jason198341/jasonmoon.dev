---
title: "Building an Android APK on Your Phone with Claude Code + Termux"
description: "No PC, no API key, just a Claude subscription. How I installed Claude Code on Android via Termux and built a working APK — entirely on my phone."
date: "2026-02-27"
category: tutorial
tags: ["claude-code", "termux", "android", "mobile-development", "vibe-coding", "apk"]
featured: true
---

I built an app on my phone. No PC. No remote server. No SSH tunnel to a desktop. A Samsung Galaxy running Android 15, a terminal emulator called Termux, and Claude Code — that's the entire stack. The resulting APK installed and ran on the same device that built it.

This post is the full technical walkthrough.

## Why This Matters

People have run Claude Code on mobile before. But every case I found falls into one of three categories:

1. **SSH to a remote machine** — your phone is just a thin client, the real work happens on a desktop or cloud VM
2. **Simple CLI tasks** — editing a script, running a quick command, nothing that requires a build toolchain
3. **Anthropic's Remote Control** — a companion app that sends instructions to a Claude Code session running on your PC

None of these actually build anything *on the phone itself*. What I did is different: the entire build pipeline — code generation, compilation, packaging, signing — executed locally on the phone's ARM processor. The phone built an app for itself.

## The Setup

### Termux + proot + Node.js + Claude Code

Five commands to go from zero to a working Claude Code installation:

```bash
# 1. Install Termux from F-Droid (NOT Google Play — that version is abandoned)
# 2. Once inside Termux:
pkg update && pkg upgrade -y
pkg install git curl wget openssl-tool proot nodejs bash -y

# 3. Enter virtual root (critical — Claude Code expects /home paths)
termux-chroot

# 4. Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# 5. Launch and authenticate
claude
```

### Why proot?

Termux's default home directory is `/data/data/com.termux/files/home`. Claude Code expects standard Linux paths like `/home`. Running `termux-chroot` uses proot to remap the filesystem:

- `/data/data/com.termux/files/usr` becomes `/usr`
- `/data/data/com.termux/files/home` becomes `/home`

Without this, you'll hit path resolution errors. Always run `termux-chroot` before launching Claude Code.

### Subscription Auth via /login

Most guides tell you to set `ANTHROPIC_API_KEY`. I didn't. Inside the Claude Code session, I ran:

```bash
/login
```

This opens a browser authentication flow. Log in with your Claude subscription account (Pro or Max), and you're done. No API key management, no token counting, no separate billing. Your existing subscription quota covers it.

## The Challenge: Android 15's Phantom Process Killer

Getting Claude Code running was the easy part. The real problem hit when I tried to build an APK.

The standard Android build toolchain requires Java compilation: write `.java` files, compile to `.class` bytecode with `javac`, convert to Dalvik `.dex` format with `dx`. Termux provides all these tools:

```bash
pkg install aapt apksigner dx ecj -y
```

| Tool | Role |
|------|------|
| `aapt` | Android Asset Packaging Tool — resource/manifest packaging |
| `apksigner` | APK digital signing |
| `dx` | Java to Dalvik DEX conversion |
| `ecj` | Eclipse Java Compiler |

But none of the Java compilers worked:

- **`javac` (OpenJDK)** — `libicu.so` shared library link error
- **`ecj` (Eclipse Compiler)** — `libnativehelper.so` error when invoking `dalvikvm`
- **`app_process` approach** — killed mid-compilation by the **Phantom Process Killer**

Android 12 introduced the Phantom Process Killer, and Android 15 enforces it aggressively. It monitors background apps like Termux and terminates their child processes — especially long-running ones like Java compilation. The JVM spins up, starts compiling, and gets killed before it finishes.

This is the wall that makes "just install the Android SDK in Termux" a dead end on modern Android versions.

## The Solution: Python-Generated DEX Bytecode

If Java can't run on the phone, don't use Java. I asked Claude Code to bypass the entire Java toolchain and generate Dalvik bytecode directly using Python.

The approach has three parts:

### 1. DEX Bytecode Generation (dexgen.py)

Python's `struct` module packs binary data. The DEX file format is well-documented. Claude Code wrote a Python script that assembles a valid `classes.dex` from scratch:

- **DEX header** — magic number, checksum, SHA-1 signature, file size, section offsets
- **String table** — all string constants (class names, method names, literals)
- **Type IDs** — references to classes like `Landroid/app/Activity;`
- **Proto IDs** — method prototypes (return type + parameter types)
- **Method IDs** — which class owns which method
- **Class definitions** — the actual class structure
- **Code items** — raw Dalvik instructions: `invoke-virtual`, `new-instance`, `const-string`, etc.

The script calculates the SHA-1 signature and Adler-32 checksum, producing a valid DEX file that the Android runtime can execute — without ever touching `javac` or `dx`.

### 2. Binary AndroidManifest.xml Generation (patch_manifest.py)

Android doesn't read XML manifests as plain text. It expects AXML — a binary XML format. Another problem: Termux's bundled `android.jar` (API 28) is a stripped-down version missing the `uses-sdk` attributes. Without `minSdkVersion` and `targetSdkVersion`, Android 15 refuses to install the APK.

The solution: generate the binary manifest from Python too.

- **String pool** — UTF-16LE encoded string table
- **Resource ID mapping** — `android:minSdkVersion` maps to `0x0101020c`, etc.
- **XML events** — `start_namespace`, `start_element`, `end_element` in binary format
- **SDK constraints** — `minSdkVersion=21`, `targetSdkVersion=28` injected directly

### 3. v1 JAR Signing (sign_apk.py)

The final obstacle: `apksigner` internally calls `java`, which — as established — doesn't work. So signing also goes through Python + openssl:

```
APK files → SHA-256 digest → MANIFEST.MF
MANIFEST.MF → SHA-256 → CERT.SF
CERT.SF → openssl smime → CERT.RSA (PKCS#7 signature)
```

A self-signed certificate generated with `openssl` handles the cryptographic signing. Android accepts v1 (JAR) signatures for apps targeting API 28.

## The Build Pipeline

Everything runs on the phone. No network calls to build servers. No cross-compilation.

```
+---------------------------------------------------+
|  1. Python: DEX bytecode generation (dexgen.py)    |
|     -> classes.dex (Dalvik executable)              |
|                                                     |
|  2. Python: Binary manifest (patch_manifest.py)     |
|     -> AndroidManifest.xml (AXML format)            |
|                                                     |
|  3. Python: zipfile packaging                       |
|     -> hello-unsigned.apk                           |
|                                                     |
|  4. openssl + Python: v1 JAR signing                |
|     -> hello.apk (installable!)                     |
|                                                     |
|  5. Copy to Downloads -> Install                    |
+---------------------------------------------------+
```

The actual commands:

```bash
cd /home/hello-app

# Generate DEX bytecode
python3 dexgen_simple.py

# Generate manifest + package APK
python3 patch_manifest.py

# Sign the APK
python3 sign_apk.py

# Copy to Downloads
cp build/hello.apk /storage/emulated/0/Download/

# Trigger install intent
am start -a android.intent.action.VIEW \
  -d "content://com.android.externalstorage.documents/document/primary%3ADownload%2Fhello.apk" \
  -t application/vnd.android.package-archive
```

## The Result

- **App name**: Jason Hello
- **Package**: com.jason.hello
- **Size**: ~3.6KB
- **UI**: Dark background, rocket emoji, "Hello, Jason!" title
- **Built on**: Samsung Galaxy, Android 15
- **Installed on**: The same phone that built it

3.6KB. For context, a "Hello World" from Android Studio is typically 1-2MB. The Python-generated DEX contains exactly the bytecode needed and nothing else — no R.class, no BuildConfig, no support libraries.

## Subscription vs API Key

This deserves its own section because almost every Claude Code tutorial gets it wrong.

| | API Key | Subscription (/login) |
|---|---|---|
| **Authentication** | `ANTHROPIC_API_KEY` env var | Browser OAuth via `/login` |
| **Billing** | Pay-per-token, separate from subscription | Included in Pro ($20) / Max ($100-200) |
| **Token management** | Manual tracking, budget alerts | Automatic quota management |
| **Setup complexity** | Generate key, export env var, manage rotation | One command, browser tap, done |
| **Best for** | CI/CD, programmatic access, heavy usage | Interactive sessions, mobile, personal use |

For mobile use especially, subscription auth is the clear winner. You don't want to manage API keys on a phone terminal. `/login` once and you're set.

## Tips and Troubleshooting

### Phantom Process Killer defense

Run `termux-wake-lock` before starting any long operation. This promotes Termux to foreground priority and reduces (but doesn't eliminate) the risk of process termination. Python scripts are much safer than JVM processes because they start and finish faster.

### Storage permissions

`termux-setup-storage` must be run once to create the `~/storage/` symlinks. If it doesn't prompt for permissions, go to Settings > Apps > Termux > Permissions > Files and enable manually.

### Claude Code responsiveness

If Claude Code feels slow or drops connections:
- Long-press the Termux notification and tap "Acquire wakelock"
- Ensure stable Wi-Fi — Claude Code streams responses over HTTPS
- A Bluetooth keyboard dramatically improves the experience for longer sessions

### F-Droid Termux only

The Google Play version of Termux has been abandoned since 2020. The F-Droid version receives regular updates and is the only version that works reliably with modern packages. Do not install from Play Store.

### GitHub integration

Optional but useful — push your build scripts to a repo directly from the phone:

```bash
pkg install gh -y
gh auth login --web -p https
# Follow the device code flow in your browser
```

## What's Next

A 3.6KB hello-world app proves the pipeline works. The natural next steps:

- **Multi-activity apps** — navigation, intents, more complex DEX generation
- **Resource packaging** — layouts, drawables, using `aapt` for resource compilation
- **React Native or Flutter** — the real test of whether a full JS/Dart toolchain can survive on a phone
- **CI on mobile** — automated builds triggered by git push, all running locally

The fundamental insight: Claude Code doesn't just write code — it orchestrates entire build toolchains. When the standard toolchain breaks (Java on Android 15), it engineers an alternative (Python-generated bytecode). That's the difference between a code completion tool and an agentic coding system.

The PC is becoming optional. Not for everything, not yet. But for the first time, "I built this on my phone" is a literal statement, not a figure of speech.
