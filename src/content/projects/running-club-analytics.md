---
title: Running Club Analytics
tagline: Building the club version — individual engine is live with 170+ runs of real data. Partner needed for scale.
description: Strava-connected club analytics platform — member rankings, group pace optimization, injury prevention monitoring, and GPS-based meetup recommendations. Proof of concept running with real data.
category: Concept
stack: [Astro SSR, React 19, TypeScript, Supabase, Strava API, PostGIS, Tailwind CSS v4]
live: https://jasonmoon.dev/archive/running-intelligence
image: /projects/running-club-analytics.png
projectType: Client
featured: false
order: 2
---

## The Problem

Running clubs face three challenges that Strava's built-in features don't solve:

**1. No group-level injury prevention.** Each member trains at different intensities, but there's no system to monitor the club's collective training load or flag members approaching overtraining before it becomes an injury.

**2. Suboptimal group runs.** Club runs default to the fastest runner's pace, alienating beginners. No tool suggests a pace that genuinely benefits every member based on their current fitness level.

**3. Meeting logistics waste time.** "Where should we meet?" is a weekly debate. GPS data from members' past runs could identify optimal meeting points — but no one aggregates it.

## The Proposed Solution

A Strava-connected platform that turns individual training data into team intelligence:

- **Member rankings & monthly awards** — Distance, consistency, most improved, top effort
- **ACWR-based group training plans** — "This Saturday, 6km at 5'30"/km keeps 80% of members in their optimal zone"
- **GPS-powered meetup recommendations** — Cluster analysis of members' run locations to suggest fair meeting points
- **Injury prevention dashboard** — Monitor each member's acute:chronic workload ratio, flag risks before they become injuries
- **Team personality & culture** — Aggregate individual running personalities into a club profile

## Architecture

```
Strava OAuth (per member)
        ↓
Activity Sync (Webhooks + Cache)
        ↓                    ┌──────────────────────┐
   Supabase DB  ────────→    │   Analytics Engine    │
  (PostgreSQL)               │  ACWR · Riegel · GPS  │
                             │  Clustering · Trends   │
                             └──────────┬───────────┘
                                        ↓
                    ┌───────────────────────────────────┐
                    │        Club Dashboard (SSR)       │
                    │  Rankings · Group Plans · Maps    │
                    │  Injury Alerts · Monthly Reports  │
                    └───────────────────────────────────┘
```

**Core stack**: Astro SSR + React 19 islands, Supabase (PostgreSQL + Auth + RLS), Strava Webhooks for real-time sync, PostGIS for spatial queries, Vercel Edge deployment.

## Working Proof of Concept

The individual analytics engine is **live in production** with real Strava data (170+ runs, 1,200+ km):

- [Running Dashboard](/archive/running) — Personal records, training frequency heatmap, distance & location filters, Today's Plan with injury boundary visualization
- [Running Intelligence](/archive/running-intelligence) — 12-section deep analytics: ACWR training load, race predictions (Riegel formula), pace trends, running personality radar, year-over-year comparison, route familiarity, milestone countdowns

Every computation shown in these pages — ACWR, race prediction, training boundary visualization, 7-scenario planning — is the **exact engine** that would power the club version. No mock data. No prototypes. Real analytics on real running data.

## Why This Exists as a Concept

This is a B2B SaaS opportunity, not a side project. Scaling from 1 to N users requires:

- **Real club partnerships** to validate product-market fit
- **Multi-user Strava OAuth** and privacy compliance
- **Webhook infrastructure** for sustainable API usage at scale (Strava rate limits: 1,000 requests/day)

The individual version proves the analytics work. The club version needs a partner.

## Let's Build It

If you run a **running club**, work at a **sports tech company**, or lead a **corporate wellness program** — the engine is built, the architecture is designed, and I'm ready to execute.

[Get in touch](/contact)
