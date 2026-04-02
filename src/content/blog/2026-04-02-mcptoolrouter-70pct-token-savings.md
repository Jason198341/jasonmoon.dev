---
title: "MCPToolRouter: Cut LLM Tool-Call Token Costs by 70–80% with Local Semantic Routing"
description: "When you have 50+ MCP tools, their JSON schemas alone consume 2,000+ tokens per call. MCPToolRouter uses local ONNX embeddings to route only relevant tools to the LLM — no API cost, no privacy tradeoff."
date: "2026-04-02"
category: ai
tags: ["mcp", "token-optimization", "llm", "tool-use", "onnx", "dotnet", "cost-reduction"]
featured: false
---

Every time you invoke an LLM with MCP tool support, you're paying for tool schemas that the model probably doesn't need.

With 10 tools, this overhead is manageable — maybe a few hundred tokens. With 50+ tools (which is increasingly common as MCP ecosystems grow), the JSON schema payload alone can hit 2,000 tokens per call, before you've sent a single word of your actual task.

[MCPToolRouter](https://elbruno.com/2026/03/27/stop-wasting-tokens-smart-tool-routing-for-llms-with-mcptoolrouter/) solves this with local semantic routing: instead of dumping every tool's schema into the prompt, it uses an ONNX embedding model running locally to identify which tools are most relevant to the current request and passes only those.

The claimed savings: **70–80% reduction in tool-related token consumption**.

## How It Works

The core architecture is straightforward:

1. **Embedding index**: At startup, MCPToolRouter embeds each tool's name and description using a local ONNX model (no API call required).
2. **Query-time routing**: When a request comes in, the router embeds the query and runs semantic similarity search against the tool index.
3. **Filtered payload**: Only the top-N most similar tools (configurable) get included in the LLM context.

The result: instead of sending 50 tool schemas, you might send 3–5 relevant ones. Token consumption drops dramatically.

## The Key Properties

**Fully local execution**

The ONNX runtime runs the embedding model on your hardware. No external API calls, no data leaving your environment, no per-request costs. This is critical for enterprise and privacy-sensitive deployments.

**No model dependency**

MCPToolRouter is model-agnostic. It works with any LLM that accepts tool/function definitions via standard JSON Schema — OpenAI-format, Anthropic-format, or custom.

**Zero additional cost**

The embedding model is the only compute overhead, and it runs locally on CPU. For most use cases, the latency addition is negligible (milliseconds) compared to the LLM call itself.

**Semantic, not keyword**

This isn't grep-based tool filtering. The semantic similarity means "resize image" will correctly route to an image manipulation tool even if the exact words don't match the tool name.

## When This Matters

**MCP server with 20+ tools**: Already at this scale, token overhead is noticeable. MCPToolRouter pays for itself in saved tokens within a few hundred calls.

**Developer productivity setups**: If you run a unified MCP server that aggregates filesystem, git, database, web search, code execution, and project management tools together, you easily hit 50+ tool definitions. Without routing, you're burning context window on tools irrelevant to every single request.

**Multi-agent pipelines**: In agent orchestration systems, each LLM call in the pipeline accumulates overhead. Multiply 2,000 wasted tokens × 10 agent steps × 1,000 runs per day = 20M unnecessary tokens daily. At any non-trivial scale, this becomes a real cost line.

**Rate-limited models**: Token-per-minute limits matter as much as cost for high-throughput applications. Reducing token usage directly increases throughput ceiling.

## The Practical Tradeoff

Semantic routing introduces a failure mode: the router might exclude a relevant tool if the query phrasing doesn't surface semantic similarity.

Mitigations:
- Set the top-N threshold conservatively (e.g., top 8–10 tools rather than top 3) to reduce false exclusions.
- Include a fallback mechanism: if the LLM indicates it needs a tool not in the filtered set, re-route with expanded context.
- Maintain a "always include" list for critical safety or guardrail tools that should never be filtered out.

## Implementation Notes (for .NET Stack)

MCPToolRouter is a .NET library. If you're working in a Node.js or Python MCP environment, you'll need a bridging approach:
- Run MCPToolRouter as a sidecar service with a lightweight JSON API
- Call it from your main agent process to get the filtered tool list
- Pass the filtered list to your LLM client

The architecture is simple enough that porting the core logic to other languages (the ONNX runtime has bindings for Python, Node.js, Java, etc.) is feasible for motivated teams.

## The Bigger Picture

MCPToolRouter is a symptom of MCP ecosystem maturity. When the ecosystem had 10–20 tools, brute-force inclusion worked fine. Now that MCP registries list hundreds of servers and production deployments commonly aggregate dozens of tool categories, intelligent filtering isn't a nice-to-have — it's necessary infrastructure.

Expect this pattern (semantic tool routing, tool taxonomies, dynamic tool loading/unloading) to become standard in MCP client libraries within the next few months. The problem is well-understood; the solutions are just beginning to crystallize.

If you're running a large MCP setup today, [MCPToolRouter](https://elbruno.com/2026/03/27/stop-wasting-tokens-smart-tool-routing-for-llms-with-mcptoolrouter/) is worth evaluating immediately. The token savings alone justify the integration cost.

---

*Source: [El Bruno Blog — Stop Wasting Tokens: Smart Tool Routing for LLMs with MCPToolRouter](https://elbruno.com/2026/03/27/stop-wasting-tokens-smart-tool-routing-for-llms-with-mcptoolrouter/)*
