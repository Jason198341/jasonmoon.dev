---
title: "Buying a Domain and Connecting It"
description: "Replace myapp.vercel.app with myapp.com. Buy a domain on Namecheap, set up DNS, and point it to Vercel."
date: "2026-02-22"
category: tutorial
tags: ["easy", "deploy"]
featured: false
---

## What's a Domain?

`google.com`, `github.com` — those are domains. Your **address** on the internet.

Vercel gives you `myapp.vercel.app` for free. It works perfectly, but it doesn't feel like *yours*, does it? `vercel.app` is someone else's brand.

A **custom domain** means `myapp.com` — clean, professional, and unmistakably yours.

## Where to Buy One

**Namecheap** (namecheap.com) is a solid choice.

Why?
- Cheap (`.com` is around $10/year)
- Simple dashboard
- No hidden fees

Alternatives: Cloudflare, Google Domains (now Squarespace), GoDaddy. They all work fine.

## Step by Step: Buy → Connect

### Step 1: Buy the Domain

1. Go to [namecheap.com](https://namecheap.com), create an account
2. Search for the name you want (e.g., `coolapp.com`)
3. Add to cart, pay (card or PayPal)
4. Done. `coolapp.com` is now yours.

### Step 2: Add Domain in Vercel

```
Vercel dashboard → your project → Settings → Domains
→ Type "coolapp.com" → Add
```

Vercel gives you **DNS records** to configure. Something like:

```
Type: A      | Value: 76.76.21.21
Type: CNAME  | Name: www | Value: cname.vercel-dns.com
```

### Step 3: Configure DNS (The Key Part)

**What's DNS?**

Think of it as a phone book. When someone types `coolapp.com`, DNS tells the internet which server to actually go to.

In Namecheap:
1. Dashboard → Domain List → `coolapp.com` → Manage
2. Click **Advanced DNS** tab
3. Delete existing records
4. Add exactly what Vercel told you:

| Type | Host | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Save and **wait 10 minutes to 1 hour**. (DNS propagates globally — takes time.)

### Step 4: Verify

Type `coolapp.com` in your browser → your app appears → success!

HTTPS (the padlock icon) is set up **automatically** by Vercel. Zero config needed.

## FAQ

**"How long does DNS propagation take?"**
→ Usually 5 min to 1 hour. Rarely up to 24 hours. If it's not working, just wait.

**"What's the difference between www and no-www?"**
→ `coolapp.com` and `www.coolapp.com` should both work. The config above handles both.

**"Do I have to buy a domain?"**
→ No. `myapp.vercel.app` works perfectly fine. A custom domain is **nice to have**, not required.

**"What about extensions other than .com?"**
→ `.dev`, `.io`, `.app` are all valid. This site is `jasonmoon.dev`. Prices vary.

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Vercel hosting | Free | — |
| .com domain | ~$10 | Yearly |
| HTTPS certificate | Free (Vercel auto) | — |

**$10/year for your own internet address.** Two coffees.

Next: Why you should **never** put passwords in your code — and what to do instead.
