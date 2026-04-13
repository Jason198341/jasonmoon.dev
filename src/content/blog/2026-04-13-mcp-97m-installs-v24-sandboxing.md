---
title: "MCP at 97 Million Installs: v2.4 Mandates Sandboxing After 43% Vulnerability Rate"
description: "MCP has crossed 97 million installations and moved to open governance under the Linux Foundation. But a security audit found command injection vulnerabilities in 43% of implementations — prompting mandatory sandboxing in MCP v2.4."
date: "2026-04-13"
category: ai
tags: ["mcp", "model-context-protocol", "security", "linux-foundation", "ai-tools", "sandboxing"]
featured: false
---

Model Context Protocol has crossed 97 million installations as of March 2026. The number reflects MCP's emergence as the dominant standard for connecting AI models to external tools and data sources — but it also means the security implications of the protocol have become urgent at scale.

Anthropic donated MCP to the Linux Foundation under the AAIF (Agentic AI Foundation) in December 2025. The founding members include Anthropic, OpenAI, and Block. This governance transition is significant: MCP is no longer a proprietary Anthropic specification but an open standard with a formal standards body behind it.

## Why the Security Audit Changed Everything

Equixly's security evaluation of MCP implementations found command injection vulnerabilities in **43% of surveyed implementations**. This is not a theoretical finding — it's an empirical measurement of deployed code. When you have 97 million installations and nearly half of existing integrations have command injection vulnerabilities, the attack surface is substantial.

The 43% figure is what triggered MCP v2.4's most consequential addition: **mandatory tool sandboxing**. Previous versions recommended sandboxing as a best practice. v2.4 makes it a specification requirement, with runtime instrumentation added to enforce and audit compliance.

## What MCP v2.4 Requires

The v2.4 specification adds two categories of requirements that didn't exist in previous versions:

**Mandatory sandboxing**: MCP servers must execute tool calls within isolated execution environments that constrain filesystem access, network access, and process spawning to declared permissions. An MCP tool that was previously granted broad system access must now explicitly declare and justify that access in a permission manifest.

**Runtime instrumentation**: Servers must expose telemetry that clients can use to audit tool execution. This includes what resources a tool accessed, what it modified, and how long it ran. This makes post-hoc security analysis possible — and creates an audit trail that enterprises can require for compliance.

## The Governance Transition's Practical Effect

MCP being under Linux Foundation governance changes who controls the roadmap. Previously, Anthropic could accelerate or deprioritize security features based on its own priorities. Under AAIF, the specification process involves multiple stakeholders, including competing AI providers.

This has two effects in opposite directions:

**Slower iteration**: Multi-stakeholder governance slows feature velocity. Changes that Anthropic could have shipped in weeks now require working group consensus.

**Stronger enterprise credibility**: Enterprise procurement teams are skeptical of single-vendor protocols. A Linux Foundation-governed standard with OpenAI co-founding membership has the institutional credibility to pass enterprise security review boards that a proprietary Anthropic spec might not.

## What This Means for Developers Building MCP Servers

If you're building or maintaining an MCP server, v2.4 compliance requires concrete work:

**Audit your current permission scope**: What filesystem paths does your server access? What network requests does it make? v2.4 requires you to declare these explicitly and sandbox execution to match the declaration.

**Add runtime instrumentation**: If you're building on an MCP SDK, check whether your SDK version exposes the telemetry hooks v2.4 requires. Most major SDKs are in the process of updating.

**Review existing integrations for injection vectors**: The 43% vulnerability rate means the probability that your existing implementation has an issue is non-trivial. Equixly's audit used standard command injection test vectors — run your server against them before v2.4 enforcement arrives.

The 97M install milestone means MCP is now part of the infrastructure layer of AI applications, not an experimental feature. Infrastructure carries different security standards than experiments. v2.4 is the protocol catching up to that responsibility.

---

*Source: [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)*
