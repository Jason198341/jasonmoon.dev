---
title: Yeonhoo Terminal
tagline: I spent more time fighting my terminal than writing code. So I built one that actually understands Claude Code.
description: Claude Code-optimized terminal emulator built with Tauri 2 + Rust + React. Split panes, smart paste, session restore, and native Claude Code process detection.
category: Web App
stack: [Tauri 2, Rust, React 19, TypeScript, xterm.js, Zustand, SQLite]
github: https://github.com/Jason198341/yeonhoo
image: /projects/yeonhoo.png
projectType: Personal
featured: true
order: 6
---

## The Problem

Every terminal emulator treats Claude Code like any other process. But Claude Code isn't any other process — it has modes, it has costs, it has context windows. I wanted a terminal that knows when Claude is running and surfaces that information without me having to dig for it.

I also kept losing my session layout. Every restart meant rebuilding my pane configuration from scratch. And pasting file paths from Windows Explorer into a Unix shell was a constant source of friction.

## What Yeonhoo Does Differently

**Claude Code awareness** — Yeonhoo auto-detects Claude Code processes and shows a live mode badge (Plan / Auto / Normal). Token usage and cost metrics appear inline without switching windows.

**Smart Paste** — Clipboard content goes through Win32 API inspection before it's pasted. `CF_HDROP` file paths get auto-converted from Windows format (`C:\Users\...`) to Unix (`/c/Users/...`), which matters if you're running MSYS2 or WSL.

**Session Restore** — Tab and pane layout is saved on every change. Restart the app and you're exactly where you left off.

**Split Panes** — Recursive tree-based layout engine supports arbitrary horizontal/vertical splits with drag-to-resize dividers.

**Command History** — Every command is indexed in SQLite with FTS5. `Ctrl+R` opens full-text search across your entire history, not just the current session.

## Technical Architecture

The backend is Rust using `portable_pty` for PTY management. Each pane gets its own PTY instance. The frontend is React 19 with xterm.js running in WebGL mode for GPU-accelerated rendering. State is managed with Zustand 5 — the terminal layout is a recursive tree that maps directly to the split pane UI.

The plugin system reads JSON manifests from `~/.yeonhoo/plugins/` at startup. Plugins can add themes, commands, and keybindings. The config system uses TOML with `notify` for filesystem watching — edit `~/.yeonhoo/config.toml` and changes apply without restarting.

Shell detection follows a priority chain: Git Bash → MSYS2 → PowerShell (only if ExecutionPolicy allows) → cmd.exe. This avoids the common `ExecutionPolicy: Restricted` issue that makes PowerShell unusable in many corporate environments.

## Key Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+T` | New Tab |
| `Ctrl+Shift+\` | Split Horizontal |
| `Ctrl+Shift+-` | Split Vertical |
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+R` | Search History |
| `Ctrl+V` | Smart Paste |

## Why the Name

연후 (Yeonhoo) — named after my son.
