---
title: Investment Agent Swarm
tagline: Four AI agents analyzing the same stock, each from a different angle.
description: Multi-agent investment analysis platform where 4 specialized AI agents collaborate to provide comprehensive stock analysis across US and Korean markets.
category: Web App
stack: [React 19, TypeScript, Fireworks AI, Zustand 5, lightweight-charts, FastAPI, Tailwind CSS v4]
github: https://github.com/Jason198341/investment-agent-swarm
live: https://investment-agent-swarm.vercel.app
image: /projects/investment-agent-swarm.png
images: [/projects/investment-agent-swarm.png, /projects/ias-board.png, /projects/ias-chart.png, /projects/ias-trading.png, /projects/ias-watchlist.png, /projects/ias-briefing.png, /projects/ias-cross-market.png]
featured: true
order: 8
---

## The Problem

Stock analysis tools give you one perspective — usually technical charts or fundamental data, but rarely both. And none of them simulate the experience of having multiple expert analysts debate and synthesize a unified view.

## The Solution

Investment Agent Swarm deploys 4 specialized AI agents — Macro, Fundamental, Technical, and Sentiment — that analyze the same stock simultaneously, each from their domain expertise. They stream their analysis in real-time, then a consensus engine synthesizes their views into a unified investment thesis.

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

## Why I Built This

I wanted to simulate having a team of analysts looking at the same investment from completely different angles — macro trends, balance sheets, chart patterns, and market sentiment — then watching them converge (or disagree) in real time.
