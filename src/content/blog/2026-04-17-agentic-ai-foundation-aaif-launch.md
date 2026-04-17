---
title: "AAIF Launched: OpenAI, Anthropic, Google, and Microsoft Agree on How AI Agents Should Talk"
description: "The Agentic AI Foundation under Linux Foundation unites major AI companies around interoperability standards, with AGENTS.md already adopted by 60K+ projects."
date: "2026-04-17"
category: ai
tags: ["aaif", "agents-md", "interoperability", "openai", "anthropic", "standards"]
featured: false
---

The AI industry's biggest competitors just agreed on something: AI agents need a shared language. The Agentic AI Foundation (AAIF), co-founded by OpenAI under the Linux Foundation, brings together Anthropic, Google, Microsoft, AWS, Block, Bloomberg, and Cloudflare to build interoperability and open infrastructure for AI agent systems. The most concrete artifact so far is AGENTS.md -- a standard already adopted by over 60,000 open-source projects -- which may become as ubiquitous as README.md in codebases within the next year.

## What Happened

OpenAI announced the co-founding of AAIF in April 2026. The foundation operates under the Linux Foundation, which gives it the same governance structure as projects like Kubernetes, Node.js, and GraphQL. This is not a research consortium or a loose alliance -- it is an operational organization with a mandate to ship standards and infrastructure.

### Founding Members

| Company | Role |
|---------|------|
| OpenAI | Co-founder |
| Anthropic | Member |
| Google | Member |
| Microsoft | Member |
| AWS | Member |
| Block | Member |
| Bloomberg | Member |
| Cloudflare | Member |

### AGENTS.md Standard

AGENTS.md is the foundation's first major output. It is a file placed in a project's root directory that describes how AI agents should interact with the codebase. Think of it as a machine-readable instruction set that tells AI agents:

- What the project does and how it is structured
- Which tools and commands are available
- What conventions and patterns to follow
- How to run tests, lint, build, and deploy
- What files are off-limits or require special handling

The standard has already been adopted by 60,000+ open-source projects. It is supported by major AI coding tools including Cursor, Codex, Copilot, Devin, and Gemini CLI. When these tools encounter an AGENTS.md file, they use it to calibrate their behavior for that specific project.

### Interoperability Focus

Beyond AGENTS.md, AAIF's stated goals include open infrastructure for agent-to-agent communication, shared protocols for tool invocation, and standards for agent capability discovery. The foundation is explicitly positioning itself as a neutral ground where competing AI platforms can agree on the plumbing, even as they compete on the intelligence layer.

## Why It Matters

### AGENTS.md Is the package.json of Agent Interfaces

The analogy is precise. Before package.json, every JavaScript project had its own way of declaring dependencies, scripts, and metadata. Package.json standardized this, and the entire ecosystem -- npm, yarn, CI systems, IDEs -- built on top of that standard.

AGENTS.md is doing the same thing for AI agent interactions with codebases. Before AGENTS.md, each AI tool had to figure out a project's structure, conventions, and workflows through inference or trial and error. With AGENTS.md, this information is declared explicitly, and every tool reads the same source of truth.

The 60,000 adoption number is significant because it establishes a critical mass. Tool vendors now have a strong incentive to support the standard because their users' projects already include it. This creates a positive feedback loop: more tool support drives more project adoption, which drives more tool support.

### Competitors Cooperating on Infrastructure

The founding membership reads like a list of companies that compete fiercely on AI products. OpenAI and Anthropic are direct competitors in the foundation model space. Google and Microsoft compete across cloud, productivity, and AI services. Yet they are all at the same table agreeing on shared infrastructure.

This pattern has precedent. TCP/IP, HTTP, and containerization standards all emerged from competitors recognizing that interoperability at the infrastructure layer grows the total market more than proprietary lock-in. The AI agent space is reaching that maturity point. No single vendor can own the entire agent ecosystem, so standardizing the interfaces becomes a rational strategy.

### The Agent Ecosystem Gets Real

AAIF's existence signals that the industry views AI agents not as experimental features but as production infrastructure that needs governance, standards, and interoperability. This is the difference between "we built a cool agent demo" and "we are building the plumbing for a multi-vendor agent ecosystem."

For developers, this means the agent landscape is stabilizing. Investing time in learning agent patterns, adopting agent standards, and building agent-compatible infrastructure is increasingly safe because the major players have committed to a shared direction.

### What This Means for MCP and A2A

AAIF's interoperability mandate creates interesting dynamics with existing protocols. Model Context Protocol (MCP) handles tool invocation -- how an AI agent calls external tools. Agent-to-Agent (A2A) protocol handles agent communication -- how AI agents coordinate with each other. AGENTS.md handles project context -- how an AI agent understands a codebase.

These three standards address different layers:

| Layer | Standard | Purpose |
|-------|----------|---------|
| Project context | AGENTS.md | How agents understand codebases |
| Tool invocation | MCP | How agents call external tools |
| Agent communication | A2A | How agents talk to each other |

AAIF's role is likely to ensure these layers work together coherently rather than creating competing standards at each layer.

## What To Do About It

### 1. Add AGENTS.md to Your Projects Now

If you maintain any open-source project or even a private repository that you use AI tools with, create an AGENTS.md file. Start simple:

```markdown
# AGENTS.md

## Project Overview
Brief description of what this project does.

## Structure
Key directories and what they contain.

## Development
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Conventions
- Use TypeScript strict mode
- Follow conventional commits
- Tests required for all new features

## Off-Limits
- Do not modify generated files in `dist/`
- Do not change CI configuration without approval
```

This takes five minutes and immediately improves how every AI tool interacts with your project. As the standard evolves, you can add more detailed sections.

### 2. Standardize AGENTS.md Across Your Organization

If you work on a team, propose AGENTS.md as a standard file in your project template. Include it in your repository scaffolding tool. Make it part of the project setup checklist. Consistency across repositories means every AI tool performs predictably across your entire codebase.

### 3. Review What AI Tools You Use for AGENTS.md Support

Check whether your current AI coding tool reads AGENTS.md. As of April 2026, supported tools include Cursor, Codex, Copilot, Devin, and Gemini CLI. If your tool does not support it yet, it likely will soon given the 60K+ adoption rate. File a feature request if needed.

### 4. Watch the A2A + MCP + AGENTS.md Convergence

The three-layer model (project context, tool invocation, agent communication) is the emerging architecture for AI-assisted development. Understanding how these layers interact will be valuable as the ecosystem matures. Follow the AAIF's GitHub repositories and specification updates to stay current.

### 5. Contribute to the Standard

AAIF operates under the Linux Foundation, which means open governance and community contributions. If you have opinions about what AGENTS.md should include -- especially for specific frameworks, languages, or development patterns -- contribute to the specification. Standards shaped by real-world developer needs are better than standards designed in committee.

The founding of AAIF marks the point where AI agent development transitions from a collection of proprietary experiments to a coordinated ecosystem with shared standards. Whether AGENTS.md becomes as universal as .gitignore remains to be seen, but the trajectory and the backing are strong enough that ignoring it is no longer a reasonable position.

## Sources

- [OpenAI Blog: Agentic AI Foundation Announcement](https://openai.com/blog) (April 2026)
- [VentureBeat: AAIF Launch Coverage](https://venturebeat.com) (April 2026)
