---
title: IdeaForge
tagline: Your frustrations are saved. Your taste is learned. Each session the ideas get sharper.
description: AI business idea generator that remembers your pain points and learns what kinds of ideas you like. Input your frustrations once — get 10 business ideas with revenue models, 2-week MVP scope, competitive moat, market potential, and why-now analysis. Stars the ideas you love; learns your preference patterns over time.
category: Web App
stack: [HTML, Vanilla JS, Tailwind CSS CDN, Fireworks AI, Vercel]
live: https://ideaforge-tool.vercel.app
image: /projects/ideaforge.png
projectType: Personal
featured: false
order: 20
---

## The Pattern

PostSpark turns your professional background into LinkedIn content. IdeaForge turns your frustrations into business ideas. Same architecture, different domain: **personal context in → structured AI output out**.

The original insight: raw, specific personal input generates dramatically better AI output than generic prompts. An automotive engineer gets different ideas than a nurse with the same frustrations.

But v1 had the same problem as every AI wrapper: completely stateless. Every session started from scratch. No memory of what you'd already explored. No preference signal from what resonated.

## v1 → v2: The Accumulation Problem

**v1 flaw:** You'd describe your frustrations, get 10 ideas, find 2-3 compelling ones — and that was it. Next session, blank slate. No record of the ideas you saved. No learning about the types of ideas you preferred.

**v2 thesis:** The real value isn't the generation — it's the **shortlist** you build over time and the **preference signal** you accumulate.

## What IdeaForge v2 Does

**Context persistence** — Your frustrations, background, and context are saved to localStorage on every generation. Return sessions load everything with one click — no re-entering three paragraphs of life context.

**Idea shortlist** — Every idea card has a ⭐ star button. Starred ideas are saved to `ideaforge_liked` across sessions. A "Your Saved Ideas" panel on the form shows your shortlist before you generate again.

**Preference learning** — The system tracks what kinds of ideas you star: market type (B2C/B2B/B2B2C), difficulty level (Easy/Medium/Hard), and potential rating (Medium/High/Moonshot). These patterns are injected into the next generation prompt: "User prefers: B2C market, Easy difficulty, High potential." The AI adjusts idea distribution accordingly.

**Context version history** — Last 3 context snapshots saved. Click to restore any earlier version — useful when pivoting focus or revisiting a previous problem space.

**Export / Import** — Full JSON export includes your context, shortlist, and learned patterns. Import on any device without a backend.

**Context completeness indicator** — Live progress bar (0→100%) guiding users to fill all 6 fields. Underspecified context → mediocre ideas.

## What Each Idea Includes

Every generated idea has 7 dimensions:

- **Concept + tagline** — Name and one-sentence elevator pitch
- **Target users** — Exactly who pays (not "businesses" — specific personas)
- **Revenue model** — Specific pricing mechanism with price points (not just "subscription")
- **2-Week MVP** — What a solo developer builds first to validate
- **Competitive moat** — Why this beats "just use Google Sheets"
- **Market potential** — TAM estimate + how to find first 100 customers
- **Why now** — The trend or technology shift that makes this viable today

## Input Design

Three frustration fields (daily waste, wish existed, work inefficiency) + context fields (background, industries, interests) + preference pills (market type, build complexity). The context fields differentiate results — an automotive engineer gets different ideas than a nurse with identical frustrations.

## The Preference Learning System

When a user stars an idea, the system stores: `{ name, tagline, marketType, difficulty, potential, likedAt }`.

Before each generation, `getLikedPatterns()` aggregates:
1. Most-starred market types → "B2C (3x), B2B (1x)"
2. Most-starred difficulty level → "Easy (2x)"
3. Most-starred potential level → "High (3x)"

This summary is added to the prompt as `USER'S LEARNED PREFERENCES`. The AI prioritizes these characteristics while maintaining variety across 10 ideas.

A competitor can copy the prompt. They cannot copy a user's accumulated shortlist and preference signal.

## Technical Design

Single HTML file, zero backend, zero server cost. Four localStorage keys:
- `if_key` — Fireworks AI key
- `ideaforge_profile` — Context JSON (6 frustration/context fields + pill selections + savedAt)
- `ideaforge_liked` — Array of starred idea objects
- `ideaforge_versions` — Last 3 context snapshots

The full shortlist (including learned patterns) is included in the JSON export payload, making the tool's accumulated value portable across devices without any server infrastructure.
