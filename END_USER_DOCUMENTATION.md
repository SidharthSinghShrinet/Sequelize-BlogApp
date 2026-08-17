# 🖘 Your Complete User Guide — How to Use ShowOff

> **Documentation for end users.** Plain-language guide to ShowOff — no code, no internals: quick facts, the full user guide, and the FAQ. The complete project story (tech stack, features, architecture, and everything I made) lives in [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

---

## ⚡ Quick Facts: The TL;DR

<details>
<summary>🖱️ Click to expand — The 30-second version</summary>

**What is it?** ShowOff is a production, full-stack knowledge-sharing platform where developers publish rich technical blogs, showcase projects with GitHub integration, bookmark content, and get **AI-generated cover art** automatically.

| | |
|---|---|
| **Live URL** | [showoff4u.in](https://www.showoff4u.in) |
| **GitHub** | [github.com/SidharthSinghShrinet/Sequelize-BlogApp](https://github.com/SidharthSinghShrinet/Sequelize-BlogApp) |
| **Runtime** | Bun 1.3+ (backend), Vite 8 (frontend) |
| **Language** | TypeScript everywhere — 100% of the codebase |
| **Backend** | Express + Sequelize 6 + MySQL (Aiven, managed, SSL) |
| **Frontend** | React 19 + Tailwind CSS 3 + TipTap editor |
| **AI Pipeline** | Gemini 2.5 Flash → Unsplash → Pexels → Cloudflare Flux-1-Schnell → Pollinations Flux → Cloudinary |
| **Deployment** | Vercel (frontend) + Render (backend) + Aiven (database) |
| **Database tables** | 7 (`users`, `blogs`, `projects`, `bookmarks`, `media`, `comments`, `blog_likes`) |
| **API endpoints** | 40+ REST endpoints under `/api/v1` |
| **Frontend pages** | 16 pages, 15 lazy-loaded |
| **Social features** | Bookmarks, likes, nested markdown comments, Web Share API sharing |
| **Security** | Argon2 hashing, JOSE JWT cookies, rate limiting, Helmet, soft deletes |

</details>

### 🎯 Quick Quiz: The Warmup

<details>
<summary>✅ Answer the warmup question, then reveal</summary>

**Q: What does the AI pipeline do when you publish a blog post WITHOUT a thumbnail?**

A: It generates one automatically through a 5-tier fallback chain: extract a keyword with Gemini 2.5 Flash → try Unsplash → try Pexels → write an "art director" brief → render with Cloudflare Flux-1-Schnell (fallback: Pollinations Flux) → upload to Cloudinary. If literally everything fails, the frontend generates a beautiful SVG data-URI thumbnail so **no post is ever without a cover**.

</details>

---


## 📘 Your Complete User Guide: How to Use ShowOff

This section is for **everyone** — no coding knowledge needed. If you just want to read, write, and share on ShowOff, everything you need is here. (If you're a developer, the deep dives start at [The Motivation](PROJECT_DOCUMENTATION.md#the-motivation-why-build-showoff)), but I'd still skim this — it's the product view.)

<details>
<summary>🧭 How to use this guide (30 seconds)</summary>

Every task below is an expandable walkthrough — click the bar, follow the numbered steps. Open only what you need:

- **New here?** Start with [What is ShowOff?](#what-is-showoff-one-paragraph) then [Reader's Quick Start](#readers-quick-start-5-minutes-to-your-first-read).
- **Want to write?** Jump to [The Writer's Guide](#the-writers-guide-publishing-your-first-post).
- **Showcasing a project?** Go to [The Project Showcase Guide](#the-project-showcase-guide).
- **Stuck?** The [Troubleshooting](#troubleshooting-help-i-hit-a-wall) cards are at the end.

</details>

### 👋 What Is ShowOff?: One Paragraph

**ShowOff is a knowledge-sharing platform where anyone can publish technical articles and showcase their projects — and the platform does the boring work for you.** It writes a cover image for every post with AI, sorts posts into categories automatically, and turns project pages into living timelines (devlogs) instead of static cards. It's live at [showoff4u.in](https://www.showoff4u.in) — free to read, free to write, free to explore.

### ✨ The Feature Overview: Everything in Plain Language

| Feature | What it does for you | Where to find it |
|---|---|---|
| 🖼️ **AI cover generation** | Publish a post without a thumbnail and the platform designs one for you — keyword research → stock photos → AI art, fully automatic | Happens on publish, zero effort |
| 📑 **Auto-categorization** | Your post is sorted into the right topic automatically by analyzing the text | On every post card |
| 📝 **Rich-text editor** | Write with formatting, headings, code blocks, and inline images — no Markdown needed | "Draft a new post" |
| 🚀 **Project showcases** | Present a project with tech-stack badges, a live link, a GitHub link, and a story | "Create Project" |
| 📖 **Devlogs** | Write progress updates attached to your project, shown as a beautiful timeline | Project detail page |
| 🔗 **GitHub README sync** | Paste a repo URL and the platform fetches + renders the README into your project page | Project creation/editing |
| 🔖 **Bookmarks** | Save posts and projects in one click, one place | Heart/bookmark icon on every card |
| ❤️ **Likes** | One-click appreciation with a visible liker list | Post page |
| 💬 **Nested comments** | Reply to comments, with full Markdown formatting (code blocks included) | Post & project pages |
| 📤 **One-click sharing** | Share any post via your phone's share sheet or a copied link | Share button on posts |
| 🔍 **Live search + filters** | Search everything, filter by category, sort any way you like | Explore page |
| ⏱️ **Reading time** | Every post shows its reading time — no more guessing | Every post card |
| 📊 **Category mesh** | A visual, animated map of everything on the platform — click a topic to browse it | About page |
| 🌐 **SEO out of the box** | Posts are built to be found on Google (structured data, sitemaps) | Behind the scenes |

### 🔧 What's Under the Hood: The Tech Stack in Plain Language

You don't need to understand any of this to use ShowOff, but if you're curious *"what is this thing actually made of?"* — here's the whole stack in everyday words:

<details>
<summary>⚙️ The backend — the engine room (open for the plain-language tour)</summary>

**Bun + Express + Sequelize + MySQL.** The server that powers ShowOff is written in a modern JavaScript runtime called **Bun**, uses **Express** (the most popular web server framework) to handle requests, and talks to a **MySQL** database through an ORM called **Sequelize** — which means every piece of data (users, posts, comments, likes) lives in neatly organized tables.

Fancy words you might see: *API, REST, endpoints, ORM, SQL, JWT, rate limiting.* Translation: the platform can store and serve data reliably, keeps your login secure, and protects itself from abuse.

**🧑‍💻 Developers:** the full backend deep dive is in [Architecture Overview](PROJECT_DOCUMENTATION.md#architecture-overview-how-the-pieces-fit)) and [Appendix A](PROJECT_DOCUMENTATION.md#appendix-a-full-api-reference-every-endpoint)).

</details>

<details>
<summary>🎨 The frontend — what you see and click (open for the plain-language tour)</summary>

**React 19 + TypeScript + Vite + Tailwind.** Everything you see in your browser is a **React** application (the industry-standard UI library) written in **TypeScript** (a safer flavor of JavaScript) and styled with **Tailwind CSS** (a design utility library). **Vite** builds it into a fast, modern web app that loads almost instantly.

Fancy words you might see: *SPA, components, hooks, context, code-splitting, lazy loading.* Translation: pages feel instant because only what you need loads at a time.

**🧑‍💻 Developers:** the frontend deep dive is in [Frontend Architecture](PROJECT_DOCUMENTATION.md#frontend-architecture-routing-state-api-layer)) and [Appendix D](PROJECT_DOCUMENTATION.md#appendix-d-frontend-routes-and-pages)).

</details>

<details>
<summary>🤖 The AI — how covers write themselves (open for the plain-language tour)</summary>

**Gemini (Google) + Cloudflare Flux + Unsplash + Pexels.** When you publish a post without a cover image, a five-stage pipeline goes to work: an AI extracts the most important topic word from your title → it searches **Unsplash** for a professional stock photo → if nothing fits, it tries **Pexels** → if still nothing, an "Art Director" AI writes a visual brief ("a sleek digital concept with glowing nodes connected by energy threads…") → a **Flux** AI image model renders an original illustration → the image is uploaded to the CDN. If every single tier fails, the platform generates a beautiful branded placeholder with your title on it. **You always get a cover. The platform never breaks.**

Fancy words you might see: *LLM, prompt, fallback chain, CDN, data-URI.* Translation: your posts always look professional, on topic, and unique.

**🧑‍💻 Developers:** the whole pipeline with code is in [The AI Cover Pipeline](PROJECT_DOCUMENTATION.md#the-ai-cover-pipeline-the-showstopper)).

</details>

<details>
<summary>🌍 Where it lives — the deployment (open for the plain-language tour)</summary>

**Vercel + Render + Aiven.** The website you see is hosted on **Vercel** (a global CDN, so pages load fast everywhere). The server runs on **Render**, and the database is managed by **Aiven**. All three are on free tiers, held together by clever engineering — including a "keep-alive" that pings the server every 14 minutes so it never falls asleep. Even the email you get for password resets is sent programmatically through **Resend**.

**🧑‍💻 Developers:** all the war stories are in [Deployment & Production Ops](PROJECT_DOCUMENTATION.md#deployment-and-production-ops-the-war-stories)).

</details>

### 👀 Reader's Quick Start: 5 Minutes to Your First Read

<details>
<summary>📖 Step 1 — Browsing the feed</summary>

The homepage and the **Explore** page show every published post as a card: title, cover image, author, category, reading time, and like count. Click any card to open it. **No account needed to read anything on ShowOff** — everything is public.

</details>

<details>
<summary>🔍 Step 2 — Searching and filtering</summary>

On Explore, type in the search box and results update live (with a small delay so it doesn't spam the server). You can also:
- Filter by **category** (Sequelize, JavaScript, React, Databases, AI/ML, DevOps, General…)
- Click a category **node on the interactive Category Mesh** on the About page — it opens a drawer with up to 100 articles from that topic

</details>

<details>
<summary>🖼️ Step 3 — Why every post has a cover (and where it came from)</summary>

Look at any post card: there's always a cover image. Either the author uploaded one, or the platform's AI wrote one (see the AI card above). Posts with AI-generated covers are completely normal — that's the feature working, not an accident. You can tell the difference by clicking the post and checking if the cover matches a personal photo; AI covers tend to be glossy, abstract, and perfectly on-topic.

</details>

<details>
<summary>⏱️ Step 4 — Reading time, sharing, and taking action</summary>

Every card shows **"N min read"** — the platform estimates it at 200 words per minute. While reading:
- **Share** — hit the share button: on your phone it opens your native share sheet; on desktop it copies a ready-to-paste link
- **Like** — press the heart (needs an account; without one you'll get a friendly nudge to log in)
- **Bookmark** — save it for later (also needs an account)

</details>

<details>
<summary>📚 Step 5 — Saving things for later</summary>

Bookmarks are collected in one place: your **bookmarks page**. Both posts and projects can be bookmarked, and they're grouped neatly into "Blogs" and "Projects" sections. One click saves, one click removes — there's no folder management to worry about.

</details>

### 👤 Account and Profile: Everything You Need to Know

<details>
<summary>📝 Creating an account</summary>

**Register** requires four things:
1. **Username** — unique, visible on your profile and posts
2. **Email** — unique, used for login and password resets
3. **Password** — stored as a secure one-way hash (even the platform itself can't read it)
4. **Phone number** — exactly **10 digits** (yes, the platform checks the length — it's an anti-spam requirement, and it's the first thing people trip on)

The form won't submit until everything is valid — inline error messages tell you exactly what to fix. After registering you're logged in automatically.

</details>

<details>
<summary>🔐 Logging in and out</summary>

Login is email + password. There's also a **"Remember me"**-style flow under the hood: your session lives in a secure, HTTP-only cookie — your browser keeps you logged in across visits, and you never need to manage a token. Log out with one click from the navigation. If you're logged out for inactivity, the app redirects you gracefully to the login page.

</details>

<details>
<summary>🔄 Forgot your password?</summary>

1. Click **"Forgot password?"** on the login page and enter your email
2. You receive a beautiful branded email with a **Reset Password** button (works on mobile and desktop mail apps)
3. Click it, choose a new password, confirm it, done

Security details you'll appreciate: the reset link expires in **5 minutes**, works exactly once, and the server never stores the raw link — only a scrambled version. If the link expires, just request another one.

</details>

<details>
<summary>✏️ Editing your profile</summary>

From your profile page you can change your **username, email, phone number, password, and profile picture** (uploaded and processed by the platform's image service). Your public profile page — `showoff4u.in/profile/your-username` — shows only your avatar, username, and your published posts and projects — no phone number, no email, nothing a scraper could weaponize. If you change your username, the old link stops working; share the new one.

</details>

<details>
<summary>🗑️ Deleting your account — what exactly happens</summary>

Deletion is **soft**: nothing is instantly erased from the database, but from the outside it looks like a full goodbye:

- Your **username is freed** for the next person to register (it's renamed internally to `deleted_yourname_yourid`)
- Your **email is freed** too
- All your **posts are taken down** (soft-deleted)
- Your **projects are taken down** (but any devlogs linked to them survive as standalone posts — a deliberate safety choice)
- You can't log back in — the account is deactivated

The rename happens for one good reason: it keeps your identity out of the hands of anyone who re-registers the same username later. If you delete your account, there's no restore — export anything you care about first.

</details>

### ✍️ The Writer's Guide: Publishing Your First Post

<details>
<summary>🖊️ Step 1 — The editor, in 60 seconds</summary>

Click **"Draft a new post"**. The editor is a rich-text editor (TipTap) — like a mini Word document:

- **Toolbar:** bold, italic, headings, lists, quotes, code blocks, links
- **Title:** 5–100 characters (the platform validates this before you can publish)
- **Content:** at least 20 characters (spaces don't count — the platform strips them when measuring)
- There's **no draft feature** — hitting Publish means it's public (with an AI cover if you didn't add one)

</details>

<details>
<summary>🖼️ Step 2 — Adding images to your post</summary>

Use **"Upload Local Image"** in the toolbar: pick a file, and it's streamed straight to the platform's image CDN — it never touches a server disk. The image appears exactly where your cursor was. On publish, the platform tracks every image in your post. If you later remove one from the content and save, the platform quietly deletes the orphaned image from the CDN overnight — **you never need to clean up after yourself.**

</details>

<details>
<summary>🎬 Step 3 — Hitting Publish — what happens in that second</summary>

Clicking **Publish** triggers five things instantly:

1. **Cover check** — no thumbnail uploaded? The AI pipeline designs one (see above)
2. **Auto-categorization** — your title + content are scanned against topic keyword banks (JavaScript, React, Databases, AI/ML, DevOps…) and the best match wins
3. **The post is created** — with you as the author (the platform never trusts a client-sent author field — clever, right?)
4. **Image linking** — every inline image is registered to your post
5. **You're redirected** to your shiny new post page

If your post landed in a surprising category, that's the algorithm doing its keyword math — you can see how in [the deep dive](PROJECT_DOCUMENTATION.md#auto-categorization-the-keyword-frequency-algorithm)).

</details>

<details>
<summary>✏️ Step 4 — Editing and deleting your posts</summary>

You can edit or delete any post **only if you're the author** — on the post page, the Edit and Delete actions appear just for you. Editing reruns the categorization (your post can change category after an edit) and reconciles images. Deleting is a **soft delete**: the post disappears from public views, but it stays in a special "Deleted Blogs" list — **you can still see it**; a "Restore" or permanent-removal flow is on the roadmap. There's also a "delete all my posts" button if you're decluttering in bulk.

</details>

<details>
<summary>📖 Step 5 — Turning posts into devlogs</summary>

While writing (or editing), the editor offers an **"Associate with Showcase Project"** dropdown. Pick one of your projects and the post becomes a **devlog** — it appears on the project page as a dated timeline entry (Update #1, #2, #3…) alongside your other progress posts. This is the feature that turns a project page into a story. And thanks to a careful database choice, **deleting the project never deletes its devlogs** — your writing is safe.

</details>

### 🚀 The Project Showcase Guide

<details>
<summary>🛠️ Creating a project</summary>

**"Create Project"** asks for:
- **Title** and **tagline**
- **Description** (Markdown supported)
- **Tech stack** — a tag list rendered as color-coded badges (React = blue, Bun/Node = green, Sequelize = teal, AI = rose — a subtle color language you'll learn to read at a glance)
- Optional: **GitHub URL**, **live URL**, and a **thumbnail**
- No thumbnail? Same AI pipeline kicks in — projects get covers too

</details>

<details>
<summary>📘 The GitHub README sync — my favorite feature</summary>

Paste a **GitHub repository URL** when creating a project and the platform fetches the repo's README, renders it into your project page, and even normalizes quirky GitHub copy-paste URL formats (braces, `.git` suffixes, `www.` prefixes — all handled). It's the fastest way to give a project a real documentation page: your README, live on ShowOff, updated by pasting a URL.

</details>

<details>
<summary>🧱 What's on a project page</summary>

A visitor sees: the cover, title, tagline, your tech-stack badges, the full description (or synced README), quick links (**GitHub** and **live URL** icons), the **devlog timeline** (all your updates as a vertical alternating timeline), the comment section, and bookmark/like actions. Projects show up on the Explore page and on your public profile.

</details>

### 💬 Social and Community Guide

<details>
<summary>🔖 Bookmarks — read it later, everywhere</summary>

Bookmark posts and projects with one tap. Everything lands in your bookmarks page, grouped into Blogs and Projects. Bookmark state is remembered instantly (optimistic UI) — even if the network is slow, the icon updates immediately and corrects itself if something fails.

</details>

<details>
<summary>❤️ Likes — one click, full transparency</summary>

Liking a post is instant (the heart fills before the server even answers — this is called an optimistic update). Click **"Liked by (N)"** to see a modal listing everyone who liked it, with avatars and profile links. The like count is always exact — the platform computes it from a unique database constraint, so double-likes are structurally impossible.

</details>

<details>
<summary>💬 Comments — nested, formatted, and safe to delete</summary>

- Comment on any post or project — no login needed to read, login needed to write
- **Reply to a comment** → it nests under the parent, forming a thread
- **Markdown works in comments** — including code blocks (perfect for technical Q&A)
- **Deleting:** you can delete your own comments; the post's author and a project's owner can delete comments on their content (and a deleted comment deletes its replies — the whole branch)

</details>

<details>
<summary>📤 Sharing — native first, link second</summary>

The share button on a post tries your device's **native share sheet** first (Web Share API — great on phones), and falls back to **copying a link** with a toast confirmation on desktop. Shared links open the post for anyone — no account required.

</details>

### 🚨 Troubleshooting: Help, I Hit a Wall

<details>
<summary>❌ "429 Too Many Requests"</summary>

You've hit the rate limiter — usually by logging in or registering several times quickly. The platform allows a limited number of auth attempts per 15 minutes to stop brute-force attacks. **Fix:** wait 15 minutes, then try again. It's protecting your account, not punishing you.

</details>

<details>
<summary>🔓 Logged out unexpectedly / can't stay logged in</summary>

Your session lives in a secure cookie. If it was cleared (browser cleanup tools are aggressive with these), just log in again. Cross-device sessions aren't synchronized — log in per device. If you were logged out in the middle of writing, your content isn't saved (there's no autosave yet — copy your text before logging in again).

</details>

<details>
<summary>🖼️ Image upload fails</summary>

Uploads stream to the CDN; a failure usually means the file is too large or the network dropped mid-upload. Try a smaller image (a cover-sized image is plenty) and retry. The editor is resilient — a failed upload won't destroy the rest of your draft.

</details>

<details>
<summary>🔑 Password reset email never arrives</summary>

Check spam first. The email is sent by a real transactional email service, so it's not the platform blocking you. Links expire after 5 minutes — request a fresh one if yours expired. If it still fails, it's likely the email address on the account — try again with the exact one you registered with.

</details>

### 🎯 Quick Quiz: Are You ShowOff-Ready?

<details>
<summary>✅ Answer the 5 questions, then reveal</summary>

**Q1: You publish a post with no thumbnail. What appears on the card?**

A1: An AI-generated cover — the 5-tier pipeline (keyword → stock photos → AI art → CDN) writes one for you. If every tier fails, a branded placeholder with your title appears.

**Q2: How long is the password reset link valid?**

A2: 5 minutes — and it only works once.

**Q3: Your username is taken. True or false: you can never get it.**

A3: False — if the previous owner deleted their account, the username was freed automatically for the next person.

**Q4: You delete a project. What happens to its devlogs?**

A4: Nothing! They survive as standalone posts — the database uses "SET NULL" instead of "CASCADE" on purpose.

**Q5: Can you comment without an account?**

A5: No — reading is free, but commenting, liking, bookmarking, and writing all require an account.

</details>

### 🧭 Bridge: From User Guide to Developer Deep Dive

If you're still here, you've now seen ShowOff from the user's chair. Everything below is the *engineering* story — why each feature exists, how the code is structured, the bugs, the architecture. Here's a map from what you just used to what you're about to read:

| What you just learned about | The deep dive |
|---|---|
| AI covers | [The AI Cover Pipeline — The Showstopper](PROJECT_DOCUMENTATION.md#the-ai-cover-pipeline-the-showstopper)) |
| Where images go | [The Media Lifecycle — Tracking Every Image](PROJECT_DOCUMENTATION.md#the-media-lifecycle-tracking-every-image)) |
| Categories | [The Blog Engine — Editor, Search, Categories & More](PROJECT_DOCUMENTATION.md#the-blog-engine-editor-search-categories-and-more)) |
| Devlogs | [Project Showcase & Devlog Timelines](PROJECT_DOCUMENTATION.md#project-showcase-and-devlog-timelines)) |
| Bookmarks/likes/comments | [Social Features — Bookmarks, Likes, Nested Comments & Sharing](PROJECT_DOCUMENTATION.md#social-features-bookmarks-likes-nested-comments-and-sharing)) |
| Account deletion | [The User System — Register, Login, Profile & Deletion](PROJECT_DOCUMENTATION.md#the-user-system-register-login-profile-and-deletion)) |
| Cookies & security | [Authentication & Security](PROJECT_DOCUMENTATION.md#authentication-and-security-jwt-cookies-hashed-tokens-rate-limits)) |

---


## ❓ FAQ: Frequently Asked Questions

<details>
<summary>Is ShowOff open source?</summary>

Yes! The source is public on [GitHub](https://github.com/SidharthSinghShrinet/Sequelize-BlogApp). The project is private-licensed for now (educational/portfolio), but the code is fully readable and reusable as a reference.

</details>

<details>
<summary>Why Sequelize instead of Prisma?</summary>

The project started as a Sequelize learning exercise — and it earned its place. Model-first definitions, associations that read like English, powerful hooks (password hashing!), and `sequelize.sync()` for zero-migration bootstrapping. For a project this size, the schema IS the documentation.

</details>

<details>
<summary>Why Bun instead of Node?</summary>

`Bun.password` (argon2 built-in), native TypeScript execution, ~10x faster installs, and a delightful dev loop. No build step, no bcrypt compilation. The runtime is the product here — Bun's batteries-included philosophy directly reduced dependencies.

</details>

<details>
<summary>How much does it cost to run?</summary>

The current stack is 100% free-tier: Vercel (frontend), Render (backend), Aiven MySQL (database), Cloudinary (images), Resend (email), Gemini + Cloudflare AI + Unsplash + Pexels (AI pipeline). The engineering cost was keeping everything within free-tier limits — keep-alive crons, lazy media cleanup, and rate limiting all protect the budget.

</details>

<details>
<summary>Can I contribute?</summary>

The roadmap is public (see above) — AI search, comment trees, notifications, monetization. If you want to help, the issues list on GitHub is the place to start.

</details>

<details>
<summary>How do the seeded blogs work?</summary>

The `scripts/` folder contains one-off seed/enrich scripts that used multiple LLMs (Mistral, Groq, etc.) to generate the platform's initial content library — including some genuinely deep Java/JavaScript "masterclass" articles (14k+ word pieces). Run them with `bun run seed:javajs14k` etc.

</details>

---
