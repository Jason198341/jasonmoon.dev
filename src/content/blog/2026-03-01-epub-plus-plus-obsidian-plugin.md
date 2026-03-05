---
title: "EPUB++: I Built the Missing EPUB Reader for Obsidian"
description: "PDF annotation plugins are everywhere. EPUB? Zero that do highlight-to-note properly. So I built EPUB++ — read, highlight, and auto-generate structured notes from any EPUB file inside Obsidian."
date: "2026-03-01"
category: dev
tags: ["obsidian", "epub", "plugin", "typescript", "epub.js", "reading", "notes"]
featured: true
image: /projects/epub-plus-plus.png
---

## The Gap Nobody Filled

Search "obsidian epub" and you'll find 5 plugins. Here's what they actually do:

| Plugin | Viewer | Highlight | Multi-color | Auto Notes |
|--------|:------:|:---------:|:-----------:|:----------:|
| ePub Reader | ✅ | ❌ | ❌ | ❌ |
| Annotator | ✅ | ✅ | ❌ | Partial |
| EPUB Annotator | ✅ | ✅ | ✅ | Template only |
| EPUB Importer | ❌ | ❌ | ❌ | Convert only |
| **EPUB++** | ✅ | ✅ | ✅ | **Full auto** |

The pattern was obvious: PDF annotation → notes is a solved problem with 12+ plugins. EPUB? Nobody connected the dots.

## How It Works

```
📚 Open EPUB → ✏️ Highlight text → 📝 Click "Generate Note" → Done.
```

That's it. Your highlights become a structured markdown note with:
- Chapter-based grouping
- Source links back to the exact EPUB location
- Proper frontmatter (tags, progress, template)
- Ready for Obsidian's graph view and Dataview

## The Technical Rabbit Holes

### Why TextFileView, Not ItemView

My first version extended `ItemView`. Clicked an EPUB file — nothing happened. Blank screen.

The issue: `ItemView` has no file lifecycle hooks. When you `registerExtensions(["epub"], VIEW_TYPE)`, Obsidian needs `onLoadFile` to route the file to your view. Only `TextFileView` (and its parent `EditableFileView`) provide this.

But EPUB is binary, not text. The trick:

```typescript
class EpubReaderView extends TextFileView {
  getViewData(): string { return ""; }           // stub
  setViewData(data: string, clear: boolean) {    // stub
    if (this.file) this.loadEpub(this.file);     // load binary separately
  }
  clear(): void { this.cleanup(); }              // stub
}
```

Ignore the text pipeline entirely. Read the binary via `vault.readBinary()` instead.

### epub.js: The Only Option (and Its Risks)

epub.js hasn't been updated since 2022. But it's the **only** JavaScript library that provides:
- Browser-based EPUB rendering (iframe)
- CFI (Canonical Fragment Identifier) support
- Built-in annotation/highlight API
- Text selection events

The alternatives are either parsing-only (no rendering) or full desktop frameworks (Thorium/Readium — way too heavy for a plugin).

Risk mitigation: only use the stable core API. If epub.js dies completely, the JSON sidecar format preserves all highlights independently.

### CFI: How Highlights Survive Re-pagination

EPUB pages aren't fixed — they reflow based on font size, window width, etc. So how do you mark a highlight position?

**EPUB CFI** (Canonical Fragment Identifier):
```
epubcfi(/6/14[chapter1]!/4/2/4/2,/1:0,/1:42)
```

This is a tree traversal path through the EPUB's XML structure, ending with character offsets. It survives font changes, window resizes, and even minor EPUB edits. epub.js generates and consumes these natively.

### JSON Sidecar: Never Touch the Original

EPUB++ stores highlights in `book.epub.highlights.json` next to the original file:

```json
{
  "title": "Sapiens",
  "highlights": [
    {
      "cfi": "epubcfi(/6/14!/4/2/4/2,/1:0,/1:42)",
      "text": "The Cognitive Revolution began about 70,000 years ago",
      "color": "yellow",
      "chapter": "Chapter 1: The Cognitive Revolution"
    }
  ],
  "lastPosition": "epubcfi(/6/14!/4/2)",
  "progress": 0.35
}
```

The EPUB file is never modified. Highlights are a separate layer. You can delete the sidecar and start fresh; you can share the EPUB without sharing your notes.

## The One-Click Note

Click "📝 노트 생성" and EPUB++ generates:

```markdown
---
tags: [독서노트, Sapiens, Yuval Harari]
template: SQ3R-독서노트
progress: 35%
highlights: 12
---

# Sapiens — Reading Highlights

## Chapter 1: The Cognitive Revolution

> [!quote]+ 🟡 Key concept
> The Cognitive Revolution began about 70,000 years ago
> — [[Sapiens.epub|Source]]
```

Highlights grouped by chapter. Color-coded with emoji labels. Source links back to the EPUB. Frontmatter ready for Dataview queries.

## What's Next

- **AI summary** — Claude analyzes your highlights and generates insights (Claude Writer integration)
- **Related note linking** — Auto-connect highlights to existing vault notes via keyword matching
- **Library view** — Browse all EPUBs with covers, progress, and recent activity
- **Spaced repetition** — SM-2 review scheduling for key highlights

## Try It

1. Download from [GitHub Releases](https://github.com/Jason198341/obsidian-epub-plus-plus/releases)
2. Copy `main.js`, `styles.css`, `manifest.json` to `your-vault/.obsidian/plugins/epub-plus-plus/`
3. Restart Obsidian → Enable EPUB++
4. Drop any `.epub` file into your vault and click it

---

*Built by [Jason Moon](https://jasonmoon.dev) — more projects at [jasonmoon.dev/projects](https://jasonmoon.dev/projects)*
