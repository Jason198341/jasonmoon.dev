---
title: "Microsoft Agent Framework RC: Semantic Kernel + AutoGen Merge Into a Single Production-Ready SDK"
description: "Microsoft's Agent Framework Release Candidate unifies Semantic Kernel and AutoGen under one SDK with locked APIs, multi-agent orchestration, and Azure AI integration. The 1.0 production clock is ticking."
date: "2026-03-10"
category: ai
tags: ["microsoft", "agent-framework", "semantic-kernel", "autogen", "azure", "multi-agent", "enterprise"]
featured: false
---

Microsoft has shipped the Release Candidate for its Agent Framework — meaning the API is now locked and production evaluation is officially open. This is the moment to pay attention to what the enterprise AI agent stack is becoming.

## What's in the RC

The framework unifies two previously separate Microsoft projects:

- **Semantic Kernel** — Microsoft's orchestration layer for LLM-based applications, with strong enterprise integration and plugin architecture
- **AutoGen** — the multi-agent conversation framework from Microsoft Research, known for agent-to-agent communication patterns

Previously, teams had to choose between them (or use both awkwardly). The RC merges them under:

- `agent-framework-core` v1.0.0rc1 — core orchestration, planning, and agent lifecycle
- `agent-framework-azure-ai` v1.0.0rc1 — Azure AI Foundry integration, model selection, telemetry

Both **.NET and Python** are supported at RC parity. Java and JavaScript are planned but not RC yet.

## What "RC" Actually Means for Evaluators

RC means:

1. **The API won't change** before 1.0 — code written against RC can be promoted to production without refactoring
2. **Production evaluations are appropriate** — this is the stage where teams should run it against real workloads
3. **Breaking changes from beta are in** — if you evaluated earlier betas, read the migration guide

For teams currently using LangGraph, CrewAI, or other open-source orchestration frameworks, this is the moment to run a side-by-side evaluation. Not because Microsoft is better — the tooling is younger — but because the enterprise integration story (Azure, Active Directory, compliance logging) is stronger, and for large organizations that matters.

## The Strategic Picture

Microsoft's trajectory is clear: dominate enterprise AI agent infrastructure the same way Azure dominates enterprise cloud. The playbook:

1. Develop open-source frameworks (Semantic Kernel, AutoGen) with strong community adoption
2. Integrate them with Azure AI services for enterprise value-add
3. Unify into a single SDK with locked APIs for enterprise confidence
4. Connect to Microsoft 365 Copilot, Teams, and the broader Microsoft product suite

Step 3 just happened. Step 4 is the medium-term roadmap.

## Open Source Alternatives: Still Valid

LangGraph and CrewAI maintain genuine advantages:

- **More mature ecosystems** — more tutorials, community patterns, third-party integrations
- **Cloud-agnostic** — not tied to Azure
- **Faster iteration** — RC stability is a constraint, not just a feature

The honest framing: if you're building on Azure and need enterprise compliance features, Microsoft's RC deserves serious evaluation. If you're cloud-agnostic or moving fast with smaller teams, the open-source options likely still have the edge.

The market isn't winner-take-all here. Different organizational contexts favor different choices, and the RC is the right prompt to explicitly revisit which framework fits your context.

---

*Source: [InfoQ — Microsoft Agent Framework RC: Semantic Kernel and AutoGen Unified (2026-02)](https://www.infoq.com/news/2026/02/ms-agent-framework-rc/)*
