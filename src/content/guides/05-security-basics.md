---
title: "Never Put Passwords in Your Code"
description: "API keys, passwords, and secrets in your source code are a ticking time bomb. Here's why it's dangerous and how to do it safely."
emoji: "\U0001F512"
category: security
difficulty: easy
order: 5
---

## Ever Seen Code Like This?

```javascript
const API_KEY = "sk-abc123secretkey456"
const ADMIN_PASSWORD = "myS3cretP@ss!"
```

Writing secrets directly in your code is called **hardcoding**.

**This will ruin your day.** Here's why.

## Reason 1: GitHub Is Public by Default

When you push code to GitHub, the default visibility is **public**. Everyone on the internet can see your code.

```
You: Hardcode an API key in your code
You: git push (upload to GitHub)
Hacker: Searches GitHub for "API_KEY"
Hacker: Finds your key → makes 10,000 API calls under your name
You: Next month's bill — $5,000
```

**This actually happens.** There are hundreds of bots scanning GitHub for leaked API keys around the clock.

## Reason 2: Browsers Show Everything

Frontend code (React, Vue, etc.) runs in the **user's browser**.

Anyone can press F12 (Developer Tools) → Sources tab → search through your JavaScript bundle → find every string you hardcoded.

```
User: F12 → Sources → bundle.js → search
→ Finds "myS3cretP@ss!"
→ Admin password compromised. Game over.
```

## So What Should You Do?

### Method 1: Environment Variables (.env files)

Store secrets in a separate `.env` file and **never upload it to GitHub**.

```
# .env file (only on your machine)
VITE_API_KEY=sk-abc123secretkey456
```

```javascript
// In your code, access it like this
const apiKey = import.meta.env.VITE_API_KEY
```

Add `.env` to your `.gitignore` file so Git ignores it:
```
# .gitignore
.env
```

### Method 2: Server-Side Validation

Never compare passwords in frontend code. Do it **on the server**.

Bad (anyone can see this):
```javascript
// Frontend code — visible to everyone!
if (inputPassword === "myS3cretP@ss!") {
  // access granted
}
```

Good (hidden on the server):
```javascript
// Frontend: just asks the server "is this correct?"
const res = await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ password: inputPassword })
})
```

```javascript
// Server code — users can't see this!
if (hash(inputPassword) === storedHash) {
  // access granted
}
```

Server code doesn't run in the browser, so F12 can't reveal it.

### Method 3: Hashing

Storing passwords as plain text is also dangerous. Use **hashing**.

Hashing = transforming a value into something unrecognizable:

```
"myS3cretP@ss!" → bcrypt → "$2b$10$xK8f..."
```

This transformation is **one-way**. You can't reverse a hash back to the original password.

Store only the hash in your database. When a user logs in:
1. Hash their input
2. Compare with the stored hash
3. Match = access granted

Even if your database gets hacked, the original passwords stay safe.

## If You're Using Supabase

Supabase has **RPC (Remote Procedure Call)** — functions that run on the server.

```sql
-- Server-side password verification function
CREATE FUNCTION verify_password(input_pw text, post_id uuid)
RETURNS boolean AS $$
  SELECT password_hash = crypt(input_pw, password_hash)
  FROM posts WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

This way:
- Password comparison happens server-side only
- No secrets in client code
- Unhackable from the browser

## Pre-Push Checklist

Before pushing code to GitHub, verify:

- [ ] No API keys hardcoded in source files?
- [ ] `.env` file listed in `.gitignore`?
- [ ] No password comparisons in frontend code?
- [ ] Passwords stored as hashes, not plain text?

If any answer is "no," **fix it now**. Not later. Now.

Next: What's a database, why you need one, and how to set up Supabase in 5 minutes.
