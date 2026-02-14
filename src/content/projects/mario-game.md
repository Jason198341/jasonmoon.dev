---
title: Super Mario Bros
tagline: A pixel-perfect Super Mario Bros clone built from scratch with pure TypeScript and Canvas API.
description: Classic side-scrolling platformer with tile-based levels, physics engine, sprite animation, enemy AI, and sound effects — no game engine, no dependencies, just TypeScript and HTML5 Canvas.
category: Web App
stack: [TypeScript, Canvas API, Vite]
github: https://github.com/Jason198341/mario-game
image: /projects/mario-game.png
images: [/projects/mario-game.png, /projects/mario-game-gameplay.png]
projectType: Personal
featured: true
order: 10
---

## What Is This

A faithful recreation of Super Mario Bros World 1-1, built entirely from scratch using TypeScript and the HTML5 Canvas API. No game engine, no physics library, no sprite framework — every pixel, every collision, every jump arc is hand-coded.

## Key Features

- **Pixel-perfect rendering** — 16x16 tile system scaled 3x, double-buffered canvas for smooth performance
- **Authentic physics** — Gravity, jump force with variable hold height, walk/run acceleration, air friction tuned to feel like the original
- **Full World 1-1 level** — 200+ column tile map with pipes, question blocks, bricks, coins, goombas, hills, and the flagpole
- **Enemy AI** — Goombas patrol, reverse on edges, and can be stomped. Collision detection handles all four sides
- **Particle system** — Brick fragments, coin pop animations, floating score popups
- **Sound effects** — Jump, coin, stomp, death, and victory sounds
- **HUD** — Score, coins, world indicator, countdown timer, lives counter
- **Game states** — Title screen, playing, dying animation, game over, win sequence

## Technical Architecture

The game runs on a fixed-timestep game loop with a double-buffered canvas renderer. A native-resolution buffer (272x224) is drawn first, then scaled up to the display canvas for crisp pixel art. The level is defined as a 14-row string array where each character maps to a tile type. Camera follows the player with edge clamping. Input is polled per frame with "just pressed" detection for responsive jumping.

## Why I Built This

Wanted to understand how classic 2D platformers actually work under the hood — tile collision, variable jump height, enemy behavior, camera scrolling. Building without a game engine forces you to implement everything from first principles. The result: a playable Mario clone in ~1000 lines of TypeScript.
