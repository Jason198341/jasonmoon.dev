---
title: "Claude Code v2.1.89: PreToolUse Defer, 300K max_tokens GA, and 20+ Fixes That Actually Matter"
description: "The latest Claude Code update adds hook system improvements, fixes the CJK history bug, and ships 300K max_tokens GA for the Batches API — here's what actually changes in practice."
date: "2026-04-02"
category: dev
tags: ["claude-code", "anthropic", "changelog", "hooks", "300k", "batches-api", "updates"]
featured: false
---

## The Headline Numbers

Claude Code v2.1.89 ships 20+ changes. The ones that matter:

1. **`"defer"` decision in PreToolUse hooks** — hooks can now pause and re-evaluate
2. **`PermissionDenied` hook notifications** — know when auto-approval was blocked
3. **CJK/emoji history bug fixed** — 4KB limit causing history corruption in Asian-language codebases
4. **autocompact infinite loop fixed** — sessions with large context were occasionally spinning
5. **300K max_tokens GA** — Opus 4.6 and Sonnet 4.6 via Message Batches API
6. **Fine-grained tool streaming GA** — streaming partial tool results as they arrive
7. **Structured outputs GA** — reliable JSON schema enforcement in responses

## Hook System: What `"defer"` Actually Enables

The existing PreToolUse hook had two options: `"allow"` (proceed) or `"block"` (stop). The new `"defer"` option adds a third: **pause and re-evaluate with additional context**.

Practical use case: you have a hook that checks whether a file edit is safe. Previously, you had to make that decision with only the tool call parameters. With `"defer"`, your hook can:

1. Receive the tool call parameters
2. Fetch additional context (check git status, read dependent files, query your own policy service)
3. Return a final `"allow"` or `"block"` with full context

This is particularly valuable for **agentic workflows** where the safety of an action depends on accumulated state — what files have already been modified, what the current test status is, whether a deployment is in progress.

The `PermissionDenied` hook complements this: you now get a callback when an auto-approval is blocked, allowing your orchestration layer to detect and handle blocked actions rather than silently failing.

## The CJK/Emoji History Bug: More Important Than It Sounds

The 4KB history corruption bug affected any Claude Code session using:
- Chinese, Japanese, or Korean characters in code or comments
- Emoji in commit messages, variable names, or output
- Multi-byte UTF-8 sequences in filenames or strings

The bug caused history entries to get truncated at byte boundaries rather than character boundaries, which could corrupt the serialized history. In multi-session workflows, corrupted history meant lost context and unpredictable behavior.

If you work with CJK codebases (including common Korean startup tech stacks) or use emoji extensively — **update immediately**. This is a correctness fix, not just a cosmetic improvement.

## 300K max_tokens: What You Can Actually Do With It

Message Batches API now supports 300,000 max_tokens per request with Opus 4.6 and Sonnet 4.6. To put this in practical terms:

| Task | Approximate Token Usage |
|------|------------------------|
| Full Next.js project (typical) | 50,000–100,000 tokens |
| Large monorepo service | 100,000–200,000 tokens |
| Full codebase review + recommendations | 200,000–300,000 tokens |
| Multi-file refactoring with tests | 100,000–150,000 tokens |

Single-call workflows that previously required chunking and multi-step orchestration can now run as atomic operations. For batch processing pipelines — nightly code reviews, automated documentation generation, large-scale analysis — this dramatically simplifies architecture.

The catch: 300K token calls are expensive in absolute terms. This is a tool for high-value batch workloads, not interactive use.

## Fine-Grained Tool Streaming and Structured Outputs

**Tool streaming**: Previously, tool results were returned as a complete block when the tool finished. Now, streaming partial tool results as they arrive is supported. For tools that return large outputs (search results, file contents, API responses), this means the model can begin processing early results while the tool is still running.

**Structured outputs**: JSON schema enforcement is now GA. If you specify an output schema, the API guarantees the response matches it — no more post-processing to handle format violations or adding retry logic for malformed JSON. This was technically possible before via prompt engineering; now it's a first-class API feature with hard guarantees.

## Upgrade Path

```bash
# Claude Code CLI update
claude update

# Verify version
claude --version
# Should show 2.1.89 or later
```

If you're using hooks, review your PreToolUse hook implementations to see if any could benefit from the defer pattern. The PermissionDenied hook is worth adding to any production automation that uses auto-approval — it gives you observability into approval failures that were previously invisible.

## The Bigger Picture

This release is largely infrastructure and stability — hooks becoming more expressive, bugs fixed, API capabilities graduating to GA. The pattern Anthropic is following: land features in beta, gather production feedback, ship GA when they're stable.

Structured outputs and fine-grained streaming graduating to GA in the same release as the 300K token expansion suggests the focus for H1 2026 is **batch processing and automation reliability** rather than new interactive features.

For developers building on Claude Code: the platform is getting more reliable and more capable of handling production workloads. The tooling for production-grade automation is clearly the current investment priority.

**Full changelog**: [Claude Code Changelog](https://code.claude.com/docs/en/changelog) | [Platform Release Notes](https://platform.claude.com/docs/en/release-notes/overview)
