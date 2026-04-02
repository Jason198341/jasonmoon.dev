---
title: "MCPToolRouter: Cut LLM Tool-Call Token Costs by 70–80% with Local Semantic Routing"
description: "When your MCP server has 50+ tools, the JSON schema overhead alone burns 2,000+ tokens per call. MCPToolRouter solves this with local ONNX embeddings — no API cost, fully private."
date: "2026-04-02"
category: dev
tags: ["mcp", "llm", "tokens", "optimization", "onnx", "dotnet", "tool-routing"]
featured: false
---

## The Problem: MCP Tool Overhead Is Quietly Expensive

The Model Context Protocol (MCP) has become the standard way to give LLMs access to external tools. The pattern is elegant: define tools with JSON schemas, let the model decide which to call, execute and return results.

But there's a hidden cost that compounds fast.

Every MCP tool requires a JSON schema definition — typically 200–500 tokens per tool. With a modest set of 50 tools, you're spending **2,000–5,000 tokens just on tool declarations** before the model processes a single word of your actual prompt. At scale:

- 1,000 API calls/day × 3,000 token overhead = **3M extra tokens/day**
- At GPT-4o pricing: ~$9/day, ~$270/month — just in tool schema overhead
- For high-volume applications: this is not a minor line item

## What MCPToolRouter Does

[MCPToolRouter](https://elbruno.com/2026/03/27/stop-wasting-tokens-smart-tool-routing-for-llms-with-mcptoolrouter/) is a .NET library that intercepts tool selection before the LLM sees the full schema list.

The approach:

1. **Embed all tool descriptions** using a local ONNX model at startup (one-time cost)
2. **Embed the incoming query** at request time
3. **Semantic similarity search** — find the K most relevant tools for this specific query
4. **Send only those K tools** to the LLM instead of all 50+

The result: instead of sending 50 tool schemas, you send 5–8. Token reduction: **70–80%** on tool-related overhead.

The key advantage: **everything runs locally**. ONNX runtime, embeddings, similarity search — no external API calls, no latency added beyond local inference, no data leaving your environment.

## Why Local ONNX Matters

The alternative approaches have real downsides:

**Use an embedding API** (OpenAI, Cohere, etc.): Adds API latency + cost + data transmission. For a routing layer that runs on every request, this compounds badly.

**Reduce your tool count**: Works until it doesn't. Enterprise integrations routinely hit 50+ tools just covering standard business systems.

**Hardcode routing logic**: Brittle, doesn't generalize, requires maintenance every time tools change.

Local ONNX embeddings solve all three: fast (sub-millisecond inference on CPU), free, private, and generalizes automatically to new tools.

## Practical Implementation

MCPToolRouter integrates as middleware in your .NET MCP server. Rough pattern:

```csharp
// At startup: index all tool descriptions
var router = new MCPToolRouter(tools, embeddingModel: "all-MiniLM-L6-v2");

// Per request: get relevant subset
var relevantTools = await router.GetRelevantToolsAsync(
    query: userMessage,
    topK: 8
);

// Pass only relevant tools to LLM
var response = await llm.CompleteAsync(
    messages: messages,
    tools: relevantTools  // 8 instead of 50+
);
```

The embedding model (`all-MiniLM-L6-v2`) is 80MB — small enough to bundle with your application, fast enough to run on CPU in production.

## Performance Characteristics

Based on the published benchmarks:

| Scenario | Without Router | With Router | Reduction |
|----------|---------------|-------------|-----------|
| 50 tools, simple query | ~2,500 tokens | ~600 tokens | 76% |
| 100 tools, complex query | ~5,000 tokens | ~900 tokens | 82% |
| 20 tools, broad query | ~1,000 tokens | ~500 tokens | 50% |

The broad-query case shows diminishing returns (the router still selects ~10 tools when the query is genuinely ambiguous), but the common case of specific queries against large tool sets sees dramatic savings.

## When To Use This

**High-value scenarios**:
- MCP servers with 30+ tools
- High-volume applications (1,000+ calls/day)
- Privacy-sensitive environments where you can't use embedding APIs
- Latency-sensitive paths where external API calls aren't acceptable

**Low-value scenarios**:
- Under 15 tools — schema overhead is manageable
- Low-volume personal projects — absolute cost is small
- Non-.NET stacks (library is currently .NET only)

## The Broader Signal

MCPToolRouter is a symptom of MCP ecosystem maturity. The first generation of MCP servers was about making tools available. The second generation is about making tool selection efficient.

Expect similar patterns to emerge in other ecosystems — Python, TypeScript, Go — as MCP deployments scale up. The semantic routing pattern itself is language-agnostic; MCPToolRouter is just the first production-ready implementation.

If you're building an MCP-heavy system today, this is worth tracking. Even if you don't need it now, you will at scale.

**Links**: [El Bruno Blog](https://elbruno.com/2026/03/27/stop-wasting-tokens-smart-tool-routing-for-llms-with-mcptoolrouter/) | [NuGet Package](https://www.nuget.org/packages/MCPToolRouter)
