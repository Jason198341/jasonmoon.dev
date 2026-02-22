---
title: "Putting Your App on the Internet (Vercel Deploy)"
description: "Your app only works on localhost? Here's how to give it a real URL that anyone in the world can visit. Takes 5 minutes."
date: "2026-02-22"
category: tutorial
tags: ["easy", "deploy"]
featured: false
---

## Escaping localhost

When you're developing, your browser shows `localhost:3000`. That address only works **on your computer**. Tell your friend to visit `localhost:3000` and nothing happens.

**Deploying** means turning that into `myapp.vercel.app` — a real URL anyone can access.

## What's Vercel?

A **free hosting service** for your web apps.

Analogy: You painted a picture. Vercel is the **gallery** where you hang it. Share the gallery address (URL) and anyone can come see it.

**Why Vercel?**
- **Free** for personal projects
- **Fast** — servers worldwide, so it loads quickly everywhere
- **Auto-connects to GitHub** — push code, it deploys automatically

## Hands-On: 5-Minute Deploy

### Step 1: Sign Up for Vercel
[vercel.com](https://vercel.com) → **log in with your GitHub account**. Done.

### Step 2: Connect Your Project

**Option A** — From the web:
1. Vercel dashboard → "New Project"
2. Select your GitHub repo
3. Click "Deploy"
4. Wait 2 minutes → you get a URL: `https://yourproject.vercel.app`

**Option B** — From the terminal (Claude Code):
```bash
npx vercel --prod
```
One line. That's it.

### Step 3: Automatic Deploys

Once connected, every time you push to GitHub, Vercel **automatically deploys the new version**.

```
Edit code → git push → Vercel detects it → auto-deploy → new version live!
```

No deploy button to press. Ever.

## Environment Variables: Storing Secrets

Your app might need API keys or secret values. These should **never** be written directly in your code (the security guide explains why). Put them in Vercel's **environment variables**:

```
Vercel dashboard → Settings → Environment Variables
→ Key: VITE_API_KEY
→ Value: abc123xxx (your secret)
→ Save
```

In your code, access it like this:
```javascript
const apiKey = import.meta.env.VITE_API_KEY
```

The secret lives on Vercel's server, not in your code. Safe.

## What If the Deploy Fails?

You might see "Build Failed" in red. Don't panic.

1. Click the "Logs" tab → find the error message
2. Show the error to your AI
3. AI fixes it → push again → auto-redeploy

**90% of build errors** are one of these:
- Typo (file name capitalization)
- Missing package (forgot `npm install`)
- Environment variable not set

## Summary

| Before | After |
|--------|-------|
| `localhost:3000` | `myapp.vercel.app` |
| Only you can see it | Anyone in the world |
| Manual start | Auto-deploy |
| Free | Still free |

Next: Instead of `myapp.vercel.app`, how about `myapp.com`? Let's buy a custom domain.
