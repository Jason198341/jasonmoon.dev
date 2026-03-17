---
title: "Perplexity's CTO Said They're Leaving MCP. Here's What 143K/200K Token Overhead Actually Means."
description: "The MCP departure announcement from Ask 2026 isn't about the protocol being broken — it's about token economics reaching a breaking point for certain use cases. Understanding the math explains why."
date: "2026-03-17"
category: ai
tags: ["mcp", "model-context-protocol", "perplexity", "ai-architecture", "llm-tools", "agent-api", "developer-tools"]
featured: false
---

At the Ask 2026 conference on March 11, Perplexity CTO Denis Yarats announced that Perplexity is moving away from MCP in favor of their own Agent API. The quote getting circulated: "We're leaving MCP." The important context that's getting less attention: why, and what it reveals about a structural problem in how tool-using AI systems are currently built.

The short version: at Perplexity's scale, MCP's tool metadata overhead consumes 143,000 of their 200,000 token context window — 72% — before a single user query is processed.

## The Token Math

MCP works by registering tools (functions the model can call) at the start of each conversation. Each tool requires a schema definition: name, description, input parameters, return types, error states. For a handful of tools, this overhead is negligible. For a production AI assistant with broad capabilities, the math deteriorates quickly.

At Perplexity's tool count, each conversation starts with 143K tokens already consumed. The model's effective working context for user input, conversation history, and reasoning is the remaining 57K tokens — less than a third of the nominal context window.

The 40–50% tool metadata overhead Yarats cited isn't a Perplexity-specific edge case. It's the math of MCP at production scale. Any system with 50+ tools registered in MCP faces the same problem. The larger the tool library, the worse the effective context ratio.

## Why MCP Was Designed This Way

MCP's upfront tool registration approach was a deliberate design choice, not an oversight. When the protocol was designed, the primary use case was giving LLMs access to a curated set of tools (search, calculator, code execution) in controlled environments. A fixed schema at session start makes the model's available capabilities explicit and stable throughout the conversation.

The problem is that "production AI assistant at scale" wasn't the primary design target. Perplexity is running thousands of tools. The schema-at-start assumption worked fine for 10–20 tools. It breaks at 100+.

## What the Agent API Approach Changes

Perplexity's Agent API replaces tool schema registration with a single API endpoint and a single API key. Instead of declaring all available tools upfront, tools are invoked through the endpoint with dynamic parameters. The model doesn't receive a 143K token schema inventory — it sends structured requests to a runtime that resolves them.

The tradeoff: the model loses explicit knowledge of what tools are available. In MCP, the model can reason about its capabilities from the schema. In an endpoint-based approach, tool discovery either happens through a lighter-weight capability manifest or through runtime error handling.

For Perplexity's specific product — a search-heavy assistant where the set of available capabilities is relatively stable and users don't need to understand the tool inventory — this tradeoff is clearly worth it. For systems where the model needs to reason about which combination of tools to chain together dynamically, the tradeoff is less obvious.

## "MCP Is Not Dead, But Needs to Evolve"

Yarats was careful to frame this as evolution, not failure. The MCPAgentBench benchmark (arXiv, December 2025) — a real-world evaluation suite for MCP tool usage — is evidence that the protocol has genuine research and production adoption. 97 million downloads as of March 2026 (per recent data) suggests the ecosystem isn't going anywhere.

What Perplexity's departure does is put pressure on the specific architectural assumption that's causing the problem. The protocol doesn't require upfront full schema registration in principle — that's an implementation choice. A few directions that would preserve MCP compatibility while addressing the overhead problem:

1. **Lazy loading**: Register tool schemas on-demand when the model first invokes a tool category, rather than preloading all schemas
2. **Capability manifests**: Replace full schemas with lightweight tool fingerprints (name + one-line description + invocation endpoint), load full schemas only when the tool is selected
3. **Context-sensitive registration**: Register only the tools relevant to the current task type at session start, with a discovery mechanism for tools outside the initial set

None of these require breaking MCP compatibility. They require tool implementers to support multiple registration modes.

## What This Means for Developers Building on MCP

If you're building an MCP-integrated system with a small tool set (under 20–30 tools), token overhead isn't your constraint. MCP's developer experience advantages — standardized schemas, broad LLM compatibility, ecosystem tooling — outweigh the overhead cost.

If you're building production systems with large tool libraries, the math Perplexity is running is your math too. The practical options are:

- **Dynamic tool registration**: Only register tools relevant to the current session context
- **Tool namespacing**: Group tools into namespaces, register namespace-level metadata only, load individual tool schemas on invocation
- **Hybrid approach**: Core tools in MCP, extended capabilities through a lighter endpoint interface

The authentication friction Yarats also mentioned — MCP's token complexity for secure tool access — is a separate concern but compounds the problem. Large-scale MCP deployments often require per-tool authentication flows that add both token overhead and operational complexity.

## The Structural Takeaway

Perplexity leaving MCP is a signal that production-scale AI systems are hitting the edges of protocol assumptions designed for smaller deployments. This is a normal phase of technology maturation — the initial design works, adoption grows beyond the design parameters, and the protocol either adapts or gets bypassed.

For the developers watching this space: building on MCP today is still the right call for most use cases. But architect your tool registration system to support dynamic loading from the start. The teams that assumed static upfront registration would always work fine are the ones who'll face the same math problem Perplexity is solving now.

---

*Source: [Versalence — Long Live MCP: Why MCP Is Facing an Evolution in 2026](https://blogs.versalence.ai/mcp-model-context-protocol-evolution-2026)*
