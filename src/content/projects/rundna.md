---
title: RunDNA
tagline: Runners don't just need data — they need to understand their running identity. I built an AI system that decodes it from Strava.
description: AI-powered running analytics platform. Connect Strava, discover your 5-axis runner personality, chat with an AI coach, generate race plans, and share weekly reports. Bilingual (EN/KO).
category: Web App
stack: [Next.js 16, React 19, TypeScript, Supabase, Strava API, Fireworks AI, Tailwind CSS v4]
github: https://github.com/Jason198341/rundna
live: https://rundna.online
domain: rundna.online
image: /projects/rundna.png
images: [/projects/rundna.png]
projectType: Client
flagship: true
featured: true
order: 0
---

## The Backstory

The client was a serious recreational runner who had years of Strava data but no way to extract meaningful insights from it. They wanted more than charts — they wanted to understand *who they are* as a runner. Are they a speed demon or an endurance grinder? A consistent routine runner or a spontaneous explorer? I proposed building an AI system that treats running data like DNA — decoding personality, predicting race times, and coaching in real-time.

The key insight was combining traditional sports science (ACWR training load, Riegel predictions, periodization) with AI coaching that *actually knows your data*. Not generic advice — advice grounded in your specific 173 runs, your recovery patterns, your personal records.

## Key Features

- **Running DNA** — 5-axis personality analysis (Consistency, Speed, Endurance, Variety, Volume) with animated radar chart and shareable DNA cards
- **AI Coach** — Chat with a coach that has your entire Strava history as context. 10 messages/day with usage tracking
- **Race Planner** — Enter a race distance and date, get a full periodized training plan (Base → Build → Taper) with weekly breakdowns
- **Weekly Report** — Shareable cards with this week vs last week stats, ACWR training load gauge, 8-week volume trend, and AI coach notes
- **Bilingual** — Full Korean/English toggle. All UI, AI responses, and reports switch languages instantly

## Technical Architecture

Next.js 16 with Turbopack for the framework. Supabase for auth (Strava OAuth flow), user data, activity caching, and daily usage limits. Fireworks AI (DeepSeek V3) for the coach and planner — each prompt is injected with the user's complete running profile (personality, ACWR, PRs, recovery patterns, race predictions).

The ACWR (Acute:Chronic Workload Ratio) uses the uncoupled method with a 7-day acute window and 42-day chronic window. Race predictions use the Riegel formula extrapolated from personal records. Image downloads required a 3-layer defense against Tailwind CSS v4's lab() color functions that html2canvas can't parse.

## What I Added Beyond the Brief

- **Session cookie signing** — HMAC-SHA256 signed cookies using the service role key as secret, with legacy unsigned cookie backward compatibility
- **Graceful degradation** — Usage tracking works unlimited if the database table doesn't exist yet, limited once migrated
- **Smart token sizing** — Planner uses 8192 max tokens for multi-week plans (12-week half marathon plans generate ~4000 tokens of structured JSON)
- **html2canvas color fix** — 3-layer defense: strip lab()/oklch() from stylesheets, inject hex CSS vars, force inline hex via canvas 2D context
