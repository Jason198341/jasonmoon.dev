---
title: "Git Explained: Commits, Pushes, and Why You Need Them"
description: Git is a save system for your code. Like game checkpoints — mess up, and you can always go back. Here's the 4 concepts you need.
emoji: "\U0001F4BE"
category: dev-tools
difficulty: beginner
order: 2
---

## Git = Game Save Points

You know how you save before a boss fight? If you die, you restart from the save point.

Git is exactly that. **Save points for your code.**

"I changed something and everything broke" → With Git, you revert in 3 seconds.

## 4 Concepts. That's All.

### 1. Repository (Repo)
Your project folder. When you tell Git "track this folder," it becomes a repository.

### 2. Commit
Creating a save point. "Everything works, let me save this."

```bash
git add .
git commit -m "Login page complete"
```

The message after `-m` is your save file name. "Login page complete", "Fixed bug", "Changed colors" — describe what you did.

### 3. Push
Uploading your local save to the **internet (GitHub)**.

```bash
git push
```

Why? Two reasons:
- **Backup**: If your laptop dies, your code survives
- **Portfolio**: Others can see what you've built

### 4. Pull
The reverse — downloading the latest code from the internet **to your computer**.

```bash
git pull
```

## Hands-On: From Zero

### Step 1: Install Git
[git-scm.com](https://git-scm.com) → download → install with all defaults.

### Step 2: Create a GitHub Account
[github.com](https://github.com) → sign up. Free.

GitHub is cloud storage for Git-managed code. Think of it as **Instagram for developers** — a place to showcase what you've built.

### Step 3: Your First Commit

In the terminal:

```bash
git init                        # Start tracking this folder
git add .                       # Add all files to the save list
git commit -m "First save"      # Save!
```

### Step 4: Push to GitHub

```bash
git remote add origin https://github.com/yourusername/yourproject.git
git push -u origin main
```

You don't need to memorize this. Tell Claude Code **"push this to GitHub"** and it handles everything.

## With Claude Code, It's Even Easier

```
You: "Push everything to GitHub"
Claude: (auto commits → pushes → done)
You: "Undo my last change"
Claude: (reverts to previous commit)
```

## Common Mistakes

**"git push isn't working!"**
→ 99% of the time you're not logged into GitHub. Authenticate once, then it's automatic.

**"Something's messed up..."**
→ Don't panic. Run `git status` to see what's going on. Show the output to your AI and it'll fix it.

**Remember this**: Git is your safety net. The more often you commit, the safer you are.

Next: How to put your app on the internet so anyone can access it.
