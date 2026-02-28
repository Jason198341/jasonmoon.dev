---
title: SentenceFlow
tagline: "외웠는데 왜 안 나오지?" — 한국인 영어 학습자의 가장 깊은 고통을 과학적으로 해결한다.
description: Progressive Chunking Recall 학습 엔진으로 영어 문장을 청크 분해 → 빈칸 채우기 → 완전 회상의 4단계로 체화하는 웹 서비스. SM-2 간격 반복, 3단계 힌트, 기억 강도 대시보드 포함.
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

Every Korean English learner knows the pain: you memorize a sentence, but when you need it in real life, your mouth freezes. Reading comprehension is fine — but production fails. I built SentenceFlow to attack this specific gap using four proven memory techniques combined into a single flow.

## Key Features

- **Progressive Chunking Recall** — 4-step learning: full sentence exposure → chunk decomposition → progressive fill-in-the-blank → complete recall from memory
- **SM-2 Spaced Repetition** — Sentences you struggle with appear more often; mastered ones fade to monthly reviews
- **3-Level Hint System** — First letter → chunk meanings → full answer. No penalty for using hints — just more practice
- **Memory Strength Dashboard** — See all your sentences color-coded: strong (green), shaky (yellow), at-risk (red)
- **Recall Speed Tracking** — Measures how fast you recall each sentence over time, visualizing fluency growth
- **Micro-Teaching on Errors** — Grammar explanations and usage tips appear exactly when you make a mistake
- **30 Curated Sentences** — Daily, Business, and Travel categories with native-level expressions

## Technical Details

Single HTML file architecture with React 18 via CDN and Tailwind CSS. The SM-2 spaced repetition algorithm manages review scheduling with ease factor adjustment. All progress data persists in localStorage. Web Speech API provides native TTS for sentence pronunciation. The learning engine implements adaptive difficulty — adjusting blank count and review frequency based on performance.
