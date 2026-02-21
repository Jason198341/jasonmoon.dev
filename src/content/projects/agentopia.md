---
title: Agentopia
tagline: The client wanted AI agents that fight each other. I built the colosseum.
description: Meta social strategy simulation where AI agents debate, compete, and evolve. 8-stat personality tuning, 5-turn live debates, AI judging, ELO ranking, and a BYOK economy system.
category: Web App
stack: [Next.js 16, React 19, TypeScript, Supabase, Fireworks AI, OpenAI, Zustand 5, Tailwind CSS v4]
github: https://github.com/Jason198341/agentopia
live: https://agentopia.online
image: /projects/agentopia.png
images: [/projects/agentopia.png, /projects/agentopia-dashboard.png, /projects/agentopia-battle.png, /projects/agentopia-replay.png]
projectType: Client
featured: true
order: 9
---

## The Backstory

The concept was a meta social strategy simulation — not just chatbots, but AI agents with distinct personalities that debate real topics and evolve through competition. Each agent has 8 tunable stats (logic, aggression, brevity, humor, boldness, creativity, knowledge, adaptability) that directly shape how they argue. The client wanted users to feel like they're training a gladiator, not just chatting with an AI.

I built the full stack: a 50-prompt design framework (10 stems, 40 prompts) before writing a single line of code, then a complete battle system with live replay, AI judging, ELO rankings, and a BYOK economy where users bring their own OpenAI key after 50 free battles.

## Key Features

- **8-stat personality engine** — Each stat maps to 3-tier prompt modifiers that shape debate style
- **5-turn structured debates** — Opening → Rebuttal → Counter → Free → Closing, with live "thinking" animations
- **AI judge with 6 criteria** — Logic, rebuttal, consistency, persuasion, expression, factual accuracy (120pts max)
- **ELO ranking system** — K=32 formula, 6 tiers from Bronze to Master
- **Battle analysis report** — SVG radar chart, branching point detection, stat upgrade recommendations
- **Strategy black box** — Post-battle reveal of both agents' turn-by-turn strategies
- **13 badges + 5 auto-traits** — Giant Slayer, Comeback Grit, Confidence — earned through battle patterns
- **BYOK economy** — 50 free battles, then bring your own OpenAI API key for unlimited play
- **54 DB-driven topics** — 3 difficulty tiers, 10 categories, usage-weighted random selection
- **Share cards** — Battle result cards with Web Share API + clipboard fallback

## Technical Architecture

Next.js 16 App Router with Server Components for data fetching and Client Components for interactivity. Supabase handles auth (SSR cookies), 5 PostgreSQL tables with RLS, and admin operations via service role key. The battle engine is provider-agnostic — a `CompletionFn` injection pattern lets it swap between Fireworks (free tier) and OpenAI (BYOK) without touching engine code. AI key validation uses OpenAI's models endpoint (zero cost). All API keys stay in localStorage — server never persists them.

## What I Added Beyond the Brief

- **50-prompt design framework** — Complete service design before any code (identity, users, mechanics, economy, risk)
- **Live battle replay** — 21-step reveal with thinking animations, not just a text dump
- **Post-battle analysis** — Radar chart, weakness diagnosis, stat recommendations with direct edit link
- **Admin panel** — Topic CRUD with difficulty filters, stats tracking, role-based access
- **Full SEO** — OG/Twitter cards, sitemap, robots.txt, page-level metadata templates
