---
title: SAT Crusher
tagline: My kids needed SAT prep. Every app tracked right/wrong — none asked why. So I built an AI tutor that does.
description: Adaptive SAT prep platform with 8 AI tutor modes, spaced repetition, and wrong-answer DNA analysis.
category: Web App
stack: [React 19, TypeScript, Supabase, Fireworks AI, React Router v7, Recharts, KaTeX, Zustand 5]
github: https://github.com/Jason198341/sat-crusher
live: https://sat-crusher.vercel.app
image: /projects/sat-crusher.png
images: [/projects/sat-crusher.png, /projects/sat-crusher-tutor.png]
projectType: Personal
featured: true
order: 3
---

## The Backstory

My kids' SAT prep was driving me crazy. Every app out there gives random questions and says "you got 7 out of 10." Great, but *why* did you miss those 3? Was it a vocabulary gap? A logic trap? Misreading the passage? No tool answered that question.

So I built one. SAT Crusher has an AI tutor with 8 different teaching modes — from "lightning insight" that flips your understanding in one moment, to "wrong-answer DNA tracking" that identifies your specific thinking traps across 10 categories. It's not just practice — it's a personal diagnosis of how your brain makes mistakes.

## Key Features

- **Adaptive testing** — Module 1 performance (60% threshold) determines Hard or Easy Module 2
- **8 AI tutor modes** — Free, Lightning Insight, DNA Guide, Passage Strategy, Speed Run, Analysis Run, Weakness Run, Vocabulary
- **Wrong-Answer DNA** — Tracks 10 trap types to build a personal weakness profile
- **Spaced repetition** — SM-2 algorithm for optimal review scheduling
- **Bilingual** — Full English/Korean i18n support
- **Analytics dashboard** — Recharts-powered progress visualization
- **Math rendering** — KaTeX for beautiful equation display

## Technical Architecture

React 19 + React Router v7 for SPA routing. Supabase provides PostgreSQL with Row Level Security for the backend. Fireworks AI (deepseek-v3p1) powers the intelligent tutoring system. Zustand 5 for state management with persistent stores.

## Why I Built This

My kids needed SAT prep. I wanted to build something that truly adapts — not just random questions, but a system that understands *why* a student gets things wrong and targets those specific weaknesses.
