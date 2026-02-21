---
title: PostSpark
tagline: Your background is the product. AI turns it into LinkedIn content nobody else could write.
description: AI-powered LinkedIn content strategist inspired by the "Stanley" viral SaaS story. Input your professional background, struggles, and wins — get 10 personalized post ideas in 5 formats (personal story, hot take, how-to, industry insight, case study) with full drafts ready to publish.
category: Web App
stack: [HTML, Vanilla JS, Tailwind CSS CDN, Fireworks AI, Vercel]
live: https://postspark-ai.vercel.app
image: /projects/postspark.png
projectType: Personal
featured: false
order: 19
---

## The Inspiration

Two founders, no code written, $1M in revenue in weeks. The "Stanley" story was the clearest validation I'd seen of a simple thesis: **the value in AI products is the prompt design, not the engineering**.

Stanley's insight was that generic AI gives generic LinkedIn advice. What professionals needed was an AI that understood *their specific story* — their failures, wins, and contrarian beliefs — and generated content that could only come from them.

## What I Built

PostSpark is a direct implementation of that thesis: a BYOK (bring your own key) LinkedIn content strategy tool that generates 10 post ideas personalized to your professional DNA.

## The Core UX Flow

1. **Profile setup** — Name, title, industry, experience level
2. **Story input** — Key achievements (with numbers), a failure you overcame, your unique career path, your contrarian belief
3. **Format selection** — Choose which content types to focus on (5 active, 3 optional)
4. **AI generation** — 15-20s to analyze and draft 10 complete posts
5. **Results** — Each card shows the hook, the unique angle, the core insight, and a full 200-280 word draft

## Why This Works Differently

The prompting strategy forces specificity at every level:

- The AI is required to reference specific details from the user's story in every idea
- Generic hooks ("consistency is key") are explicitly forbidden in the system prompt
- The angle field forces articulation of *why this post could only come from this specific person*
- Drafts are 200-280 words — short enough to ship, long enough to have real substance

## Technical Design

Single HTML file, zero backend, zero data stored. API key lives in `localStorage`. The Fireworks AI call goes directly from browser to API endpoint — no proxying, no server, no cost to run.

The JSON response parsing handles malformed outputs gracefully (regex extract + try/catch). The UI has 5 states: hero, form, loading (with animated thinking steps), results, and error — each managed by simple show/hide logic.

## The Lesson from Stanley

The founders' real insight wasn't "build a LinkedIn tool." It was: **treat prompt engineering as the product**, iterate on it like code, and the market will tell you which prompts resonate. PostSpark is my version of that experiment.
