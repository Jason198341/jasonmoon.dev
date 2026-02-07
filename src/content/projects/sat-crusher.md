---
title: SAT Crusher
description: Adaptive SAT prep with AI tutoring, spaced repetition, and wrong-answer DNA analysis.
category: Web App
stack: [React, TypeScript, Supabase, Fireworks AI, React Router, Recharts, KaTeX]
github: https://github.com/jasonmoon/sat-crusher
featured: true
order: 2
---

## What is SAT Crusher?

SAT Crusher is a comprehensive SAT preparation platform that adapts to each student's weakness patterns. It combines adaptive testing, AI tutoring (벼락 깨달음 system), and data-driven wrong-answer analysis.

## Key Features

- **Adaptive testing** — Module 1 performance (60% threshold) determines Hard or Easy Module 2
- **8 AI tutor modes** — Free, 벼락 깨달음, DNA Guide, Passage Strategy, Speed Run, Analysis Run, Weakness Run, Vocabulary
- **Wrong-Answer DNA** — Tracks 10 trap types to build a personal weakness profile
- **Spaced repetition** — SM-2 algorithm for optimal review scheduling
- **Bilingual** — Full English/Korean i18n support
- **Progress tracking** — Recharts-powered analytics dashboard

## Technical Highlights

- React 19 + React Router v7 for SPA routing
- Supabase for PostgreSQL backend with Row Level Security
- Fireworks AI (deepseek-v3p1) for intelligent tutoring
- KaTeX for math rendering
- Zustand 5 for state management

## Why I Built This

My kids needed SAT prep, and existing tools felt either too generic or too expensive. I wanted to build something that truly adapts — not just random questions, but a system that understands *why* a student gets things wrong.
