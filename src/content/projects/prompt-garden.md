---
title: Prompt Garden
tagline: The client needed prompt engineering to feel like design, not guesswork. So I built a visual IDE for it.
description: Visual prompt engineering workspace. Build, connect, and test AI prompts with a node-based editor. Shipped with custom domain.
category: Web App
stack: [React 19, TypeScript, xyflow, Zustand, Tailwind CSS v4, Vite 7]
github: https://github.com/Jason198341/prompt-garden
live: https://www.promptgarden.online
domain: promptgarden.online
image: /projects/prompt-garden.png
images: [/projects/prompt-garden.png, /projects/prompt-garden-canvas.png]
projectType: Client
flagship: true
featured: true
order: 1
---

## The Backstory

The client was spending hours writing AI prompts in a text box — copying, pasting, losing track of versions. They needed prompt engineering to feel like *design*, not guesswork. I proposed a visual approach: what if each piece of a prompt (role, topic, constraint, output format) was a draggable node on a canvas? Connect them like building blocks, see the assembled prompt in real-time, and save templates for reuse.

I added my own twist: a template library with factory patterns, localStorage persistence so nothing ever gets lost, and a canvas engine built on @xyflow/react that handles hundreds of nodes smoothly.

## Key Features

- **Node-based editor** — Drag, connect, and rearrange prompt components on an infinite canvas
- **6 node types** — Role, Topic, Constraint, Output, Context, Evaluator
- **Template system** — Start from pre-built templates with factory pattern
- **Real-time preview** — See the assembled prompt update as you build
- **Local persistence** — All data saved to localStorage, zero server dependency

## Technical Architecture

Built with React 19 + TypeScript on Vite 7. The graph engine uses @xyflow/react for the node canvas, Zustand for state management, and Tailwind CSS v4 with custom theme tokens. Everything runs in the browser — no backend, no accounts, no data leaving your machine.

## What I Added Beyond the Brief

- **Template factory system** — Start from pre-built prompt structures, customize from there
- **Zero-server architecture** — Everything runs in the browser. No accounts, no data leaving your machine
- **Custom theme tokens** — Tailwind CSS v4 with project-specific design system (garden green palette)
- **Shipped to custom domain** — promptgarden.online, live in production
