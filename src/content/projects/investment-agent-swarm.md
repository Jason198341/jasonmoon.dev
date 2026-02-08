---
title: Investment Agent Swarm
tagline: The client wanted 4 AI analysts debating the same stock in real-time. I built the boardroom.
description: Multi-agent investment analysis platform where 4 specialized AI agents collaborate to provide comprehensive stock analysis across US and Korean markets.
category: Web App
stack: [React 19, TypeScript, Fireworks AI, Zustand 5, lightweight-charts, FastAPI, Tailwind CSS v4]
github: https://github.com/Jason198341/investment-agent-swarm
live: https://investment-agent-swarm.vercel.app
image: /projects/investment-agent-swarm.png
images: [/projects/investment-agent-swarm.png, /projects/ias-board.png, /projects/ias-chart.png, /projects/ias-trading.png, /projects/ias-watchlist.png, /projects/ias-briefing.png, /projects/ias-cross-market.png]
projectType: Client
featured: true
order: 8
---

## The Backstory

The brief was ambitious: build a virtual boardroom where 4 AI analysts — a macro economist, a fundamental analyst, a chart technician, and a sentiment reader — all look at the same stock and debate their views in real-time. Then a consensus engine synthesizes everything into a unified investment thesis with a confidence score.

I went beyond the brief: added mock trading with P&L tracking, TradingView-quality charts, daily AI briefings with text-to-speech, cross-market Korea-US correlation analysis, and watchlists with condition-based alerts. The result is less "stock screener" and more "AI investment team in your browser."

## Key Features

- **4 specialized agents** — Macro (violet), Fundamental (cyan), Technical (orange), Sentiment (pink) — each with distinct analysis frameworks
- **Real-time streaming** — All 4 agents analyze simultaneously with live streaming output
- **Consensus engine** — Synthesizes agent opinions into a unified signal with confidence score
- **US + Korean markets** — Dual market support with live data from Yahoo Finance
- **Mock trading** — Paper trading with portfolio tracking and P&L visualization
- **TradingView charts** — Professional-grade candlestick charts via lightweight-charts
- **AI briefing + TTS** — Daily market briefing with text-to-speech playback
- **Cross-market analysis** — US-Korea correlation and supply chain mapping
- **Watchlist with conditions** — Set price/volume alerts on tracked stocks

## Technical Architecture

React 19 SPA with Zustand 5 stores and lazy-loaded pages. Python FastAPI backend for local development (yfinance + FinanceDataReader), mirrored by TypeScript Edge Functions on Vercel for production. Fireworks AI (deepseek-v3p1) powers all 4 agents via streaming completion. lightweight-charts for TradingView-quality charting, Recharts for dashboard analytics.

## What I Added Beyond the Brief

- **Mock trading system** — Paper trading with portfolio P&L visualization
- **TTS briefings** — Daily AI market briefing with text-to-speech playback
- **Cross-market analysis** — US-Korea correlation and supply chain mapping
- **Dual backend** — Python FastAPI for local dev, TypeScript Edge Functions for production
- **7 distinct pages** — Board, Dashboard, Chart, Trading, Watchlist, Briefing, Cross-Market
