---
title: PostSpark
tagline: ChatGPT forgets you. PostSpark remembers your professional story — and gets smarter every session.
description: AI-powered LinkedIn content strategist that learns your style over time. Input your professional background once — get 10 personalized post ideas with full drafts, a 2-week content calendar, and a style engine that improves with every session based on what you like.
category: Web App
stack: [HTML, Vanilla JS, Tailwind CSS CDN, Fireworks AI, Vercel]
live: https://postspark-ai.vercel.app
image: /projects/postspark.png
projectType: Personal
featured: false
order: 19
---

## The Insight That Started It All

Two founders, no code written, $1M in revenue in weeks. The "Stanley" story was the clearest validation of a simple thesis: **the value in AI products is the prompt design, not the engineering**.

Stanley's insight: generic AI gives generic LinkedIn advice. What professionals needed was an AI that understood *their specific story* — their failures, wins, and contrarian beliefs — and generated content that could only come from them.

But after building v1, a harder question emerged: **"Why not just use ChatGPT directly with the same prompt?"**

The answer forced a real product decision: the competitive moat isn't the prompt. It's the **accumulation**.

## v1 → v2: From Generator to System

**v1 problem:** Completely stateless. Brilliant output, but you re-entered your entire life story every session. Zero memory. ChatGPT with a prettier UI.

**v2 thesis:** The real value isn't generating content — it's *remembering who you are* and getting better at predicting what works for you.

## What PostSpark v2 Does

**Profile persistence** — Your professional DNA is saved to localStorage the moment you generate. Next session: one click to continue, not a blank form.

**Style learning** — Every post card has a ❤️ like button. PostSpark tracks which formats and angles you respond to, then injects those preferences into the next generation prompt automatically.

**2-week content calendar** — Results aren't just a list of 10 cards anymore. They're distributed across Tuesday/Thursday/Friday slots for two weeks — the optimal LinkedIn posting rhythm for B2B audiences.

**Profile version history** — Last 3 profile snapshots saved. Click to restore any earlier version — useful when iterating on positioning.

**Export / Import** — JSON profile portability. Move between devices without a backend.

**Profile completeness indicator** — Live progress bar (0→100%) with color feedback, nudging users to fill the fields that most improve output quality.

## The Core UX Flow

1. **First visit** — Fill your professional profile (name, title, industry, achievements, failure, background, hot take)
2. **Return visit** — Welcome back banner: "Use saved profile" in one click
3. **Format selection** — 8 content types; learned preferences shown as "🧠 Learned from your likes"
4. **Generation** — 15-20s; thinking steps now include "Applying your style preferences"
5. **Results** — 10 post cards + calendar view; like what resonates
6. **Next session** — Profile pre-filled, preferences already learned

## Why Prompts Alone Aren't a Moat

The style learning system works by:
1. Storing liked posts as `{ type, hook }` objects in `postspark_liked`
2. On next generation, `getLikedPatterns()` aggregates format frequency
3. The prompt gets a new block: `"User prefers: Personal Story (3x), Hot Take (2x)"`
4. The AI adjusts format distribution accordingly

A competitor can copy the prompt. They can't copy your accumulated preference data.

## Technical Design

Single HTML file, zero backend, zero server cost. Five localStorage keys manage all state:
- `ps_apiKey` — Fireworks AI key
- `postspark_profile` — Current profile JSON (9 fields + formats + savedAt)
- `postspark_liked` — Array of liked post objects
- `postspark_versions` — Last 3 profile snapshots

The Fireworks AI call goes directly browser → API endpoint. JSON response parsed with regex `\[[\s\S]*\]` + try/catch for resilience against malformed outputs.

UI has 5 states: hero → form (with welcome banner logic) → loading → results (with calendar) → error.

## The Bigger Lesson

The real insight wasn't "build a LinkedIn tool." It was: **the accumulation of personal data is the product**. Prompts are replicable. What a user has built up over 20 sessions — their liked formats, their profile iterations, their content history — is not.

This is the pattern that scales: start BYOK and stateless, prove value, then add persistence as the moat deepens with every use.
