---
title: Planner 2026
tagline: My kids forget what they studied yesterday. So I built a calendar that remembers for them — on Day 1, 4, 7, and 14.
description: Ebbinghaus forgetting curve-based review calendar that auto-generates D+1, D+4, D+7, D+14 spaced repetition schedules from study logs.
category: Web App
stack: [React 19, TypeScript, Zustand 5, Recharts, Tailwind CSS v4, Vite 7]
github: https://github.com/Jason198341/planner-2026
live: https://planner-2026-three.vercel.app
image: /projects/planner-2026.png
images: [/projects/planner-2026.png, /projects/planner-2026-dashboard.png]
projectType: Personal
featured: true
order: 8
---

## The Backstory

My kids would study hard one day, then completely forget it by the weekend. I'd ask "didn't you just learn that?" and get a blank stare. The problem wasn't effort — it was timing. The Ebbinghaus forgetting curve shows we lose 80% of new information within a week without review. The fix is simple: review at Day 1, 4, 7, and 14.

But no app made this automatic. You'd have to manually schedule each review. So I built a calendar where you just log what you studied, and it auto-generates all four review checkpoints.

## Key Features

- **Auto-scheduling** — Record a study session and 4 review tasks appear on D+1, D+4, D+7, D+14
- **4-color calendar** — Green (studied), Blue (reviews done), Orange (reviews pending), Red (overdue)
- **3-level retention check** — Rate each review with emoji feedback (great/okay/forgot)
- **Built-in stopwatch** — Track focus time with start/stop timer
- **4-color importance** — Highlight-pen style priority markers (green, yellow, orange, pink)
- **GitHub-style heatmap** — Annual activity visualization
- **Dashboard analytics** — Weekly completion rate, subject distribution, study streaks

## Technical Architecture

React 19 with Zustand 5 for state management. Study entries and review tasks use a 1:4 relationship model — each study log generates exactly 4 review tasks linked by `entryId`. Recharts powers the dashboard charts. All data persists in localStorage with a clean partialize strategy that excludes transient timer state.

## Why I Built This

Spaced repetition works. The science is clear. But my kids needed something dead simple — log what you studied, and the calendar handles the rest. No complex settings, no manual scheduling. Just study and review.
