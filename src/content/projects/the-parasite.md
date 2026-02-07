---
title: The Parasite
description: Chrome extension that fights YouTube Shorts addiction with progressive lockdown mechanics.
category: Chrome Extension
stack: [TypeScript, Chrome Extension API, esbuild, Manifest V3]
github: https://github.com/jasonmoon/the-parasite
featured: true
order: 4
---

## What is The Parasite?

The Parasite is a Chrome extension designed to help you break the YouTube Shorts doom-scrolling habit. It counts your Shorts views and progressively locks you out with increasing penalties.

## Key Features

- **Shorts counter** — Tracks every YouTube Short you watch
- **Progressive lockdown** — Every 10 Shorts triggers a lockout
- **Escalating penalties** — 30s → doubles each time → 100 Shorts means 4 hours locked
- **Privacy-first** — All data stays local, no server, no tracking
- **Minimal footprint** — Zero external dependencies

## Technical Highlights

- Manifest V3 Chrome Extension
- TypeScript with esbuild for fast builds
- Content script injection using inline styles + `documentElement.appendChild`
- Efficient DOM observation for Shorts detection

## Why I Built This

YouTube Shorts was eating hours of my family's time. Instead of just blocking it entirely (which gets circumvented), I built something that makes you *aware* of the habit and adds friction progressively — like a parasite that fights back against mindless scrolling.
