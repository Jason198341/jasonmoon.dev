---
title: My Daily Diary
tagline: Sometimes the simplest apps carry the heaviest thoughts. No backend, no login — just you and your words.
description: A minimalist web diary app with mood tracking, photo attachments, dark mode, and full localStorage persistence — built as a single HTML file with React and Tailwind CSS.
category: Web App
stack: [React 18, Tailwind CSS, LocalStorage, Babel]
github: https://github.com/Jason198341/my-daily-diary
live: https://diary-app-jade-psi.vercel.app
image: /projects/diary-app.png
projectType: Personal
featured: true
order: 21
---

## The Backstory

I wanted to build something personal — a digital diary that feels like opening a real notebook. No sign-ups, no cloud sync, no social features. Just a clean space to write down thoughts, track how I'm feeling, and look back on past days. The constraint was simple: make it work as a single HTML file that anyone can open in a browser.

## Key Features

- **Mood tracking** — Pick from 8 emoji moods (😊😢😡😴🥰😐🤩😰) to tag how your day felt
- **Photo attachments** — Add images directly to diary entries via drag-and-drop
- **Dark mode** — Automatic system detection + manual toggle for late-night writing
- **Search & filter** — Full-text search across all entries, filter by month or mood
- **Zero-dependency persistence** — All data lives in localStorage, survives refreshes
- **Stats dashboard** — See total entries, monthly count, and your most frequent mood
- **Edit & delete** — Full CRUD with confirmation dialogs to prevent accidents
- **Single-file architecture** — Entire app is one HTML file, no build step required

## Technical Details

The entire application is contained in a single `index.html` file — React 18 loaded via CDN, Tailwind CSS via the play CDN, and Babel for in-browser JSX transformation. State management uses React hooks with `useCallback` for performance. Data persistence happens through `localStorage` with JSON serialization, and photos are stored as base64 data URLs. The UI features scroll-based animations, glassmorphism headers, and responsive design that works from mobile to desktop.
