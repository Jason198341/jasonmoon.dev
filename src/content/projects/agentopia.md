---
title: Agentopia
tagline: "Freelancers were losing clients to 카톡 screenshots and 'did you get my payment?' texts. I built the one link that ends it."
description: "Client-flow SaaS for freelance developers — proposal, e-signed contract, invoice, and AI-written progress reports, all on a single no-login link. Zero commission: payments route directly to the freelancer's own bank/Toss/KakaoPay/Stripe. Bilingual (EN/KO), built and shipped end-to-end in one extended AI pair-programming session."
category: Web App
stack: [Next.js 16, React 19, TypeScript, Supabase, Fireworks AI, Resend, Stripe, Tailwind CSS v4]
live: https://agentopia.online
domain: agentopia.online
image: /projects/agentopia.png
images: [/projects/agentopia.png]
projectType: Personal
flagship: true
featured: true
order: -1
---

## The Backstory

I kept watching the same pattern repeat for freelance developers: a deal gets agreed over KakaoTalk, the contract is a screenshot passed back and forth, "did you get my payment?" becomes its own recurring conversation, and every week ends with typing out a status update by hand. The platforms built to fix this either take a 15-20% commission (크몽, 위시켓) or don't work outside the US/Canada at all (HoneyBook). Neither one is built for developers specifically — the killer feature a dev freelancer actually wants (their GitHub activity turning into a client report) doesn't exist anywhere.

So I built Agentopia: one portal link a freelancer sends their client. No login, no app — the client approves the proposal, e-signs the contract, pays by bank transfer/Toss/KakaoPay/PayPal/the freelancer's own Stripe, and reads progress updates, all on that single page. The platform never touches the money — by design, not just marketing. 0% commission is a structural fact, not a slogan.

The build itself was its own experiment: proposal-to-production in one extended Claude Code session, including a multi-agent strategy debate (a growth strategist, an adversarial critic, and an interaction designer arguing out the roadmap before I wrote a line of copy) and a security review pass that caught a real payment-rounding bug before it ever shipped.

## Key Features

- **One-link client portal** — proposal approval, e-signature, payment, and progress, no client account required
- **AI-drafted proposals** — a one-paragraph brief becomes a line-item quote; the freelancer keeps full control of pricing
- **AI-assisted contracts** — reads the approved proposal's line items and drafts the "Scope of Work" clause automatically; legal clause structure stays static and reviewed, never AI-generated wholesale
- **GitHub → weekly AI progress reports** — commits get read every Friday and rewritten into plain-language updates a non-technical client actually understands
- **Zero-commission payments** — bank transfer, Toss, KakaoPay, PayPal, or the freelancer's own Stripe key; funds go straight to the freelancer, encrypted-at-rest for any stored keys
- **Realtime dashboard** — a client's approval or signature reflects on the freelancer's screen instantly, no refresh
- **Recall & re-send** — a sent proposal or contract can be pulled back for edits (only before the client acts), with an automatic "update coming shortly" email so nothing looks like it vanished
- **Personal templates** — save any proposal or contract format once, reload it in any future project
- **Fully bilingual** — every client-facing surface (portal, contracts, emails) ships in Korean and English
- **Operator console** — a hidden admin view (email + GitHub-identity gated) for tracking real usage once it launches

## Technical Architecture

Next.js 16 App Router, Supabase for auth/Postgres/Realtime, Fireworks AI (Kimi K2.5) for all generative text, Resend for transactional email. Server actions handle every mutation with session-scoped RLS as the authorization boundary; the client portal instead resolves access through a 192-bit unguessable token via the service-role client, since the visitor has no session at all. Stripe integration uses the freelancer's own restricted API key rather than a platform account — the app never becomes a payment intermediary, which also keeps it outside Korea's PG/전자금융업 licensing requirements by design.

## What I Added Beyond the Original Idea

- **Multi-agent product strategy session** — spawned parallel subagents to argue growth strategy, adversarial risk, and UX before committing to the roadmap, including the decision to go Korea-first with bilingual support as a later layer
- **Fraud-aware payment UI** — a "verify this account through another channel before your first payment" notice on the portal, directly in response to the account-swap attack surface a no-login page introduces
- **Interactive landing demo** — instead of a screenshot, the marketing site embeds a click-through replica of the real approve → sign → pay flow, with a toggle to see it from the freelancer's side
- **Deletion policy with a legal backstop** — projects with a signed contract or a paid invoice can only be archived, never deleted; anything that fell through before that point deletes freely
