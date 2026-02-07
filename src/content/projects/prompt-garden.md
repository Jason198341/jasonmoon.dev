---
title: Prompt Garden
description: Visual prompt engineering workspace. Build, connect, and test AI prompts with a node-based editor.
category: Web App
stack: [React, TypeScript, xyflow, Zustand, Tailwind CSS, Vite]
github: https://github.com/jasonmoon/prompt-garden
featured: true
order: 1
---

## What is Prompt Garden?

Prompt Garden is a visual workspace for crafting AI prompts. Instead of writing prompts in a single text box, you build them by connecting modular nodes — roles, topics, constraints, output formats, and more.

## Key Features

- **Node-based editor** — Drag, connect, and rearrange prompt components visually using @xyflow/react
- **6 node types** — Role, Topic, Constraint, Output, Context, Evaluator
- **Template system** — Start from pre-built templates with factory pattern
- **Real-time preview** — See the assembled prompt as you build
- **Local persistence** — All data saved to localStorage, no account needed

## Technical Highlights

- Built with React 19 + TypeScript on Vite 7
- State management with Zustand
- Tailwind CSS v4 with custom theme tokens
- Zero-server architecture — everything runs in the browser

## Why I Built This

Prompt engineering is often a messy process of trial and error. I wanted a tool that lets you think about prompts structurally — breaking them into reusable components that you can mix, match, and iterate on visually.
