---
title: Family Graph
description: Knowledge graph for family growth tracking. Map interests, values, and goals visually.
category: Web App
stack: [React, TypeScript, xyflow, Zustand, Fireworks AI, Tailwind CSS]
github: https://github.com/jasonmoon/family-graph
featured: true
order: 3
---

## What is Family Graph?

Family Graph is a knowledge graph application designed to track and visualize your family's growth — interests, values, events, and goals — all connected in an interactive graph.

## Key Features

- **5 entity types** — Person, Interest, Value, Event, Goal
- **8 relationship types** — Participates, Practices, Strengthens, Contributes, Influences, Supports, Learns, Achieves
- **Interactive graph view** — Powered by @xyflow/react with 5 custom node types
- **AI-powered extraction** — Chat with AI to extract entities and relationships from conversations
- **Multiple views** — Dashboard, Graph, Chat, Extract, Timeline
- **Local-first** — All data in localStorage with debounced persistence

## Technical Highlights

- React 19 with lazy-loaded views for performance
- Custom xyflow node types: PersonNode, InterestNode, ValueNode, EventNode, GoalNode
- Fireworks AI (deepseek-v3p1) for intelligent extraction
- Pretendard font for clean Korean/English typography

## Why I Built This

I wanted a way to see our family's journey holistically — not just a timeline of events, but a living map of how our interests, values, and goals interconnect and evolve.
