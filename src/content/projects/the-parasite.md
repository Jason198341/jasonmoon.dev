---
title: The Parasite
tagline: YouTube Shorts was stealing hours from my family. Blocking doesn't work — friction does.
description: Chrome extension that fights YouTube Shorts doom-scrolling with progressive lockdown mechanics.
category: Chrome Extension
stack: [TypeScript, Chrome Extension API, esbuild, Manifest V3]
github: https://github.com/Jason198341/the-parasite
featured: true
order: 5
---

## The Problem

YouTube Shorts is engineered to be addictive. Infinite scroll, autoplay, dopamine hits every 30 seconds. Blocking it entirely doesn't work — people just uninstall the blocker. You need something smarter.

## The Solution

The Parasite doesn't block Shorts — it makes you **aware** of the habit and adds friction progressively. Like a parasite that fights back against the host's mindless behavior.

## How It Works

- **Shorts counter** — Tracks every YouTube Short you watch
- **Progressive lockdown** — Every 10 Shorts triggers a lockout
- **Escalating penalties** — 30s → doubles each time → 100 Shorts = 4 hours locked
- **No escape** — Can't just disable it mid-lockout

## Design Philosophy

Privacy-first. Zero external dependencies. No server, no tracking, no account. All data stays on your machine. The extension is tiny — just TypeScript compiled with esbuild into a Manifest V3 Chrome Extension.

## Why I Built This

YouTube Shorts was eating hours of my family's time. Instead of blocking it (which gets circumvented), I built something that adds friction progressively — painful enough to break the habit, not painful enough to uninstall.
