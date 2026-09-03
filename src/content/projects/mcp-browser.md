---
title: MCP Browser
tagline: I gave Claude eyes. Now it can see and control your actual Chrome — not a fake browser, yours.
description: A Chrome Extension + MCP Server bridge that lets Claude Code control your real Chrome browser via Chrome Extension APIs. No CDP, no separate browser instance — just Claude operating the tab you already have open.
category: Chrome Extension
stack: [TypeScript, Chrome Extension API, MCP SDK, WebSocket, Node.js]
github: https://github.com/Jason198341/mcp-browser
projectType: Personal
flagship: false
featured: true
order: 4
---

## The Problem

Every "AI browser control" tool does the same thing: launch a separate, headless Chrome instance, control it via CDP (Chrome DevTools Protocol), and hope it behaves like a real browser. It doesn't. Logged-out sessions. No cookies. Bot detection. You're watching a ghost browser pretend to be you.

I wanted Claude to control *my* actual Chrome — the one I already have open, with my cookies, my sessions, my tabs. Without touching CDP or DevTools at all.

## What I Built

A two-piece system:

**MCP Server** (`server/src/index.ts`) — A stdio MCP server that Claude Code connects to. It spins up a WebSocket server on `ws://localhost:7789` and exposes 5 browser tools to Claude.

**Chrome Extension** (`extension/background.js`) — A Manifest V3 service worker that connects to the WebSocket server and listens for commands. When a command arrives, it calls native Chrome Extension APIs to act on your real, open browser.

The flow:
```
Claude Code → MCP Server (stdio) → WebSocket (7789) → Extension → Chrome API → Your Browser
```

5 tools available to Claude:
- `browser_navigate` — Go to a URL, wait for page load
- `browser_screenshot` — Capture the visible tab as PNG (Claude can see it directly)
- `browser_click` — Click any element by CSS selector
- `browser_type` — Type into any input field
- `browser_get_dom` — Get all interactive elements (links, buttons, inputs) with ref IDs

## Why Not CDP?

CDP (Chrome DevTools Protocol) is the standard way automation tools control browsers. Playwright, Puppeteer, Selenium — they all use it. It's powerful, but it requires launching Chrome with `--remote-debugging-port` and gives you a *new* browser instance with no existing sessions.

**Chrome Extension API is fundamentally different:**

| | CDP | Chrome Extension API |
|---|---|---|
| Which browser? | New headless instance | Your actual running Chrome |
| Login sessions? | None (starts fresh) | All your existing cookies |
| Setup | Launch flag + port | Install extension once |
| Bot detection | High | Behaves like a real user |
| API level | DevTools protocol | `chrome.tabs`, `chrome.scripting` |

The Extension API is higher-level — you call `chrome.tabs.update()` to navigate, `chrome.scripting.executeScript()` to click things, `chrome.tabs.captureVisibleTab()` to screenshot. Chrome handles everything underneath. No protocol sockets, no low-level DevTools messages.

## How It Works Under the Hood

**Manifest V3 Service Worker** — The extension runs as a background service worker (MV3 requirement). To keep it alive past Chrome's 30-second timeout, it uses a self-pinging keep-alive mechanism.

**Request-Response over WebSocket** — Each command gets a `requestId` (UUID). The server sends `{ requestId, tool, args }` to the extension. The extension responds with `{ requestId, data }` or `{ requestId, error }`. The server matches responses to pending Promises with a 15-second timeout.

**Screenshot as Base64 Image** — `captureVisibleTab()` returns a data URL. The server strips the `data:image/png;base64,` prefix and returns the raw base64 as an MCP image content block. Claude receives it as a first-class image it can see and reason about.

**DOM extraction** — `browser_get_dom` uses `querySelectorAll` to find up to 80 interactive elements and returns them as a structured list with ref IDs (e0, e1, ...) that Claude can reference in subsequent click commands.

## Setup

1. Run the MCP server: `cd server && npm install && npm run build && node dist/index.js`
2. Register it in Claude Code (`.claude.json` mcpServers)
3. Load the extension: `chrome://extensions` → Developer mode → Load unpacked → select `extension/`
4. Done. Ask Claude: "open google.com" — it controls your browser

## What Makes It Different

Most AI browser tools are automation frameworks pretending to be AI tools. You define scripts; AI fills in parameters.

MCP Browser is inverted: Claude reasons about what needs to happen, reads the DOM to understand the page structure, takes screenshots to verify results, and adapts in real-time. No scripts. No selectors defined in advance. Claude figures out the page by looking at it.

It's the difference between giving Claude a remote control and giving it eyes.
