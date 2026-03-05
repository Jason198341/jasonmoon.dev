---
title: "35% of Cursor PRs Are Now Agent-Generated — Agentic Coding Just Became the Default"
description: "Cursor's major update adds autonomous VM execution with full observability. One-third of all PRs on the platform are now created without a human writing a single line."
date: "2026-03-05"
category: ai
tags: ["cursor", "agentic-coding", "ai-agent", "pull-request", "developer-tools", "autonomous"]
featured: false
---

## What Happened

Cursor announced a major platform update centered on autonomous agent execution. The headline capability: Cursor's agent now runs in an isolated VM, writes code, runs its own tests, observes the results, and iterates — recording the entire process as video, logs, and screenshots for human review.

Trigger points expanded significantly. Agents can now be activated from web, desktop, mobile, Slack, and GitHub — meaning a Slack message can kick off a full development cycle that ends with a PR opened for review.

The stat that captures the shift: approximately 35% of all PRs on the Cursor platform are now generated entirely by agents, with no human writing code in the branch.

## Background

"AI-assisted coding" has meant different things at different stages. In 2023, it meant autocomplete. In 2024, it meant inline chat and code generation from prompts. In 2025, it meant multi-file edits and context-aware refactors.

In 2026, the definition shifted again: an agent that opens your repo, writes code to specification, runs tests, fixes failures, and creates a PR for you to approve. The human role in the loop moved from author to reviewer.

The isolated VM execution model is crucial to this. Previous agentic approaches ran agents in the same environment as the developer's code, creating risk and requiring careful sandboxing. A dedicated VM per agent run removes that constraint — agents can install packages, run servers, execute shell scripts, without touching the host environment.

35% of PRs being agent-generated is not a benchmark or a benchmark target. It's an observed metric from real users on a production platform. This is what the actual distribution looks like when you give developers good enough tools.

## What This Means for Developers

**The review skill becomes more important than the write skill.** When 35% of code is agent-written, the highest-leverage human contribution is identifying what the agent got wrong, not writing the correct code in the first place. Code review becomes the core engineering discipline.

**The specification skill becomes more important.** Agents produce output proportional to input quality. A vague task description produces vague code. Clear, testable specifications with explicit acceptance criteria produce PRs you can approve with confidence.

**The 65% that isn't agent-generated is the interesting data.** Those are the tasks where human judgment, domain context, or architectural creativity still outperform agents. Understanding that boundary is the key to staying effective in an agent-saturated development environment.

## Actionable Insight

Start treating agent-generated PRs as a distinct workflow, not an extension of manual coding. Create a PR review checklist specifically for agent work: Does it have tests? Does it handle the error cases you care about? Does it follow your naming conventions? A good checklist catches the systematic weaknesses agents have — missing edge cases, over-generic variable names, test coverage that passes but doesn't assert the right things.

The 35% number will keep climbing. Build the review muscle now.
