---
title: "What's a Database? Getting Started with Supabase"
description: "Save user data so it doesn't disappear when the browser closes. Set up a real database with Supabase in 5 minutes."
emoji: "\U0001F5C4\uFE0F"
category: database
difficulty: easy
order: 6
---

## Why Do You Need a Database?

Everything you've built so far disappears when the browser closes.

Sure, `localStorage` keeps data in *your* browser, but open a different device and it's gone. Other users' data? Totally inaccessible.

A **database** stores everyone's data on a **central server**.

Analogy: localStorage is your **desk drawer** — only you can open it. A database is a **library** — organized, shared, and accessible from anywhere.

## What's Supabase?

A **free database service**. Think of it as a developer's spreadsheet in the cloud.

| Spreadsheet | Supabase |
|------------|----------|
| Sheet | Table |
| Row | Record (one entry) |
| Column | Column (name, email, etc.) |
| Saved locally | Saved in the cloud |

The difference? A spreadsheet lives on your computer. Supabase is **on the internet**, so your app can read and write data in real time.

## Hands-On: 5-Minute Setup

### Step 1: Sign Up
[supabase.com](https://supabase.com) → log in with GitHub. Free.

### Step 2: Create a Project
"New Project" → name it → set a password → pick a region (choose the closest one) → Create.

Wait about 2 minutes for it to spin up.

### Step 3: Create a Table

Let's say you're building a to-do app:

```sql
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  done boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

Translation:
- `id`: Unique identifier for each to-do (auto-generated)
- `title`: The task content ("Do math homework")
- `done`: Completed or not (true/false)
- `created_at`: When it was created (auto-recorded)

Paste this in Supabase's "SQL Editor" and hit Run. Table created.

### Step 4: Connect from Your App

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',  // Project URL
  'eyJhbGciOi...'             // Public key (anon key)
)
```

Find both values in Supabase dashboard → Settings → API.

### Step 5: Read and Write Data

```javascript
// Add a to-do
await supabase.from('todos').insert({ title: 'Do homework' })

// Get all to-dos
const { data } = await supabase.from('todos').select('*')

// Mark as done
await supabase.from('todos').update({ done: true }).eq('id', '...')

// Delete
await supabase.from('todos').delete().eq('id', '...')
```

It reads like English:
- "From todos, insert a row with title 'Do homework'"
- "From todos, select everything"

## RLS: Row Level Security

**RLS** = rules for who can see what data.

Example: "Users can only see their own to-dos"

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);
```

With this, User A can never see User B's data. It's enforced **at the database level** — even a hacker can't bypass it.

## Free Tier Limits

| Item | Limit |
|------|-------|
| Database storage | 500 MB |
| File storage | 1 GB |
| API requests | Unlimited |
| Projects | 2 |

More than enough for personal projects.

## When to Use What

| Situation | Choice |
|-----------|--------|
| Solo app, small data | localStorage |
| Multi-device, multi-user | Supabase |
| User login needed | Supabase Auth |
| File uploads (images, etc.) | Supabase Storage |

## What's Next?

These 6 guides cover the fundamentals:
1. AI can build your app
2. Git for saving your work
3. Vercel for deployment
4. Custom domains
5. Security basics
6. Databases with Supabase

**Now go build something.** When you get stuck, ask your AI and revisit these guides. You don't need to understand everything upfront — you learn by building.
