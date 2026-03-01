---
title: "Why I Built Claude Writer: An AI Writing Assistant Inside Obsidian"
description: "I got tired of copy-pasting between Obsidian and Claude. So I built a plugin that brings Claude's intelligence directly into Obsidian's sidebar — with context awareness, 4-level explanations, and auto-generated Mermaid diagrams."
date: "2026-03-01"
category: dev
tags: ["obsidian", "claude", "plugin", "ai", "writing", "mermaid", "typescript"]
featured: true
image: /projects/claude-writer.png
---

## The Friction That Started It

I live in Obsidian. Meeting notes, technical documentation, project plans, daily journals, research — it all goes into my vault. Over 800 files, deeply interlinked with `[[wikilinks]]`, organized with templates and frontmatter metadata.

But every time I needed Claude's help — polishing a paragraph, translating a report from Korean to English, restructuring messy meeting notes — the workflow was painful:

1. Select text in Obsidian
2. Copy
3. Switch to Claude's web UI
4. Paste, write a prompt
5. Wait for response
6. Copy the result
7. Switch back to Obsidian
8. Paste, adjust formatting

Seven context switches for one text operation. Multiply that by dozens of times per day, and the friction becomes a wall.

## What I Wanted

Not a chatbot. Not another AI sidebar where I type prompts and get responses in a separate pane. I wanted a **surgical tool**:

- Select text → pick an action → result appears → choose how to insert it
- The AI should understand what comes *before and after* my selection
- It should know what *kind* of document I'm working on
- Multiple ways to insert the result — not just replace

## What I Built

**Claude Writer** is an Obsidian sidebar plugin with 10 commands, powered by Claude Code CLI.

### The Commands

| Type | Commands |
|------|----------|
| **Writing** | Rewrite, Restructure, Summarize, KR→EN, EN→KR, Formalize to English Report |
| **Thinking** | Insight extraction, Explain (4 levels) |
| **Visual** | AI-recommended Mermaid visualization |
| **Open** | Custom free-form instructions |

### Context Awareness

This is the feature I'm most proud of. The plugin doesn't just send your selected text to Claude in isolation. It sends:

- **500 characters before and after** your selection, so Claude understands the surrounding flow
- **Document template detection** — reads your frontmatter `template:` field and auto-switches the prompt style. A meeting note gets `합니다/습니다` formal Korean. A tech note gets bilingual terminology. A content plan gets hook-first structure.
- **3-depth wikilink scanning** — follows `[[links]]` in your document up to 3 levels deep, building a context summary from your knowledge graph

The result: Claude's output fits naturally into your document because it *understands* your document.

### 4-Level Explain Mode

This turned out to be more useful than I expected. Select any concept in your notes — a technical term, a process description, a code snippet — and pick a depth level:

| Level | For | Style |
|-------|-----|-------|
| 1 | Elementary | "It's like when you..." — pure analogy |
| 2 | High School | Concept → principle → example chain |
| 3 | General Adult | Background → mechanism → relationships → impact |
| 4 | Expert | Technical depth, trade-offs, edge cases, English terminology |

I use Level 1 when explaining concepts to non-technical stakeholders. Level 4 when I'm researching something new and want the full picture. Same selected text, four completely different depths.

### Mermaid Visualization

Select a paragraph describing a process, architecture, or comparison. Click "Visualize." The plugin runs a 2-step pipeline:

1. **Step 1 (Haiku, fast)**: Analyzes your text, recommends 3 visualization techniques from 11 types — flowchart, mindmap, sequence diagram, timeline, pie chart, ER diagram, state diagram, and more
2. **Step 2 (your chosen model)**: Generates the actual Mermaid code

The result renders natively in Obsidian. No external tools needed.

### 6 Ways to Insert

Every result gives you six options:

- **Replace** — swap selected text with the result
- **Below** — insert right after your selection
- **Callout** — wrap in a foldable `> [!info]-` block (great for explanations)
- **New Note** — create a new note in `3_Resources/` with the content, insert a `[[wikilink]]` at the cursor
- **End of Doc** — append to document bottom
- **Copy** — just clipboard it

The callout and new note options are game-changers for building a knowledge base. Explain a concept → fold it into a callout so it doesn't clutter your main text. Or create a dedicated note and link to it.

## Technical Decisions

### Why Claude Code CLI, Not the API?

The plugin uses `child_process.spawn` to call the Claude Code CLI (`claude -p`) as a local subprocess. Not the HTTP API. Why?

1. **No API key management** — uses your existing Claude subscription (Max/Team/Enterprise)
2. **No token counting** — the CLI handles context windows internally
3. **No server** — everything runs locally between your machine and Anthropic's API
4. **Model selection** — switch between Haiku, Sonnet, Opus from the sidebar

The trade-off: users need Claude Code CLI installed. But anyone serious enough to use an AI writing plugin in Obsidian probably already has it.

### Template-Aware Prompts

I have 11 document templates in my Obsidian vault — meeting notes, project plans, tech notes, content scripts, decision journals. Each template has a different writing style, tone, and structure.

Instead of one generic prompt, Claude Writer reads the `template:` field from frontmatter and auto-selects:
- The prompt (what Claude should do)
- The model (Haiku for simple notes, Sonnet for reports)
- The tone (formal for business, technical for docs, casual for content)

When I'm in a meeting note and click "Restructure," it knows to produce `합니다/습니다` formal Korean with Action Items in checkbox format. When I'm in a tech note, it produces bilingual terminology with English terms in parentheses.

## The Effect on My Workflow

Before Claude Writer, I'd batch my AI-assisted editing. Wait until I had 5-6 things to process, then spend 20 minutes in Claude's web UI. This meant my notes stayed rough for hours or days.

Now, I edit in real-time. Write a rough paragraph → select → Rewrite → apply. Jot meeting keywords → select → Restructure → it becomes a formatted meeting note. Read something complex → select → Explain Level 3 → fold into a callout for future reference.

The biggest surprise was the Visualize feature. I never thought to diagram my notes before — too much effort. Now I select a process description, click one button, pick from 3 suggestions, and have a Mermaid flowchart in my document in 30 seconds.

## Try It

Claude Writer is available now via [BRAT](https://github.com/TfTHacker/obsidian42-brat):

1. Install BRAT in Obsidian
2. Settings → "Add Beta Plugin" → `Jason198341/obsidian-claude-writer`
3. Enable Claude Writer

Requires [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`npm install -g @anthropic-ai/claude-code` + `claude auth login`).

Source code: [GitHub](https://github.com/Jason198341/obsidian-claude-writer)

Community plugin marketplace submission is pending review.
