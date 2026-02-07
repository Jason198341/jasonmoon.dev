---
title: SAT Crusher
tagline: My kids needed SAT prep that actually adapts to why they get things wrong.
description: Adaptive SAT prep platform with 8 AI tutor modes, spaced repetition, and wrong-answer DNA analysis.
category: Web App
stack: [React 19, TypeScript, Supabase, Fireworks AI, React Router v7, Recharts, KaTeX, Zustand 5]
github: https://github.com/Jason198341/sat-crusher
live: https://sat-crusher.vercel.app
image: /projects/sat-crusher.png
images: [/projects/sat-crusher.png, /projects/sat-crusher-tutor.png]
featured: true
order: 3
---

## The Problem

SAT prep tools are either too generic (random questions with no adaptation) or too expensive ($50+/month). None of them truly understand *why* a student gets things wrong — they just track right vs. wrong.

## The Solution

SAT Crusher adapts to each student's weakness patterns. It combines adaptive testing, AI tutoring (벼락 깨달음 system), and data-driven wrong-answer analysis to create a personalized prep experience.

## Key Features

- **Adaptive testing** — Module 1 performance (60% threshold) determines Hard or Easy Module 2
- **8 AI tutor modes** — Free, 벼락 깨달음, DNA Guide, Passage Strategy, Speed Run, Analysis Run, Weakness Run, Vocabulary
- **Wrong-Answer DNA** — Tracks 10 trap types to build a personal weakness profile
- **Spaced repetition** — SM-2 algorithm for optimal review scheduling
- **Bilingual** — Full English/Korean i18n support
- **Analytics dashboard** — Recharts-powered progress visualization
- **Math rendering** — KaTeX for beautiful equation display

## Technical Architecture

React 19 + React Router v7 for SPA routing. Supabase provides PostgreSQL with Row Level Security for the backend. Fireworks AI (deepseek-v3p1) powers the intelligent tutoring system. Zustand 5 for state management with persistent stores.

## Why I Built This

My kids needed SAT prep. I wanted to build something that truly adapts — not just random questions, but a system that understands *why* a student gets things wrong and targets those specific weaknesses.
