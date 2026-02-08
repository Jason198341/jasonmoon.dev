---
title: EngReading
tagline: v5.0 — Korean sentence in, English brain out. AI classifies your verb into 1 of 7 Sets and animates how a native speaker builds the sentence left-to-right.
description: Forward-Flow English Brain Rewiring Engine. Input any Korean sentence, AI classifies the core verb into 7 Sets and animates the native English thought process. Gamified with XP, streaks, radar mastery charts, and SM-2 spaced repetition review.
category: Web App
stack: [Next.js 16, TypeScript, Fireworks AI, Supabase, Tailwind CSS v4, Framer Motion, Recharts]
live: https://www.engreading.com
domain: engreading.com
image: /projects/engreading.png
images: [/projects/engreading.png, /projects/engreading-dashboard.png, /projects/engreading-flow.png, /projects/engreading-mastery.png]
projectType: Client
flagship: true
featured: true
order: 2
---

## The Backstory

The original EngReading was a "100-sentence story writing" platform — write one English sentence per day, get AI corrections, build a story over 3 months. It worked, but the client wanted something more fundamental: *rewire the Korean brain to think in English word order*.

The insight came from linguistics: Korean speakers fail not because they lack vocabulary, but because they assemble sentences backwards (SOV vs SVO). If you could teach the brain to *predict what comes next* in English — the way native speakers do — fluency follows naturally.

I rebuilt the entire platform from scratch around this idea. The result is v5.0: a Forward-Flow engine where you input any Korean sentence, AI classifies the core verb into 1 of 7 Sets, then animates how a native English brain would construct the sentence left-to-right, chunk by chunk. Every verb in English falls into one of 7 patterns, and each pattern predicts what comes next differently.

## The 7-Set Verb Classification System

The core innovation. Every English verb belongs to one of 7 Sets, each with a distinct prediction pattern:

| Set | Name | Examples | Brain Predicts |
|-----|------|----------|---------------|
| 1 | Be Verbs | am, is, are | Complement (adjective/noun/place) |
| 2 | Action Verbs | eat, run, study | Object (what?) |
| 3 | Perception/Cognition | see, hear, feel | that-clause or object |
| 4 | Ditransitive/Causative | give, send, tell | Indirect + direct object |
| 5 | Linking/Change | become, get, turn | Complement describing state |
| 6 | Existence/Movement | go, come, arrive | Location/direction (where?) |
| 7 | Special Patterns | It is...that, What...is | Pattern-specific continuation |

## Key Features

- **Forward Flow Engine** — Input Korean, see the English brain's left-to-right thought process animated step by step
- **7-Set verb classification** — AI identifies the core verb's Set and shows its prediction pattern
- **6-step analysis** — Verb extraction, Set identification, brain flow animation, final sentence, atomic chunks, KR vs EN comparison
- **Quiz system** — Multiple-choice verb prediction quiz after each analysis, awards XP
- **Gamification** — XP/level system (1-50), 5 tiers (Bronze to Diamond), 15 achievements
- **7-Set mastery radar** — Recharts radar chart tracking proficiency across all 7 Sets
- **Streak system** — Daily streak counter with freeze tokens and streak bonuses
- **SM-2 spaced repetition** — Review past analyses at optimal intervals for retention
- **Daily missions** — AI-generated Korean sentences targeting weak Sets
- **Dark luxury design** — Gold accent (#C9A84C), glass morphism, shooting star animations

## Technical Architecture

Next.js 16 App Router with Turbopack. Supabase for auth (cookie-based SSR), PostgreSQL with RLS, and service-role admin client for XP/achievement mutations. Fireworks AI (deepseek-v3p1) generates structured 6-step analysis JSON per Korean input. Framer Motion orchestrates staggered step-by-step animations. Recharts renders the 7-axis radar mastery chart. SM-2 algorithm schedules review intervals across 9 stages. Three Vercel cron jobs handle daily missions, streak settlement, and review scheduling.

## What I Added Beyond the Brief

- **Complete platform rebuild** — v1-v4 was story writing; v5 is brain rewiring from scratch
- **7-Set classification system** — Original linguistic framework mapping all English verbs to 7 prediction patterns
- **Radar mastery tracking** — Per-user, per-Set proficiency visualization with milestone badges
- **Achievement system** — 15 achievements across analysis count, streak, level, and Set mastery
- **XP economy** — Calibrated XP rewards for analysis, quiz, review, streaks, missions, and achievements
- **Shipped to custom domain** — engreading.com, live in production with Supabase backend
