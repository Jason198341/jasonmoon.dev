---
title: "Microsoft Agent Framework RC: Semantic Kernel and AutoGen Merge into One SDK"
description: "Microsoft's Agent Framework Release Candidate unifies Semantic Kernel and AutoGen into a single SDK with finalized APIs for multi-agent orchestration, Azure AI integration, and .NET/Python support."
date: "2026-03-10"
category: ai
tags: ["microsoft", "semantic-kernel", "autogen", "agent-framework", "azure-ai", "dotnet", "python", "enterprise"]
featured: false
---

Microsoft has released the Release Candidate for its Agent Framework, publishing `agent-framework-core` and `agent-framework-azure-ai` at version `1.0.0rc1`. The RC designation means the APIs are now stable and production evaluation can begin — breaking changes are no longer expected before GA.

The defining feature of this release: Semantic Kernel and AutoGen are now integrated into a single SDK. Teams that have been running experiments with both frameworks can converge on a unified stack.

## What the RC Actually Contains

The Agent Framework RC ships with three primary capabilities:

**Multi-agent orchestration**: Define agent topologies — pipelines, loops, hierarchies — using a consistent API surface. An agent that calls another agent, or a supervisor agent that routes tasks, uses the same primitives as a simple single-agent workflow.

**Azure AI integration**: First-class connectors for Azure OpenAI, Azure AI Foundry, and related Azure cognitive services. For enterprises running AI on Azure infrastructure, this is the obvious path to production.

**.NET and Python parity**: Both runtimes are supported with equivalent APIs. Teams building enterprise applications in .NET don't have to use Python wrappers; Python developers can use the same abstractions natively.

The consolidation of Semantic Kernel (Microsoft's earlier orchestration library) and AutoGen (the multi-agent research framework from Microsoft Research) addresses a real fragmentation problem. Teams have been building on both, and the patterns were compatible but not unified. The RC resolves that ambiguity.

## Where This Positions Microsoft in the Agent Stack Race

The enterprise AI agent landscape has been developing along two tracks: open-source frameworks (LangGraph, CrewAI, LlamaIndex) and platform-native solutions (Microsoft, AWS Bedrock Agents, Google Vertex AI Agents). The RC marks Microsoft's transition from the experimental phase to platform commitment.

For enterprises that are already deep in the Azure ecosystem, the calculus is straightforward: the Agent Framework is the path of least integration resistance. Azure credentials, Azure AI models, Azure monitoring — all of it works natively.

The more interesting decision point is for teams that are not Azure-committed. LangGraph and CrewAI have active communities and are vendor-neutral. The Agent Framework's strength is depth of Azure integration and the enterprise support tier that comes with it. Its weakness is the same: if you're not on Azure, you're building on someone else's platform.

## What to Evaluate Before GA

If you're assessing the Agent Framework RC for production consideration, the key evaluation questions:

**Observability**: Can you trace agent decisions and tool calls through Azure Monitor? Multi-agent systems are debugging nightmares without good telemetry. Test whether the built-in observability is sufficient for your use case.

**Cost predictability**: Multi-agent pipelines can generate unpredictable token usage. Evaluate the cost management features — rate limiting, budget caps, usage alerts — before running anything near production data.

**Semantic Kernel migration path**: If you're already using Semantic Kernel, test the migration path. The RC claims backward compatibility, but verify against your specific plugin implementations.

**AutoGen pattern translation**: If you built on AutoGen's ConversableAgent patterns, check how they map to the unified API. Some AutoGen patterns were designed for research flexibility, not production reliability.

## The Open-Source Alternative Question

LangGraph (from the LangChain team) and CrewAI are the primary open-source alternatives worth serious comparison. Both are production-capable and have shipped at enterprise scale. The practical difference is not capability — it's ecosystem and support model.

The Agent Framework RC is worth running in parallel evaluation against your preferred open-source alternative. The question you're answering: is the Azure integration depth worth the platform dependency, given your team's specific deployment target?

RC1 is a real signal that Microsoft considers this production-ready. GA will follow, and this will be the default enterprise agent development platform for the Azure ecosystem.

---

*Source: [InfoQ — Microsoft Agent Framework RC: Semantic Kernel and AutoGen unified SDK](https://www.infoq.com/news/2026/02/ms-agent-framework-rc/)*
