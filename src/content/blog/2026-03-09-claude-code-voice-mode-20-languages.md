---
title: "Claude Code Voice Mode Expands to 20 Languages — Including Russian, Turkish, and Dutch"
description: "Anthropic's Claude Code voice interface now supports 20 languages after adding 10 new STT languages, plus Opus 4.6's 'ultrathink' keyword and the new /loop command for cron-style automation."
date: "2026-03-09"
category: ai
tags: ["claude-code", "voice-mode", "anthropic", "multilingual", "developer-tools", "stt"]
featured: false
---

Anthropic has expanded Claude Code's Voice Mode from 10 to **20 languages**, adding Russian, Polish, Turkish, Dutch, Ukrainian, Greek, Czech, Danish, Swedish, and Norwegian to its speech-to-text engine. For the first time, developers outside English and common European language groups can issue spoken commands to their AI coding assistant in their native tongue.

## What Happened

The voice update ships alongside two other significant changes to Claude Code's runtime behavior:

**Opus 4.6 reasoning shift**: For Max and Team subscribers, Opus 4.6 now defaults to **medium effort** reasoning — trading raw inference depth for faster response times. If you need full reasoning power, the keyword `ultrathink` re-enables high-throughput computation for that specific request. This effectively gives users dial control over the compute/speed tradeoff.

**`/loop` command**: Claude Code now supports scheduled and repeated execution. You can set a task to run on a cron-style timer, letting Claude Code autonomously execute workflows — linting, test runs, dependency checks — without a human in the loop. Combined with the new Cursor Automations landscape (see below), this marks a shift from "AI as tool" to "AI as scheduled process."

## Why This Matters

Language has always been a hidden barrier in AI developer tooling. Voice Mode's original 10-language launch covered most of the English-adjacent developer world. The 20-language expansion is a different category of change: it opens voice-native coding to millions of developers in Eastern Europe, Scandinavia, and the MENA region who have historically coded in English as a second language.

There's a subtler productivity angle here: thinking and speaking in your native language is categorically faster than translating intent into English first. A Polish backend engineer narrating a complex algorithm in Polish can issue more precise instructions than the same engineer constructing an English equivalent on the fly.

Whether Korean STT is included in this batch is still unconfirmed — Korean-speaking developers should test `/voice` and report back.

## The Ultrathink Lever Changes How You Work With Opus

The `ultrathink` keyword is more significant than it first appears. Medium-effort default means your typical Claude Code interactions — file edits, code explanations, refactoring suggestions — get snappier. But when you hit a hard architectural problem, adding `ultrathink` to your prompt activates the full Opus reasoning chain.

This creates a new developer pattern: **lazy evaluation of reasoning depth**. Don't burn compute on boilerplate, save it for the decisions that matter. Teams that internalize this will see meaningfully different cost profiles compared to those who treat every request identically.

## What Developers Should Do Right Now

1. **Test your language** — if you're a non-English speaker, run `/voice` and attempt your native language. Report accuracy issues directly to Anthropic feedback; this data shapes the next expansion.

2. **Audit your Opus 4.6 prompts** — if you're relying on Opus for deep architectural reasoning, add `ultrathink` explicitly. Don't assume medium effort is sufficient for complex problems.

3. **Prototype `/loop` for your CI tasks** — identify 2–3 repetitive coding tasks you run daily (dependency updates, linting sweeps, test execution) and design a `/loop` workflow around them. This is the path to async, human-free development cycles.

The 20-language milestone is less about feature count and more about a signal: Anthropic is building Claude Code as global developer infrastructure, not an English-first productivity tool.

---

*Source: [TechCrunch — Claude Code rolls out a voice mode capability](https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/)*
