---
title: Sky Combat
tagline: 3D aerial dogfight game built with React Three Fiber — fly, shoot, survive the waves.
description: Browser-based 3D combat flight game with physics-based flight controls, enemy AI squadrons, weapon heat management, explosions, contrails, and procedural terrain — powered by Three.js and React.
category: Web App
stack: [React, TypeScript, Three.js, React Three Fiber, Zustand, Tailwind CSS, Vite]
github: https://github.com/Jason198341/sky-combat
image: /projects/sky-combat.png
images: [/projects/sky-combat.png, /projects/sky-combat-gameplay.png]
projectType: Personal
featured: true
order: 11
---

## What Is This

A 3D aerial combat game that runs entirely in the browser. You pilot a fighter jet through wave-based enemy encounters, managing weapon heat, altitude, and speed while dogfighting AI squadrons. Built with React Three Fiber for the 3D scene and Zustand for game state management.

## Key Features

- **Flight physics system** — Realistic-feeling controls with speed, altitude, banking, and momentum
- **Wave-based combat** — Enemy squadrons spawn in waves with increasing difficulty
- **Weapon heat management** — Overheat your guns and you're defenseless until cooldown
- **3D visual effects** — Contrails behind aircraft, explosion particles, bullet tracers
- **Procedural terrain** — Scrolling ground terrain generated below the action
- **Full HUD overlay** — Health bar, score, wave counter, speed/altitude indicators, weapon heat gauge
- **Game screens** — Title screen, pause menu, game over with score summary
- **Screen shake** — Camera shake on hits for visceral feedback

## Technical Architecture

The game is structured as a React app with Three.js rendering via React Three Fiber. Game logic is split into dedicated systems: `flightPhysics.ts` for movement, `enemyAI.ts` for squadron behavior, `collision.ts` for hit detection, `weaponSystem.ts` for firing and heat, and `inputController.ts` for keyboard/mouse handling. All game state lives in a Zustand store, making it trivially easy to access from any component — HUD reads score, GameLoop writes positions, screens check phase.

## Why I Built This

3D games in the browser have come a long way. I wanted to push React Three Fiber beyond simple visualizations into a real-time action game with physics, AI, and particle effects — all at 60fps in a browser tab.
