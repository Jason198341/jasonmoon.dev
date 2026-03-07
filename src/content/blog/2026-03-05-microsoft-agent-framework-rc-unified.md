---
title: "Microsoft Unified Agent Framework Hits RC: Semantic Kernel Meets AutoGen in One SDK"
description: "Microsoft's Agent Framework RC merges Semantic Kernel and AutoGen into a single API surface for building production multi-agent systems. GA is imminent."
date: "2026-03-05"
category: dev
tags: ["microsoft", "semantic-kernel", "autogen", "multi-agent", "sdk", "rc", "enterprise"]
featured: false
---

## What Happened

Microsoft's unified Agent Framework has entered Release Candidate status with API lock — meaning the interface is stable and production evaluation can begin. The framework merges Semantic Kernel (Microsoft's enterprise AI orchestration library) and AutoGen (research-oriented multi-agent framework) into a single SDK with a unified API surface.

Key capabilities in RC: multi-agent orchestration with four composition patterns (sequential, concurrent, handoff, group-chat), support for multiple AI model providers, streaming-first design, and built-in telemetry. Both .NET and Python SDKs are available.

## Background

Microsoft has maintained two parallel multi-agent projects for the past two years. **Semantic Kernel** was the enterprise-focused option: production-hardened, deeply Azure-integrated, designed for teams that need audit trails and SLA guarantees. **AutoGen** was the research option: flexible, expressive, favored by academics and experimenters for its compositional patterns.

The unification was inevitable. Enterprise teams needed AutoGen's flexibility; researchers needed Semantic Kernel's reliability. The RC represents the point where Microsoft committed to a single path.

The API lock is the key detail. RC with frozen APIs means you can start building now without risking breaking changes at GA. For enterprise teams evaluating AI frameworks, this is the go signal.

## What This Means for Developers

This framework is likely to become the default choice for multi-agent systems in enterprise contexts, for the same reason React became the default for web UIs: it has the biggest corporate distribution channel (Azure) and covers the full spectrum from prototype to production.

The four orchestration patterns cover most real architectures:
- **Sequential**: Research agent → Writing agent → Review agent (pipeline)
- **Concurrent**: Multiple analysts working the same dataset simultaneously
- **Handoff**: Triage agent routes to specialized domain agents
- **Group chat**: Debate-style convergence on complex decisions

If you're currently using AutoGen or Semantic Kernel separately, the migration path to the unified framework is the right next step.

## Actionable Insight

Before GA drops, build one production-representative workflow using the RC. The `handoff` pattern is the most immediately useful: create a code-review agent that hands off to a test-generation agent when it flags functions without coverage. The handoff pattern teaches you the framework's coordination primitives, and you end up with tooling you'll actually keep.

Evaluate .NET vs Python based on your existing stack. Python examples in the repo are more complete right now; .NET has deeper Azure integration for identity and secrets management.
