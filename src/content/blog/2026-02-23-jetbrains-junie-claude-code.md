---
title: "JetBrains Publishes Official Junie + Claude Code Dual-Agent Workflow for Go"
description: "JetBrains officially endorses combining Junie and Claude Code in GoLand, marking the shift from single-agent to multi-agent development."
date: "2026-02-23"
category: ai
tags: ["jetbrains", "junie", "claude-code", "go", "multi-agent", "ide"]
featured: false
---

## What Happened

JetBrains published an official guide on their Go blog titled "Write Modern Go Code with Junie and Claude Code," detailing a recommended workflow for using both AI agents together inside GoLand IDE. The guide is not a vague suggestion — it prescribes specific roles for each agent:

- **Claude Code** handles architecture design, large-scale refactoring, cross-file changes, and system-level reasoning. It operates from the terminal with full project context.
- **Junie** (JetBrains' built-in AI agent) handles IDE-internal tasks: writing and running tests, performing repetitive code transformations, generating boilerplate, and executing targeted fixes within individual files.

The key insight in the guide is that these two agents have complementary strengths. Claude Code excels at understanding the big picture and making sweeping changes across a codebase. Junie excels at the precise, IDE-integrated operations that benefit from deep knowledge of the project's type system, test framework, and build pipeline.

## Why This Matters

### The End of "One Agent to Rule Them All"

For the past year, the AI coding tool landscape has been dominated by a single question: which agent is best? Claude Code vs. Cursor vs. Copilot vs. Windsurf — developers picked one and committed. The implicit assumption was that a single agent should handle everything.

JetBrains is officially breaking that assumption. By publishing a guide that positions Junie and Claude Code as complementary rather than competing, they are establishing the **multi-agent workflow** as a legitimate, vendor-endorsed development pattern.

This matters because JetBrains is not a small player. They make IDEs used by millions of professional developers. When JetBrains says "use two agents together," it signals that the industry is moving toward agent orchestration as the standard, not agent monopoly.

### Why Go Specifically?

The choice of Go as the initial language for this guide is deliberate. Go's design philosophy — simplicity, strong typing, explicit error handling, and excellent tooling — makes it an ideal testbed for multi-agent workflows:

1. **Go's strict type system** means Junie can leverage GoLand's type inference to catch errors that a terminal-based agent might miss.
2. **Go's testing conventions** (table-driven tests, `_test.go` files) are formulaic enough that Junie can generate them efficiently while Claude Code focuses on the logic they test.
3. **Go's package system** creates natural boundaries where Claude Code handles cross-package architecture and Junie handles intra-package implementation.

Expect similar guides for Java (IntelliJ), Python (PyCharm), and Kotlin in the coming months.

### IDE Vendors Embracing External Agents

There is a subtler signal here. JetBrains could have positioned Junie as a complete replacement for Claude Code. Instead, they explicitly acknowledged that Claude Code does things Junie cannot. This is a strategic concession that reveals a broader truth: **no single IDE vendor can build an agent that matches a dedicated, model-native agent like Claude Code for complex reasoning tasks**.

By embracing Claude Code rather than competing with it, JetBrains is betting that the value of their IDE lies in integration, not in having the smartest standalone agent. This is probably the right bet. Developers do not want to choose between their IDE and their best AI agent — they want both working together.

## Impact on Developers

### Immediate: A New Workflow to Learn

If you use GoLand (or any JetBrains IDE), you now have a vendor-endorsed pattern to follow:

1. **Start with Claude Code** for project scaffolding, architecture decisions, and large refactors. Use it to design the module structure, define interfaces, and implement core logic across multiple files.
2. **Switch to Junie** for test generation, single-file fixes, and repetitive transformations. Use it for tasks where IDE integration provides a clear advantage — running tests inline, navigating type hierarchies, and applying structured code actions.
3. **Return to Claude Code** for code review, cross-cutting changes, and documentation generation.

This is not fundamentally different from how senior engineers already work — they use different tools for different tasks. The new element is that the "tools" are AI agents with different capabilities, and knowing when to use which one is a skill worth developing.

### Medium-Term: Agent Specialization Becomes Standard

The Junie + Claude Code pattern will generalize. Expect to see:

- **Cursor + Claude Code**: Cursor for its fast inline editing and Claude Code for multi-file refactoring
- **Copilot + Claude Code**: Copilot for autocomplete and Claude Code for agentic tasks
- **Domain-specific agents** that handle particular concerns: a security agent that reviews code, a performance agent that profiles and optimizes, a documentation agent that keeps docs in sync with code

The developer's skill set is expanding from "writing code" to "orchestrating agents." The best developers will not be the ones who use one agent most effectively — they will be the ones who compose multiple agents into a workflow that exceeds what any single agent can achieve.

### Long-Term: The Multi-Agent IDE

JetBrains' guide is a stepping stone toward a future where IDEs are multi-agent orchestration platforms. Instead of a single "AI assistant" button, imagine an IDE with:

- A **planning agent** that breaks tasks into subtasks
- A **coding agent** that implements each subtask
- A **testing agent** that generates and runs tests
- A **review agent** that catches bugs and style violations
- A **deployment agent** that handles CI/CD

Each agent is specialized, and the IDE orchestrates them. JetBrains, with their deep IDE expertise and Junie as their first-party agent, are well-positioned to build this future.

## What You Can Do Today

### 1. Try the Dual-Agent Workflow

If you use GoLand, follow JetBrains' guide directly. If you use another JetBrains IDE, adapt the pattern: use Claude Code from the terminal for big-picture tasks and Junie for IDE-integrated operations. The principle transfers across languages even if the specific guide is Go-focused.

### 2. Define Agent Boundaries Explicitly

The most common mistake in multi-agent workflows is not defining clear responsibilities. Before starting a task, decide: which parts does Claude Code handle? Which parts does Junie (or your IDE agent) handle? Writing this down — even informally — prevents the confusion of having two agents working on the same files simultaneously.

### 3. Invest in Claude Code Configuration

The quality of Claude Code's output improves dramatically with project-specific configuration. Create a `CLAUDE.md` file that describes your project's architecture, conventions, and patterns. This gives Claude Code the context it needs to make good architectural decisions, while Junie benefits from the IDE's own understanding of your codebase.

### 4. Watch for Multi-Agent Patterns in Your Stack

JetBrains' guide is the beginning, not the end. Pay attention to how other tool vendors position their AI features relative to standalone agents like Claude Code. The vendors that embrace multi-agent workflows rather than trying to be the single solution will likely build better products — and the developers who adopt these workflows early will have a productivity advantage.

The shift from "which agent is best" to "how do I combine agents" is a maturation of the AI coding ecosystem. It mirrors what happened with DevOps tools — no single tool won, but the developers who learned to compose them effectively became the most productive.

## Sources

- [Write Modern Go Code with Junie and Claude Code — JetBrains Blog](https://blog.jetbrains.com/go/2026/02/20/write-modern-go-code-with-junie-and-claude-code/)
