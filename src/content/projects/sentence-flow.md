---
title: SentenceFlow
tagline: 135 sentences across 5 levels and 8 categories — 7 new ones unlock every morning at 7 AM.
description: English sentence memorization engine with 5 CEFR-aligned levels, 8 real-life categories, Progressive Chunking Recall, SM-2 spaced repetition, daily 7AM unlock system, and memory strength dashboard.
category: Web App
stack: [React 18, Tailwind CSS, LocalStorage, SM-2 Algorithm, Web Speech API]
github: https://github.com/Jason198341/sentence-flow
live: https://sentence-flow-dun.vercel.app
image: /projects/sentence-flow.png
projectType: Personal
featured: true
order: 22
---

## The Backstory

Every Korean English learner knows the pain: you memorize a sentence, but when you need it in real life, your mouth freezes. Reading comprehension is fine — but production fails. I built SentenceFlow to attack this specific gap using Progressive Chunking Recall, spaced repetition, and a daily unlock system that keeps learners coming back every morning.

## Key Features

- **135 Curated Sentences** — Organized across 5 CEFR-aligned levels (Foundation A1 to Mastering C2) and 8 real-life categories
- **Daily 7AM Unlock** — 7 new sentences unlock every morning at 7:00 AM KST, with countdown timer and notification badge
- **5 Levels** — Foundation, Building, Expanding, Refining, Mastering — mapped to CEFR A1 through C2
- **8 Categories** — Office survival, Travel, Daily life, Emotions, Job interview, Parenting, SNS/Trends, Nuance
- **Progressive Chunking Recall** — 4-step learning: full sentence exposure, chunk decomposition, fill-in-the-blank, complete recall from memory
- **SM-2 Spaced Repetition** — Sentences you struggle with appear more often; mastered ones fade to monthly reviews
- **3-Level Hint System** — First letter, chunk meanings, full answer. No penalty for hints — just more practice
- **Memory Strength Dashboard** — Color-coded sentences: strong (green), shaky (yellow), at-risk (red), with level progress bars
- **Level and Category Filters** — Browse and filter all unlocked sentences by difficulty level and topic category

## Technical Details

Single HTML file architecture (84KB) with React 18 via CDN and Tailwind CSS. The SM-2 spaced repetition algorithm manages review scheduling with ease factor adjustment. Daily unlock logic calculates KST timezone offset to release 7 new sentences at 7:00 AM each morning — all client-side with no backend required. All progress data persists in localStorage. Web Speech API provides native TTS for pronunciation. The learning engine implements adaptive difficulty based on performance.
