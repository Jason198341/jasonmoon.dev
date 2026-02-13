---
title: English Chain
tagline: Your day is an English textbook. Choose your morning, pick your commute, decide your dinner — every choice branches into different conversations.
description: Choose-your-own-day branching English conversation app with 87 situational cards, 8 choice points, 4-stage learning per card, and a unique journey map fingerprint for every playthrough.
category: Web App
stack: [React 19, TypeScript, Zustand 5, Framer Motion, Tailwind CSS v4, Vite 7]
github: https://github.com/Jason198341/english-chain
live: https://english-chain.vercel.app
image: /projects/english-chain.png
images: [/projects/english-chain.png, /projects/english-chain-map.png]
projectType: Personal
featured: true
order: 9
---

## The Concept

Most English conversation apps teach phrases in isolation. "English Chain" puts you inside **a full day** — from waking up to going to bed — where every situation is a real conversation you'd actually have. The twist: you choose your own path. Skip breakfast or eat at home? Take the subway or drive? Each choice branches into different English conversations tailored to that scenario.

The result: **5,832 unique daily journeys** (2x3x3x3x3x3x3x4 combinations). No two days need to be the same.

## How It Works

Each card presents a Korean situation, then guides you through 4 stages of learning:

1. **Listen** — Hear the English sentence
2. **Understand** — Break down the grammar and vocabulary
3. **Speak** — Practice saying it yourself
4. **Apply** — Use it in a variation

At 8 key moments in your day, you hit a **choice point**: What do you eat for breakfast? How do you get to work? What do you do after dinner? Your choices shape the rest of your journey.

## Journey Map

When you complete all cards, a **Journey Map** appears — a vertical timeline showing every segment of your day with colored gradient nodes for each time block. Choice points are highlighted with the branch you took and the alternatives you didn't. A unique "journey signature" hash at the bottom creates a visual fingerprint of your specific path through the day.

The map is designed to be screenshot-worthy and collectible — every playthrough generates a different one.

## Technical Highlights

- **Discriminated union pattern** for PathItem (card vs choice) enables clean TypeScript narrowing
- **Dynamic path construction** via `buildPath()` — the card sequence recalculates on every branch selection
- **Segment-based ordering** (1-16) with branch keys for deterministic path building
- **Framer Motion + @use-gesture** for smooth swipe navigation between cards
- **localStorage persistence** so you can resume mid-journey
- **8 time-block color system** — morning amber through night violet

## Why I Built This

I wanted to learn English the way I actually live — not through random phrases, but through my real daily routine. The branching system means I can practice the exact scenarios I encounter: subway commute conversations, office lunch small talk, grocery store interactions. The "dual circuit" (이중회로) approach trains both recognition and production in every situation.
