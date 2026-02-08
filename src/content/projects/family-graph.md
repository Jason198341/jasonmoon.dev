---
title: Family Graph
tagline: How does my daughter's love of drawing connect to our family values? I built a graph to find out.
description: Interactive knowledge graph that maps your family's interests, values, goals, and growth — all connected visually.
category: Web App
stack: [React 19, TypeScript, xyflow, Zustand 5, Fireworks AI, Tailwind CSS v4]
github: https://github.com/Jason198341/family-graph
live: https://family-graph-six.vercel.app
image: /projects/family-graph.png
images: [/projects/family-graph.png, /projects/family-graph-dashboard.png]
projectType: Personal
featured: true
order: 4
---

## The Backstory

Our family's life felt like scattered sticky notes — soccer on Tuesday, art class on Thursday, "we should camp more," "she's getting interested in science." All disconnected. I wanted to zoom out and see the big picture: how does my daughter's love of drawing connect to our family value of creativity? How does a camping trip relate to our goal of spending more time outdoors?

So I built a knowledge graph. People, interests, values, events, and goals — all mapped as nodes and edges you can explore visually. Talk to the AI and it extracts relationships from your family stories automatically.

## Key Features

- **5 entity types** — Person, Interest, Value, Event, Goal
- **8 relationship types** — Participates, Practices, Strengthens, Contributes, Influences, Supports, Learns, Achieves
- **Interactive graph** — Custom xyflow node types with drag, zoom, and connection editing
- **AI extraction** — Chat with AI to extract entities and relationships from natural conversation
- **5 views** — Dashboard, Graph, Chat, Extract, Timeline
- **Local-first** — All data in localStorage with debounced persistence

## Why I Built This

I wanted to see our family's journey holistically — not just a timeline of events, but a living map of how our interests, values, and goals interconnect and evolve together.
