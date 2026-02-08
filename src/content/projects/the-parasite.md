---
title: The Parasite
tagline: YouTube Shorts was stealing hours from my family. Blocking doesn't work — friction does.
description: Chrome extension that fights YouTube Shorts doom-scrolling with tamagotchi evolution, achievements, and progressive lockdown mechanics.
category: Chrome Extension
stack: [TypeScript, Chrome Extension API, esbuild, Manifest V3]
github: https://github.com/Jason198341/the-parasite
image: /projects/the-parasite.png
images: [/projects/the-parasite.png, /projects/the-parasite-popup.png, /projects/the-parasite-achievements.png]
featured: true
order: 5
---

## The Problem

YouTube Shorts is engineered to be addictive. Infinite scroll, autoplay, dopamine hits every 30 seconds. Blocking it entirely doesn't work — people just uninstall the blocker. You need something smarter.

## The Solution

The Parasite doesn't block Shorts — it makes you **aware** of the habit and adds friction progressively. Like a parasite that fights back against the host's mindless behavior. Watch less, and it evolves into something powerful. Binge, and it devolves back to an egg.

## Key Features

- **Tamagotchi evolution** — 6 levels from Egg to Dragon King. Maintain a streak of low usage to evolve; binge and it devolves
- **9 achievements** — Unlock milestones like "First Blood", "Iron Will", "Quick Escape", and "Dragon King"
- **Weekly report popup** — Bar chart of daily Shorts count, week-over-week comparison, time tracking
- **Progressive lockdown** — Every 10 Shorts triggers a lockout that doubles each time (30s → 4h16m)
- **Persistent lockdown** — Refreshing the page won't save you. Lock state survives page reloads
- **Cross-tab sync** — Open YouTube in 5 tabs? The Parasite sees all of them

## Technical Architecture

Built with pure TypeScript, bundled with esbuild into a Manifest V3 Chrome Extension. The background service worker acts as a **centralized state manager** — all storage writes go through a serialization queue to prevent race conditions across multiple tabs. Content scripts only detect events and render UI, communicating via `chrome.runtime.sendMessage`. Shared types, constants, and storage helpers live in a single-source-of-truth module. Schema versioning handles data migration across updates.

## Design Philosophy

Privacy-first. Zero external dependencies. No server, no tracking, no account. All data stays on your machine in `chrome.storage.local`. The entire extension is under 25KB bundled.

## Why I Built This

YouTube Shorts was eating hours of my family's time. Instead of blocking it (which gets circumvented), I built something that adds friction progressively — painful enough to break the habit, not painful enough to uninstall. The tamagotchi mechanic adds a reason to care: nobody wants to watch their creature devolve back to an egg.
