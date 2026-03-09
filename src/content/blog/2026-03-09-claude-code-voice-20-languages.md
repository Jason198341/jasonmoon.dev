---
title: "Claude Code Voice Mode Expands to 20 Languages — Including Russian, Turkish, and More"
description: "Anthropic adds 10 new STT languages to Claude Code's voice mode, ships /loop for cron scheduling, and makes Opus 4.6 default to medium effort thinking."
date: "2026-03-09"
category: ai
tags: ["claude-code", "voice-mode", "anthropic", "multilingual", "developer-tools"]
featured: false
---

Anthropic's Voice Mode for Claude Code just got significantly more international — and picked up a powerful scheduling feature in the same release.

## What Happened

Claude Code's voice interface now supports **20 languages total**, up from 10. The new additions: Russian, Polish, Turkish, Dutch, Ukrainian, Greek, Czech, Danish, Swedish, and Norwegian.

Alongside the STT expansion, two other changes shipped:

- **Opus 4.6 default behavior changed**: Max and Team subscribers now get `medium` effort thinking by default. The previous default was heavier. To activate high-intensity reasoning, say or type `ultrathink`.
- **`/loop` command added**: Run Claude Code on a schedule or in a repeat loop. Combine with cron syntax to automate recurring tasks without a human trigger.

## Why This Matters

The language expansion matters more than it sounds. Non-English developers have always been technically able to use Claude Code, but voice mode was English-dominant. Adding major European languages — especially Russian, Turkish, and Dutch, each with millions of developers — removes a real friction point.

The Opus 4.6 effort tier change is subtler but consequential: medium effort is faster and cheaper. For teams running Claude at scale, the default shift reduces cost without explicitly changing behavior. `ultrathink` becomes the escape hatch for when you need full reasoning depth.

`/loop` is the sleeper feature here. Persistent scheduling inside Claude Code means you can now define autonomous maintenance agents — not just one-shot tasks. A loop that reviews test failures every 30 minutes, or reformats new files on commit, runs without any external orchestration.

## What Developers Should Do Now

1. **Check your language setting** — if you code in a non-English environment, `/voice` now likely supports your native language
2. **Audit your Opus 4.6 prompts** — with medium effort as default, tasks that needed full reasoning may need explicit `ultrathink` added
3. **Prototype a `/loop` workflow** — even a simple "check for TODO comments and remind me daily" loop demonstrates the new capability

The gap between "AI coding assistant" and "always-on AI coding partner" is narrowing with every release.

---

*Source: [TechCrunch — Claude Code Rolls Out a Voice Mode Capability](https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/)*
