---
title: "Building ShowOff — A Full-Stack Knowledge-Sharing Platform with AI-Generated Cover Art"
description: "How I built ShowOff, a full-stack developer knowledge-sharing platform with Bun, Express, Sequelize, MySQL, React 19 and a 5-tier AI cover generation pipeline (Gemini 2.5 Flash + Cloudflare Flux). Complete architecture deep dive with interactive explorers, quizzes, and full API documentation."
tags: react, typescript, sequelize, bun, mysql, express, ai, cloudinary, fullstack, webdev
cover_image: https://www.showoff4u.in/og-image.webp
---

# 🚀 Building ShowOff: A Full-Stack Knowledge-Sharing Platform with AI-Generated Cover Art

*By Sidharth — the complete interactive build story and technical deep dive*

---

## 👋 Before We Start: Read This

If you're a developer, creator, teacher, or technical learning enthusiast, you've probably felt the friction of publishing technical content: writing the article, creating cover art, organizing your projects, and keeping everything discoverable. That friction is exactly what I set out to solve with **ShowOff** — a full-stack knowledge-sharing platform that not only lets you publish rich blog posts and showcase projects with GitHub integration, but also **generates cover art for you automatically** using a multi-stage AI pipeline.

**ShowOff is live at [showoff4u.in](https://www.showoff4u.in)** — go click around before you read. I'll wait.

Back? Good. The source code is on GitHub: **[github.com/SidharthSinghShrinet/Sequelize-BlogApp](https://github.com/SidharthSinghShrinet/Sequelize-BlogApp)**.

This post is intentionally **massive and interactive**. It's not a skim-and-scroll article — it's a full technical documentation experience:

- 🖱️ **Collapsible `<details>` explorers** — open the ones you care about
- 🎮 **Self-quizzes** after major sections — test yourself, reveal the answers
- 🧭 **Step Explorers** — walk through multi-stage flows one numbered step at a time
- 🗺️ **Architecture maps** — click through the request lifecycle
- 📚 **Full appendixes** — every API endpoint, every database column, every environment variable
- 🧠 **Real battle stories** — the production bugs that taught me the most

| Interactive element | How to use it |
|---|---|
| 🖱️ Collapsible sections | Click any "Expand / Click to expand / Reveal" bar to open code, diagrams, and deep dives |
| 🎮 Quick Quizzes | Read the questions, form your answer *before* clicking, then reveal |
| 🧭 Step Explorers | Numbered expandable steps let you walk through flows one stage at a time |
| ✅ Roadmap checkboxes | Interactive checklist — the platform's actual next steps |
| ❓ Troubleshooting cards | One problem per card; open the ones you hit |

Grab a coffee (or chai ☕ — I'm Indian, it's chai), and let's go.

---

## 📋 Table of Contents

> **👀 Not a developer?** This post doubles as the complete user guide for ShowOff. Skip the code and start at [📘 Your Complete User Guide](END_USER_DOCUMENTATION.md). The technical deep dives are all in the second half — nobody will quiz you on them. **🧑💻 Developer?** Jump to [The Motivation](#the-motivation-why-build-showoff) or anywhere in the architecture/features sections below.

### The User Guide (For Everyone)
- [🖘 Your Complete User Guide (separate file)](END_USER_DOCUMENTATION.md)

### The Story
- [Quick Facts: The TL;DR](END_USER_DOCUMENTATION.md#quick-facts-the-tldr))
- [The Motivation: Why Build ShowOff?](#the-motivation-why-build-showoff)
- [The Tech Stack: Every Choice, Explained](#the-tech-stack-every-choice-explained)

### The Architecture
- [Architecture Overview: How the Pieces Fit](#architecture-overview-how-the-pieces-fit)
- [The Request Lifecycle: A Guided Tour](#the-request-lifecycle-a-guided-tour)

### The Database
- [Database Design: Seven Models, One Cohesive Schema](#database-design-seven-models-one-cohesive-schema)

### The Features (Deep Dives)
- [The User System: Register, Login, Profile and Deletion](#the-user-system-register-login-profile-and-deletion)
- [Authentication and Security: JWT Cookies, Hashed Tokens, Rate Limits](#authentication-and-security-jwt-cookies-hashed-tokens-rate-limits)
- [The AI Cover Pipeline: The Showstopper](#the-ai-cover-pipeline-the-showstopper)
- [The Media Lifecycle: Tracking Every Image](#the-media-lifecycle-tracking-every-image)
- [The Blog Engine: Editor, Search, Categories and More](#the-blog-engine-editor-search-categories-and-more)
- [Project Showcase and Devlog Timelines](#project-showcase-and-devlog-timelines)
- [Social Features: Bookmarks, Likes, Nested Comments and Sharing](#social-features-bookmarks-likes-nested-comments-and-sharing)

### The Frontend
- [Frontend Architecture: Routing, State, API Layer](#frontend-architecture-routing-state-api-layer)
- [SEO Done Properly: sitemaps, JSON-LD, llms.txt and WebP](#seo-done-properly-sitemaps-json-ld-llmstxt-and-webp)
- [Platform Analytics and the Interactive Category Mesh](#platform-analytics-and-the-interactive-category-mesh)

### The Ops
- [Security Measures: The Full Defense Matrix](#security-measures-the-full-defense-matrix)
- [Deployment and Production Ops: The War Stories](#deployment-and-production-ops-the-war-stories)
- [Performance and Optimization](#performance-and-optimization)

### The Reflection
- [Challenges and Lessons Learned: 12 Honest Confessions](#challenges-and-lessons-learned-12-honest-confessions)
- [Roadmap: What's Next](#roadmap-whats-next)

### The Practicals
- [Getting Started: Run It Locally in 10 Minutes](#getting-started-run-it-locally-in-10-minutes)
- [Common Setup Problems and Fixes](#common-setup-problems-and-fixes)

### The Appendixes (Complete Documentation)
- [Appendix A: Full API Reference (Every Endpoint)](#appendix-a-full-api-reference-every-endpoint)
- [Appendix B: Database Schema Reference (Every Column)](#appendix-b-database-schema-reference-every-column)
- [Appendix C: Environment Variables Reference](#appendix-c-environment-variables-reference)
- [Appendix D: Frontend Routes and Pages](#appendix-d-frontend-routes-and-pages)
- [Appendix E: Frontend Component Library Tour](#appendix-e-frontend-component-library-tour)

### The End
- [The Grand Finale: 12 Rapid-Fire Questions](#the-grand-finale-12-rapid-fire-questions)
- [FAQ: Frequently Asked Questions](END_USER_DOCUMENTATION.md#faq-frequently-asked-questions))
- [Final Thoughts](#final-thoughts)

---

## 💭 The Motivation: Why Build ShowOff?

Every good project starts with a personal frustration. Mine was three-fold:

1. **Writing is only half the battle.** After finishing a technical article, you still need a thumbnail, a category, SEO metadata, and a place to put it. Most platforms make you do all of this manually.
2. **Projects deserve timelines.** I wanted a place where a project isn't just a static "here's my repo" card — it should tell the story of its development through devlogs, growing over time like a changelog you can actually read.
3. **I wanted to test a wild hypothesis:** *Can a platform write its own cover art with AI — so well that authors never miss designing one manually?*

That third question became the heart of the project. An automated pipeline that takes a blog title and produces a beautiful, on-topic cover image with **zero human effort**. When you publish a blog post on ShowOff without a thumbnail, the platform writes your cover for you.

<details>
<summary>🤔 Wait — why did I pick Sequelize as the ORM?</summary>

Honest answer: the project started as a **Sequelize learning project**. But it stayed because Sequelize turned out to be the right tool:

- **Model-first design** — `sequelize.define()` gives you the schema, validations, and hooks in one place, and `sequelize.sync()` bootstraps the tables on first run. No migration files to babysit for a hobby-scale project.
- **Associations that read like English** — `User.hasMany(Blog, { as: "blogs", foreignKey: "author" })` is self-documenting.
- **Hooks are powerful** — password hashing via `beforeCreate`/`beforeUpdate` hooks means the controller code never touches hashing logic.
- **Parameterized queries** — the `Op.*` operators and `replacements` API make SQL injection structurally impossible in normal usage.

</details>

---

## 🧰 The Tech Stack: Every Choice, Explained

ShowOff is a monorepo with two independently deployable apps: `backend/` and `frontend/`.

> 🎮 **Before you read on — the 10-second warmup:** how many of these were actually used? (Answer at the end of the section.)

<details>
<summary>🃏 Pop quiz — Which of these did ShowOff REALLY ship with?</summary>

1. bcrypt
2. Zustand
3. Redux Toolkit
4. Mongoose
5. jsonwebtoken
6. React Router
7. TipTap
8. Socket.io
9. Zod
10. Vitest

Reveal the answer list below — then read the tables and see how many you got right.

<details>
<summary>Answer key (no peeking)</summary>

Real: **6** (React Router), **7** (TipTap), **9** (Zod).
Cut: 1 (bcrypt → `Bun.password`), 2 & 3 (Context + Hooks instead), 4 (Mongoose → Sequelize + MySQL), 5 (jsonwebtoken → JOSE), 8 (Socket.io → polling + REST), 10 (Vitest → Bun's test runner).

</details>

</details>

### Backend Stack

| Technology | Version | Purpose | Why I Chose It |
|---|---|---|---|
| **Bun** | 1.3+ | Runtime, package manager, test runner | Blazing-fast installs, TS natively, **built-in `Bun.password` (argon2)** — no bcrypt dependency needed |
| **Express** | 4.x | HTTP server, routing, middleware | The ecosystem standard; every middleware I needed has a battle-tested package |
| **Sequelize** | 6.x | ORM for MySQL | Model-first schema, associations, hooks, validations |
| **MySQL2** | 3.x | Database driver | The production-standard MySQL driver for Node |
| **JOSE** | 6.x | JWT signing/verification (HS256) | Modern, audited, zero-dependency JWT library |
| **Cloudinary** | 2.x | Cloud image hosting | Free tier, CDN, easy destruction API for cleanup |
| **Multer** | 2.x | Multipart parsing (**memory storage**) | No disk writes = works on serverless + safer |
| **Resend + React Email** | 6.x / 1.x | Transactional email | React components as email templates — type-safe, beautiful |
| **node-cron** | 4.x | Scheduled jobs | Midnight media cleanup + 14-minute keep-alive |
| **express-rate-limit** | 8.x | Rate limiting | Two-tier global/auth protection |
| **express-async-handler** | 1.x | Async error propagation | Zero try/catch boilerplate in controllers |
| **Helmet** | 8.x | Security headers | 13+ security headers with one call |
| **Gemini API** | — | LLM (keyword extraction + art direction) | Free tier, fast, high-quality |
| **Cloudflare Workers AI** | — | Image generation (`flux-1-schnell`) | Free tier, reliable, fast inference |
| **Pollinations AI** | — | LLM + Flux fallbacks | Zero-config fallback tier |
| **Unsplash / Pexels** | — | Stock photo tiers | Free API keys, professional photos |

<details>
<summary>🖱️ Expand — Why Bun instead of Node.js? The full story</summary>

Bun is the most opinionated choice in this stack, and it pays off in three concrete ways:

**1. `Bun.password.hash()`** — a built-in, audited argon2 implementation. I didn't need `bcryptjs` (slow, pure JS), `bcrypt` (native compilation), or `argon2` (native compilation). One line, zero deps:

```typescript
const hash = await Bun.password.hash(password); // argon2id by default
const ok = await Bun.password.verify(password, hash);
```

**2. TypeScript + ESM without config pain.** `import ... from "./server.ts"` — with `.ts` extensions, literally. The runtime compiles on the fly. No build step, no `tsx`, no `ts-node`.

**3. Speed.** `bun install` is ~10x faster than `npm install`. `bun --watch server.ts` restarts in milliseconds. The dev loop is genuinely delightful.

The backend also runs on Bun in production on Render — the free tier gives you plenty of headroom with Bun's performance.

</details>

### Frontend Stack

| Technology | Version | Purpose | Why I Chose It |
|---|---|---|---|
| **React** | 19.x | UI library | The ecosystem; concurrent rendering; everyone knows it |
| **TypeScript** | 6.x | Static types | Safety across 60+ files |
| **Vite** | 8.x | Build tool + dev server | Instant HMR, fast builds, first-class React plugin |
| **Tailwind CSS** | 3.x | Styling | Utility-first + class-based dark mode |
| **@tailwindcss/typography** | 0.5.x | Article rendering | Beautiful `prose` defaults for HTML content |
| **TipTap (ProseMirror)** | 3.x | Rich text editor | Headless, extensible, real WYSIWYG without the bloat |
| **React Hook Form + Zod** | 7.x / 4.x | Forms + validation | Performance + schema safety together |
| **Axios** | 1.x | HTTP client | Interceptors for auth/session handling |
| **React Router DOM** | 7.x | Routing | Lazy loading, protected routes, nested layouts |
| **react-helmet-async** | 3.x | SEO head management | JSON-LD, OG tags, canonicals |
| **marked** | 18.x | Markdown rendering | Tiny, fast, extensible |
| **Ant Design** | 6.x | Carousel | Production-grade carousel for the hero |
| **react-hot-toast** | 2.x | Notifications | Beautiful toasts in 1 line |
| **react-icons** | 5.x | Icon set | Material Symbols + FontAwesome in one |

---

## 🏗️ Architecture Overview: How the Pieces Fit

```
Sequelize/                      (monorepo root)
├── backend/                    Express + Sequelize + MySQL API
│   ├── config/                 DB connection, Cloudinary SDK, cron scheduler
│   ├── controllers/            Route handlers (business logic)
│   ├── middleware/             Auth guard, optional auth, error handler, multer, rate limiters
│   ├── model/                  Sequelize models + associations
│   ├── routes/                 Express router wiring
│   ├── utils/                  JWT, email, Cloudinary, AI, categories, API response
│   ├── emails/                 React Email password-reset template
│   ├── scripts/                One-off seed/enrich scripts (multi-LLM content generation)
│   ├── app.ts                  Express app factory (middleware, routes, CORS)
│   └── server.ts               Database bootstrap, sync, self-healing, startup
└── frontend/                   React 19 SPA
    ├── public/                 Static assets (hero mockups, logo, favicon, SEO files)
    ├── src/
    │   ├── api/                Axios client with interceptors + typed API services
    │   ├── assets/             Static images
    │   ├── components/         20+ reusable UI components
    │   ├── context/            AuthProvider (user state + bookmark sets)
    │   ├── hooks/              Data hooks + utilities (pagination, categories, images)
    │   ├── pages/              16 page-level route components
    │   ├── App.tsx             Root component with routing
    │   └── main.tsx            ReactDOM entry point
    └── index.html              HTML entry point with Google Fonts
```

**Backend** follows a strict layered architecture:

```
Client Request
      |
      v
Routes/        ->  path matching, middleware wiring
Middleware/    ->  authenticate, rate limit, multer, error handler
Controllers/   ->  business logic (wrapped in express-async-handler)
Models/        ->  Sequelize ORM (queries, hooks, validations)
Database       ->  MySQL (parameterized queries only)
      |
      v
ApiResponse/   ->  standardized JSON shape back to the client
```

**Frontend** uses a **Context + Hooks** pattern. A single `AuthProvider` holds the current user, both bookmark ID sets, and all auth/bookmark methods. Data fetching is handled by dedicated hooks. Cross-cutting concerns (like 401 handling) live in an Axios interceptor rather than in each page.

<details>
<summary>🖱️ Expand — Why no state management library (Redux/Zustand)?</summary>

I evaluated Zustand seriously. The honest conclusion: **this app doesn't need it.**

- The only *global* state is: current user, bookmark ID sets, and theme. That's exactly one context provider.
- Everything else is *server state*, which doesn't belong in a global store — it belongs in hooks that fetch on demand.
- React Context + `useState`/`useEffect` scales perfectly to this complexity. Adding Redux would have doubled the code and halved the readability.

Rule of thumb I now live by: **if your global state fits on one index card, you don't need a state library.**

</details>

---

## 🔄 The Request Lifecycle: A Guided Tour

Let's trace one full request through the entire system — say, a user liking a blog post. This is the single best way to understand the architecture:

<details>
<summary>🖱️ Click to expand — Follow one request from click to database</summary>

**1. The Click (Frontend)**
The user clicks the like button on `/post/42`. `useBlog(42)`'s `toggleLike` runs an **optimistic update** — the heart fills and the count increments immediately, even before the network round-trip. Then it calls `BlogApi.toggleLike(42)`.

**2. The HTTP Request (Axios)**
The Axios instance fires `POST http://localhost:9000/api/v1/blogs/42/like` with:
- `withCredentials: true` → the `token` cookie rides along
- `Content-Type: application/json`

**3. The Middleware Stack (Backend)**
The request enters the Express app. In order:
- `helmet()` sets security headers
- `cors()` checks the origin against the allow-list (with `credentials: true`)
- `morgan('dev')` logs it to console
- `cookieParser()` parses the cookie into `req.cookies`
- `express.json()` parses the body
- `globalLimiter` (300 req/15 min) counts this request
- `authenticate` middleware verifies the JWT, loads the user from the DB, attaches it to `req.user`

**4. The Controller**
`toggleBlogLike` runs:
1. Verifies the blog exists and is active (`where: { id, isActive: true }`)
2. Looks for an existing like row: `likes.findOne({ where: { userId, blogId } })`
3. Destroys it (unlike) or creates it (like) — the unique composite index guarantees no duplicates
4. Counts fresh likes: `likes.count({ where: { blogId } })`
5. Responds via the `ApiResponse` utility

**5. The Response**
```json
{ "success": true, "message": "Like toggled", "data": { "liked": true, "likesCount": 128 } }
```

**6. The Reconciliation (Frontend)**
The Axios interceptor unwraps `response.data`. `toggleLike` reconciles the optimistic state with the server truth. If the request failed, it reverts the heart and shows a toast.

**Total: 6 hops, 2 database queries, ~50ms on a good day.** That's the whole architecture in miniature.

</details>

---

## 🗄️ Database Design: Seven Models, One Cohesive Schema

The database is the heart of any platform, and Sequelize's model system made it a joy to design. ShowOff has **seven tables**: `users`, `blogs`, `projects`, `bookmarks`, `media`, `comments`, and `blog_likes`.

### 🗺️ The Entity Relationship Map

```
User     (1) ── hasMany ──→ Blog        ("blogs",      FK: author)
User     (1) ── hasMany ──→ Project     ("projects",   FK: ownerId)
User     (1) ── hasMany ──→ Bookmark    ("bookmarks",  FK: userId)
User     (1) ── hasMany ──→ Comment     ("comments",   FK: authorId)
User     (1) ── hasMany ──→ Like        ("likes",      FK: userId)

Blog     (1) ── hasMany ──→ Bookmark    ("bookmarks",  FK: blogId)
Blog     (1) ── hasMany ──→ Comment     ("comments",   FK: blogId)
Blog     (1) ── hasMany ──→ Like        ("likes",      FK: blogId)
Blog     (1) ── hasMany ──→ Media       ("media",      FK: associatedBlogId, ON DELETE: SET NULL)

Project  (1) ── hasMany ──→ Bookmark    ("bookmarks",  FK: projectId)
Project  (1) ── hasMany ──→ Comment     ("comments",   FK: projectId)
Project  (1) ── hasMany ──→ Blog        ("devlogs",    FK: projectId, ON DELETE: SET NULL)

Comment  (1) ── hasMany ──→ Comment     ("replies",    FK: parentId — nested threading)
```

### 🗂️ Model Explorer: Open Each Model

<details>
<summary>👤 The `users` table</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `username` | STRING(255) | NOT NULL, UNIQUE |
| `email` | STRING(255) | NOT NULL, UNIQUE, `validate: { isEmail: true }` |
| `password` | STRING(255) | NOT NULL — hashed via argon2 (`Bun.password.hash()`) |
| `phoneNumber` | STRING(255) | NOT NULL, UNIQUE, `validate: { len: [10, 10] }` |
| `isActive` | BOOLEAN | DEFAULT true — the soft-delete flag |
| `profileImage` | STRING(255) | NULLABLE — Cloudinary URL |
| `resetPasswordToken` | STRING(255) | NULLABLE — SHA-256 hash of the reset token (never the raw token) |
| `resetPasswordTokenExpiry` | DATE | NULLABLE — 5-minute window |

**Hooks:** `beforeCreate` and `beforeUpdate` hash the password — but only when `user.changed("password")`, so profile edits that don't touch the password never re-hash it:

```typescript
users.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await Bun.password.hash(user.password);
  }
});
```

</details>

<details>
<summary>📝 The `blogs` table</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `title` | STRING(255) | NOT NULL |
| `content` | TEXT | NOT NULL — HTML from the TipTap editor |
| `thumbnail` | STRING(255) | NULLABLE — AI-generated or uploaded Cloudinary URL |
| `author` | INTEGER | NOT NULL, FK → users.id |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, **ON DELETE: SET NULL** (devlogs survive project deletion) |
| `category` | STRING(255) | NULLABLE — auto-classified by keyword frequency |
| `isActive` | BOOLEAN | DEFAULT true — soft-delete flag |
| `createdAt` / `updatedAt` | DATE | DEFAULT NOW |

</details>

<details>
<summary>🛠️ The `projects` table</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `title` | STRING(255) | NOT NULL |
| `tagline` | STRING(255) | NOT NULL |
| `description` | TEXT | NOT NULL — markdown (often synced from GitHub README) |
| `techStack` | STRING(255) | NOT NULL — comma-separated tags |
| `githubUrl` | STRING(255) | NULLABLE |
| `liveUrl` | STRING(255) | NULLABLE |
| `thumbnail` | STRING(255) | NULLABLE |
| `ownerId` | INTEGER | NOT NULL, FK → users.id, **ON DELETE: CASCADE** |

</details>

<details>
<summary>🔖 The `bookmarks` table — polymorphic by design</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NULLABLE, FK → blogs.id, CASCADE |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, CASCADE |

**The polymorphism rule:** exactly one of `blogId` / `projectId` is set — never both. This is enforced at the controller level, and it means a single unified toggle endpoint handles both entity types. The trade-off (no database-level CHECK constraint enforcing "one XOR the other") is acceptable because the controller is the only writer.

</details>

<details>
<summary>🖼️ The `media` table — the asset lifecycle tracker</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `publicId` | STRING | NOT NULL — Cloudinary public ID |
| `url` | STRING | NOT NULL — Cloudinary secure URL |
| `status` | ENUM | NOT NULL, DEFAULT 'pending' — values: `pending`, `active`, `purged` |
| `bytes` | INTEGER | NULLABLE — file size (used for "storage saved" analytics) |
| `associatedBlogId` | INTEGER | NULLABLE, FK → blogs.id, **ON DELETE: SET NULL** |

This table is the unsung hero of the platform. Every image that ever passes through ShowOff is tracked here, and the three-state status machine makes automated cleanup possible (full story in [The Media Lifecycle](#the-media-lifecycle-tracking-every-image)).

</details>

<details>
<summary>💬 The `comments` table — nested threading via self-reference</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `content` | TEXT | NOT NULL — markdown |
| `authorId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NULLABLE, FK → blogs.id, CASCADE |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, CASCADE |
| `parentId` | INTEGER | NULLABLE, **self-FK → comments.id**, CASCADE |

Nested threads are stored as a self-referential `parentId` — a parent comment can have unlimited replies, each of which can have its own replies. The frontend builds the tree recursively from the flat list.

</details>

<details>
<summary>❤️ The `blog_likes` table — uniqueness enforced by the database</summary>

| Column | Type | Constraints / Notes |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NOT NULL, FK → blogs.id, CASCADE |

```typescript
indexes: [{ unique: true, fields: ["user_id", "blog_id"] }]
```

The **unique composite index** means "one like per user per post" is guaranteed by MySQL itself — even if two requests race to create a like, only one row can ever exist. The controller doesn't need a transaction for correctness.

</details>

### 🎯 Quick Quiz: Database Design

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: What happens to a blog's devlog relationship when its project is deleted?**

A1: `projectId` is `ON DELETE: SET NULL` — the blogs are unlinked, not deleted. Your articles survive.

**Q2: Why is there no `follows` table?**

A2: Because it doesn't exist yet — it's on the roadmap. The pattern is already proven by `blog_likes` (unique composite index on a join table).

**Q3: How does the database enforce "one like per user"?**

A3: A unique composite index on `(user_id, blog_id)`. MySQL rejects duplicate inserts.

</details>

---

## 👤 The User System: Register, Login, Profile and Deletion

The user lifecycle is implemented in `user.contoller.ts` (yes, with a typo — a quirk of this project I refuse to fix, like a beauty mark on code). Every endpoint here has a story.

### 📝 Registration: The Full Validation Gauntlet

**`POST /api/v1/users/register`** accepts a `multipart/form-data` request: `username`, `email`, `password`, `phoneNumber`, and an optional `profileImage` file. The controller validates everything manually before touching the database:

| Rule | Detail |
|---|---|
| All fields required | Missing anything → 400 |
| Password length | **6–20 characters** |
| Username unique | Among **active** users only |
| Email unique | Among **active** users only |
| Phone format | **Exactly 10 characters** (India-style mobile) |

The "among active users" detail is deliberate and important: because accounts are *soft-deleted* (never hard-deleted), a deleted account must not permanently squat on a username or email. Delete your account → the username/email are freed for the next person.

Then the password is hashed with Bun's built-in argon2 — no bcrypt dependency in the entire project:

```typescript
const hashedPassword = await Bun.password.hash(password);
const user = await users.create({
  username, email, password: hashedPassword, phoneNumber,
});
```

If a profile image was uploaded, it goes to Cloudinary's `profile_images` folder via `uploadBufferToCloudinary()`. A failure here is **non-fatal** — the account is created anyway, just without an avatar. Robustness over perfection.

The response explicitly deletes the password field from the user object before serialization — defense in depth, even though the model never returns it elsewhere.

### 🔐 Login: Verify, Sign, Set the Cookie

**`POST /api/v1/users/login`** receives `{ email, password }`:

1. Find the user by email (must be active)
2. `Bun.password.verify(password, user.password)` — argon2 verification
3. Sign a JWT with JOSE (`SignJWT`, HS256, 7-day expiry, payload: `{ id }`)
4. Set the cookie (details below)
5. Return the sanitized user profile

<details>
<summary>🖱️ Expand — The complete login controller flow</summary>

```typescript
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ where: { email, isActive: true } });

  if (!user || !(await Bun.password.verify(password, user.password))) {
    throw new ErrorHandler("Invalid email or password", 401);
  }

  const token = await generateToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: isProduction ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = user.toJSON();
  delete userResponse.password;
  return new ApiResponse(200, true, "Login successful", userResponse).send(res);
});
```

Notice: one query, one hash verification, one cookie — that's the whole login. The `sameSite`/`secure`/`domain` trio is what makes the same code work on localhost **and** in cross-domain production (more in the deployment war stories).

</details>

### ✏️ Profile Management: Change What You Want

**`PUT /api/v1/users/update`** (authenticated, multipart) accepts any subset of: `username`, `email`, `phoneNumber`, `password`, `profileImage`. The controller:

- Checks uniqueness **only when a field actually changed** (and only against other active users)
- Lets the `beforeUpdate` model hook re-hash any new password — the controller never touches hashing
- Uploads a new avatar to Cloudinary if provided
- Returns the fresh profile, which the frontend syncs into `AuthContext` via `updateUser()`

### 🗑️ Account Deletion: Soft, Anonymized, and Clean

**`DELETE /api/v1/users/delete`** is a soft delete *and* an anonymization routine:

```typescript
await user.update({
  isActive: false,
  username: `deleted_${user.username}_${user.id}`,
  email: `deleted_${user.username}_${user.id}@deleted.com`,
});
res.clearCookie("token");
```

Why rename? Because `username` and `email` are UNIQUE columns. Setting them to a deterministic `deleted_...` value frees the original names for new registrations while keeping every constraint happy. The account and its content are permanently hidden — their blogs go with them (also soft-deleted), their comments/likes cascade away.

### 👀 Public Profiles: Minimum Viable Exposure

**`GET /api/v1/users/profile/:username`** exposes exactly five fields: `id`, `username`, `email`, `createdAt`, `profileImage`. No phone number, no internal flags, nothing a scraper could weaponize.

---

## 🛡️ Authentication and Security: JWT Cookies, Hashed Tokens, Rate Limits

### JWT in httpOnly Cookies

Login issues a JWT signed with **JOSE's `SignJWT`** (HS256, 7-day expiry) containing the user ID, and stores it in an **httpOnly cookie** — never accessible to JavaScript, which neutralizes XSS-based token theft:

```typescript
const token = await generateToken(user.id);
res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https",
  sameSite: isProduction ? "none" : "lax",
  domain: process.env.COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

<details>
<summary>🖱️ Expand — The `authenticate` middleware, step by step</summary>

The `authenticate` middleware guards every protected endpoint. Its job:

1. **Extract** the token from `req.cookies.token` — or, for non-browser clients, an `Authorization: Bearer <token>` header
2. **Verify** signature + expiry with jose's `jwtVerify` (HS256, `JWT_SECRET`)
3. **Extract** the `userId` from the decoded payload
4. **Hydrate** the full user from the database (`findByPk`) — this guarantees `req.user` is always the *current, real* user, so deleted or deactivated accounts are locked out instantly even with a valid token
5. **Attach** the Sequelize model instance to `req.user` and call `next()`
6. **Fail safely**: `ErrorHandler(401)` for bad/missing tokens, `ErrorHandler(404)` if the user no longer exists

```typescript
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new ErrorHandler("Not authenticated", 401);

  const payload = await jwtVerify(token, secret);           // jose
  const user = await users.findByPk(payload.id);
  if (!user) throw new ErrorHandler("User not found", 404);

  req.user = user;   // full Sequelize model instance
  next();
});
```

A sibling `optionalAuthenticate` middleware runs the same logic inside a try/catch and silently continues without auth — used by `GET /blogs/blog/:id` so the response can include `isLikedByMe` when logged in, without failing for anonymous visitors.

</details>

On the frontend, this translates to a **cookie-session SPA**: the Axios client sends `withCredentials: true` on every request, and the `AuthProvider` restores the session on mount with a single `GET /users/me`. No tokens in `localStorage`, no refresh dance, no state to sync — the cookie is the source of truth.

### 📧 Password Reset: Hashed Tokens, Beautiful Emails

The reset flow follows security best practices end-to-end:

```
[1] User clicks "Forgot password"     ->  enters email
              |
              v
[2] Server: crypto.randomBytes(32)    ->  hex token
              |
              v
[3] Server: SHA-256 hash of token stored in DB (+ 5-min expiry)
              |
              v
[4] Resend API: React Email template rendered -> sent to user
              |
              v
[5] User clicks link                  ->  reset-password page (token in URL)
              |
              v
[6] Server: hashes incoming token     ->  matches stored hash + expiry -> updates password
```

<details>
<summary>🖱️ Expand — The 3 clever details you might miss</summary>

1. **The database stores a hash of the token, never the token itself.** If the database leaks, reset tokens can't be replayed — they're useless SHA-256 digests of 32 random bytes.

2. **The email is a React component.** `ResetPasswordEmail.tsx` uses `@react-email/components` (Html, Head, Preview, Body, Container, Button...) with inline styles — an indigo `#4f46e5` "Reset Password" CTA button, a fallback plain-text link with `word-break: break-all` for email clients that strip buttons, a 580px container, and a footer. Same language, same design system as the app. Type-safe email templates are a superpower.

3. **Dev fallback.** With no `RESEND_API_KEY` configured, the reset link prints to the server console instead of failing. Local development stays frictionless; production fails loudly.

</details>

### 🚦 Rate Limiting: Two Tiers of Protection

| Limiter | Limit | Applied To | Skip |
|---|---|---|---|
| `globalLimiter` | **300 requests / 15 min** | All `/api/v1` routes | `/health`, `/healthz`, `/` — so uptime monitors never get 429'd |
| `authLimiter` | **15 requests / 15 min** | Register, login, forgot-password, reset-password | — |

The `standardHeaders: "draft-8"` option exposes `RateLimit-*` headers per the IETF draft, so clients can see their remaining quota. The auth limiter throttles credential-stuffing to a glacial 1 attempt/minute.

### 🎯 Quick Quiz: Auth and User System

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: What happens to a deleted user's username?**

A1: It's renamed to `deleted_{username}_{id}`, freeing the original for new registrations while keeping the UNIQUE constraint happy.

**Q2: Where is the raw password-reset token stored?**

A2: Nowhere. Only its SHA-256 hash is stored in the database, with a 5-minute expiry.

**Q3: Why does the `authenticate` middleware hit the database on every request?**

A3: To guarantee `req.user` is the current, real user — deleted or deactivated accounts are locked out instantly, even with a still-valid JWT.

</details>

---

## 🤖 The AI Cover Pipeline: The Showstopper

The most interesting subsystem in ShowOff is the **AI cover generation pipeline**. When you publish a blog post (or a project) without an uploaded thumbnail, the backend automatically generates a cover image through **five fallback stages**. It lives in `utils/ai.utils.ts` as `generateSmartBlogCover(blogTitle)`:

```
Blog Title
     |
     v
Stage 1: Extract Search Keyword (Gemini 2.5 Flash -> Mistral-small-3.2 -> raw title)
     |
     v
Stage 2: Unsplash stock photo search
     |
     v   (no result)
Stage 3: Pexels stock photo search
     |
     v   (no result)
Stage 4: "Art Director" brief (Gemini 2.5 Flash -> Mistral-small-3.2 -> default)
     |        -> Image generation (Cloudflare Flux-1-Schnell -> Pollinations Flux)
     v
Stage 5: Upload to Cloudinary
     |
     v
Return { url, publicId, bytes }   |   null if everything fails
```

### Stage 1: Keyword Extraction

The title is sent to **Gemini 2.5 Flash** with a tightly-constrained prompt: extract the single most important language/technology/topic into a 1–2 word search term. If Gemini fails, the pipeline falls back to `mistral-small-3.2` via Pollinations, and finally to the raw title itself.

```typescript
async function getSearchTerm(title: string): Promise<string> {
  const prompt = `Extract the single most important programming language, technology,
or core topic name from this blog title. Output ONLY the term, nothing else.
The term must NOT contain the word "photography" or anything similar.
Title: "${title}"`;

  // Tier 1: Gemini 2.5 Flash
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    // Parse the candidate from resp.candidates[0].content.parts[0].text,
    // trim quotes/whitespace, strip "photography" variants, and return it
  } catch { /* fall through */ }

  // Tier 2: Mistral-small-3.2 via Pollinations (max_tokens: 15)
  try { /* ...chat completions call... */ } catch { /* fall through */ }

  return title; // Tier 3: raw title
}
```

<details>
<summary>🖱️ Expand — Two design decisions that look tiny but matter</summary>

1. **`max_tokens: 15`** on the Mistral fallback forces a terse answer. Without it, LLMs love returning *"The most important technology in this blog title is React, a JavaScript library for building user interfaces..."* — 30 tokens of garbage that ruins a search query.

2. **The prompt bans "photography"** — because the LLM returns it for *everything*. And "photography" as an Unsplash query returns random camera photos, completely useless as a cover for a React article. Prompt engineering is debugging the LLM's most likely failure mode.

</details>

### Stages 2–3: Stock Photo Search

The keyword is used to search **Unsplash**, then **Pexels**. The first result's image is downloaded as a buffer — crisp, professional photos for popular topics at zero AI cost:

```typescript
async function tryUnsplash(keyword: string): Promise<Buffer | null> {
  const resp = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1`,
    { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
  );
  const data = await resp.json();
  const url = data.results?.[0]?.urls?.regular;
  if (!url) return null;
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}
```

Pexels mirrors this with `photos[0].src.large` and the raw key in the `Authorization` header. Either stage returning a buffer short-circuits the pipeline straight to Cloudinary.

### Stage 4: The Art Director and The Artist

If both stock APIs come up empty, the pipeline does something more creative. First, another LLM call — this time with a heavily-constrained **art direction prompt** — produces a single-sentence visual brief. The constraints are the magic:

<details>
<summary>🖱️ Expand — The complete art direction prompt</summary>

```typescript
async function generateArtDirectorBrief(title: string): Promise<string> {
  const prompt = `Design a beautiful, high-quality visual concept for an article cover
representing this specific topic. Topic: "${title}".
Describe only visual objects, colors, and art style in ONE detailed sentence.
Constraints:
- NO text, typography, UI screenshots, or code
- NO animals or literal tool metaphors (no literal wrench, hammer, etc.)
- Prefer abstract, geometric, digital, futuristic, tech-inspired imagery
- You MAY use iconic symbols like databases, servers, gears, networks,
  locks, lightbulbs, atomic orbits, circuit patterns
- Style: modern, sleek, professional, high-end 3D art, cinematic lighting`;
  // → Gemini 2.5 Flash first, then mistral-small-3.2 (max_tokens: 100)
  // → emergency default: "A modern, sleek digital conceptual illustration
  //   for {title}, clean glowing geometric shapes, futuristic lighting, 3D art"
}
```

This is what turns "a picture of React" into *"a sleek digital concept with glowing geometric nodes connected by energy threads"*. Abstract > literal, every time, for blog covers.

</details>

That brief becomes the prompt for **Cloudflare Workers AI** running `@cf/black-forest-labs/flux-1-schnell`. The integration handles **two different response shapes** — Cloudflare can return either a raw binary image body or a JSON envelope with a base64 `result.image` string — so the code inspects the `Content-Type` header before deciding how to decode:

```typescript
async function generateFluxImage(brief: string): Promise<Buffer | null> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: brief }),
    });
    const contentType = resp.headers.get("content-type") ?? "";
    if (contentType.includes("image")) {
      return Buffer.from(await resp.arrayBuffer());        // direct binary
    }
    const json = await resp.json();
    return Buffer.from(json.result.image, "base64");       // base64 envelope
  } catch { /* fall through */ }

  // Fallback: Pollinations Flux
  const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(brief)}?width=800&height=450&nologo=true&private=true&model=flux`;
  // ...download and return Buffer, or null
}
```

### Stage 5: Cloudinary Upload

Whatever buffer survives the chain — stock photo or AI render — is uploaded to Cloudinary and returned as `{ url, publicId, bytes }`:

```typescript
const result = await uploadBufferToCloudinary(buffer, "blog_thumbnails");
```

The blog's `thumbnail` field is set, and the asset is registered in the `media` table with `status: "active"` so it's tracked and never treated as an orphan. A total failure at every tier returns `null` — the blog is still created, and the frontend's SVG fallback thumbnail (see [The Blog Engine](#the-blog-engine-editor-search-categories-and-more)) saves the day. **The platform never breaks because an AI API went down.**

### 🎮 The AI Sandbox: The Pipeline as a Playground

The frontend ships an interactive **AI Sandbox** (`AiSandbox.tsx`) on the About page. You type a blog title, hit "Generate Cover", and watch the pipeline run in real time with an animated console log:

```
[SYSTEM]       → Initializing AI art pipeline for "Mastering Sequelize Transactions"...
[ART DIRECTOR] → Gemini 2.5 Flash generating visual concept brief...
[FLUX CANVAS]  → Cloudflare Flux-1-Schnell rendering 800x450 cover...
[CLOUDINARY]   → Uploading cover to CDN...
[SYSTEM]       → Cover generated in 3.2s [OK]
```

It's powered by the public `POST /blogs/test-ai-prompt` endpoint (which also returns the art director's brief, so you can see *why* the image looks the way it does), and it's honestly one of the most fun parts of the platform to demo — it turns a complex backend pipeline into a playground.

### 🎯 Quick Quiz: The AI Pipeline

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: Why does the pipeline try Unsplash and Pexels BEFORE generating an image?**

A1: Stock photos are free (API-wise), instant, and professional for popular topics. AI generation is the fallback for topics stock APIs don't cover well.

**Q2: What happens if Gemini, Cloudflare, AND both stock APIs fail?**

A2: The pipeline returns `null`, the blog is still created without a thumbnail, and the frontend's SVG data-URI fallback guarantees the card still looks great. The platform never breaks.

**Q3: Why ban "photography" and "literal tools" in the prompts?**

A3: Both are the LLM's favorite lazy answers. "Photography" returns useless camera photos from stock APIs; literal tool metaphors (a hammer for "tools") produce cheesy covers. Constraints make the output consistently abstract and premium.

</details>

---

## 🖼️ The Media Lifecycle: Tracking Every Image

Because the AI pipeline (and users) create images all over the platform, ShowOff needed a way to **know which images are in use and clean up the rest**. That's the `media` table's job:

```
                        [Upload]
                           |
                           v
               status: "pending"      <- provisionally owned by no one
                           |
                           v   (blog created/updated with this image URL)
               status: "active"       <- linked to a blog
                           |
                           v   (blog soft-deleted OR image removed from content)
               status: "pending"      <- orphaned again
                           |
                           v   (midnight cron, asset older than 24h)
               status: "purged"       <- deleted from Cloudinary too
```

### 📤 The Upload Flow: Step by Step

<details>
<summary>🖱️ Expand — Follow an image from your hard drive to the CDN</summary>

**1. The user picks a file** in the TipTap editor ("Upload Local Image") or the profile/project forms.

**2. Multer parses it in memory** — `multer.memoryStorage()` puts the bytes in `req.file.buffer`. The file *never touches the server's disk*. That's a security win (no arbitrary files on the host) and a deployment win (works on ephemeral filesystems).

**3. The controller streams it to Cloudinary:**

```typescript
// POST /api/v1/blogs/upload
const uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadStream(req); // → { secure_url, public_id, bytes }
  await media.create({
    publicId: result.public_id,
    url: result.secure_url,
    status: "pending",
    bytes: result.bytes,
  });
  return new ApiResponse(201, true, "Image uploaded", result).send(res);
});
```

**4. A `media` row is born with `status: "pending"`** — the asset is provisionally owned by no one. If the user closes the tab and never saves the blog, this image is a future orphan.

**5. The `secure_url` returns to the editor**, which inserts it with `editor.chain().focus().setImage({ src })`.

**6. On blog save**, `activateMediaForBlog()` promotes the image to `active` (below).

</details>

### 🔗 Activation and Reconciliation

When a blog is created or updated, the controller regex-extracts every `<img src>` from the HTML content and flips matching media rows to `active`:

```typescript
async function activateMediaForBlog(content: string, blogId: number) {
  const imgSrcs = [...content.matchAll(/<img[^>]*src="([^"]*)"/g)].map((m) => m[1]);
  if (!imgSrcs.length) return;
  await media.update(
    { status: "active", associatedBlogId: blogId },
    { where: { url: imgSrcs } }
  );
}
```

On **update**, the reconciliation is bidirectional (`updateMediaForBlog`):
1. Extract all image URLs from the *new* content
2. Find all media previously linked to this blog
3. **Free** any media whose URL is no longer in the content → `pending`, unlinked (destined for the cron)
4. **Activate** any new images found in the content

So if you remove an image from an article and save, the platform silently deletes the Cloudinary asset overnight.

### 🧹 The Midnight Cleanup Cron

**Every night at midnight**, a `node-cron` job (`0 0 * * *`) finds `pending` media older than 24 hours, deletes it from Cloudinary, and marks the row `purged`:

```typescript
cron.schedule("0 0 * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const orphans = await media.findAll({
    where: { status: "pending", createdAt: { [Op.lt]: cutoff } },
  });
  for (const asset of orphans) {
    await cloudinary.uploader.destroy(asset.publicId); // remove from CDN
    await asset.update({ status: "purged", associatedBlogId: null });
  }
});
```

<details>
<summary>🖱️ Expand — Why a 24-hour window?</summary>

The window is deliberate. An image uploaded into a *draft* stays `pending` until the blog is saved — which could take hours while the author writes. A 1-hour window would delete images from legitimate in-progress drafts. A 24-hour window gives users a full day to finish writing, while guaranteeing anything truly abandoned gets reclaimed within a day. It's a patience/cleanliness trade-off tuned from real usage.

</details>

No orphaned images, no wasted Cloudinary storage, no manual cleanup. The Platform Analytics dashboard even reports **how much storage the cleanup has saved** by summing the `bytes` of purged assets — the cron's performance review.

### 🎯 Quick Quiz: Media Lifecycle

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: What status does an image get the moment it's uploaded?**

A1: `pending` — provisionally owned by no one.

**Q2: What makes an image "orphaned"?**

A2: Being `pending` for more than 24 hours. That means a blog was never saved with it (or it was removed from content / its blog was deleted).

**Q3: Does the cron job delete the Cloudinary file?**

A3: Yes — `cloudinary.uploader.destroy(publicId)` removes it from the CDN, then the row is marked `purged`.

</details>

---

## 📝 The Blog Engine: Editor, Search, Categories and More

### ✍️ The Editor: TipTap

> 👩‍💻 **User guide card:** the user-facing editor tour lives in [Step 1 — The editor, in 60 seconds](END_USER_DOCUMENTATION.md#the-writers-guide-publishing-your-first-post)). This deep dive is how it's built.

The blog editor (`CreateBlogPage.tsx`) is built on **TipTap 3**, a headless wrapper around ProseMirror. The toolbar provides:

**Formatting:** bold, italic, H1, H2, inline code, code blocks, blockquotes
**Lists:** ordered, bulleted
**Media:** web-image URL insertion, local image upload
**Links:** hyperlinks with custom styling
**Placeholder:** "Write your content here..." hint text

Active states are tracked via `editor.isActive()` — the Bold button visually depresses when your cursor is inside bold text. Two bubble menus appear contextually: a formatting bar floats above text selections, and a delete button appears when an image is selected.

<details>
<summary>🖱️ Expand — The custom smart code block command</summary>

A custom `toggleSmartCodeBlock` command wraps the currently selected paragraph(s) into a code block via a raw ProseMirror transaction:

```typescript
const toggleSmartCodeBlock = () => {
  const { state, chain } = editor;
  const isCode = state.selection.$from.parent.type.name === "codeBlock";
  if (isCode) {
    return chain().focus().unsetCodeBlock().run();
  }
  // Wrap the selected block(s) in a code block via transaction
  return chain().focus().wrapIn({ type: "codeBlock" }).run();
};
```

Small plumbing, but it's what makes multi-line code embedding feel native.

</details>

**Local image upload flow:**

1. Click "Upload Local Image" → native file picker
2. File sent as `multipart/form-data` to `POST /blogs/upload`
3. Server streams to Cloudinary's `blog_images` folder → returns `secure_url`
4. Editor inserts it: `editor.chain().focus().setImage({ src: secureUrl }).run()`
5. Server has a new `pending` media row, waiting for the blog to be saved

**Validation** is react-hook-form + Zod: title 5–100 characters, content 20+ characters (HTML-stripped for counting), optional `projectId`. Errors render inline; the submit button disables while saving.

### 🎬 The Create Flow: One Endpoint, Five Responsibilities

> 👩‍💻 **User guide card:** wondering what actually happens when you hit Publish? The human version is in [Step 3 — Hitting Publish](END_USER_DOCUMENTATION.md#the-writers-guide-publishing-your-first-post)). Below is the machine version.

`POST /api/v1/blogs/create-blog` is a small symphony:

```typescript
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const projectId = req.body.projectId || null;

  // 1. Detect inline images in the HTML content
  const hasInlineImages = /<img/i.test(content);
  let thumbnail = null;

  // 2. No images? The AI Cover Pipeline writes the thumbnail for you
  if (!hasInlineImages) {
    const cover = await generateSmartBlogCover(title);
    thumbnail = cover?.url ?? null;
  }

  // 3. Auto-classify into a category by keyword frequency
  const category = getCategoryForBlog(title, content);

  // 4. Create the blog
  const blog = await blogs.create({
    title, content, thumbnail, category, author: req.user.id, projectId,
  });

  // 5. Link any uploaded images in the content to this blog
  await activateMediaForBlog(content, blog.id);
  if (thumbnail) {
    await media.create({
      url: thumbnail,
      publicId: extractPublicId(thumbnail),
      status: "active",
      associatedBlogId: blog.id,
    });
  }

  return new ApiResponse(201, true, "Blog created successfully", blog).send(res);
});
```

Notice the ordering: the AI pipeline runs **before** the DB insert (so a slow generation doesn't hold a transaction), and media activation runs **after** (so the blog ID exists to link against).

**🧭 Step Explorer — Walk through the create flow one stage at a time:**

<details>
<summary>Step 1 — Content arrives at the endpoint</summary>

`title`, `content` (HTML), and optional `projectId` are pulled from the body. `content` has already passed Zod's 20+ character (HTML-stripped) minimum on the frontend, and Sequelize re-validates on the model layer.

</details>

<details>
<summary>Step 2 — The AI pipeline decides the thumbnail</summary>

`/<img/i.test(content)` checks whether the article embeds any image. If not, `generateSmartBlogCover(title)` fires — keyword extraction → stock photos → AI render (the whole 5-stage chain). This runs *before* the insert so a 3-second generation never holds a DB transaction.

</details>

<details>
<summary>Step 3 — Auto-categorization</summary>

`getCategoryForBlog(title, content)` scores the text against 6 category keyword banks (JavaScript, Node.js, React, Databases, AI/ML, DevOps, General fallback) and picks the highest-frequency match — no user input, no manual tagging.

</details>

<details>
<summary>Step 4 — The insert</summary>

`blogs.create()` runs with the author hard-set from `req.user.id` — the server never trusts a client-sent author field. The thumbnail, category, and projectId land in the row atomically.

</details>

<details>
<summary>Step 5 — Media bookkeeping</summary>

`activateMediaForBlog(content, blog.id)` regex-extracts every `<img src>` and flips matching `media` rows to `active` + linked to the blog. If the AI pipeline produced a thumbnail, a fresh `media` row is created for it too — so even generated covers are tracked, never orphaned.

</details>

### 🔍 The Listing and Search Endpoint

`GET /blogs/get-all-blogs` is the workhorse powering the Explore page, the homepage, the category drawer, and public profiles:

| Parameter | Type | Behavior |
|---|---|---|
| `page` | number | Page number, default 1 |
| `limit` | number | Items per page, default 9 |
| `search` | string | SQL `LIKE` across title AND content (`%term%`) |
| `category` | string | Exact match; `general` maps to `[null, "general"]` so uncategorized posts are findable |
| `all` | boolean | `true` → skip pagination, return everything |
| `authorId` | number | Filter by author (public profiles) |

The category + search combination is built with `Op.and` so both filters apply simultaneously, and results are ordered `createdAt DESC`. Paginated response shape:

```json
{
  "success": true,
  "data": {
    "blogs": [ /* each with authorDetails */ ],
    "pagination": { "totalItems": 128, "totalPages": 15, "currentPage": 1, "limit": 9 }
  }
}
```

<details>
<summary>🖱️ Expand — The Explore page UX that consumes it</summary>

- A **300ms-debounced search input** — type "sequelize" and the fetch fires 300ms after you stop typing, not per keystroke. New query → reset to page 1.
- A **custom pagination bar** with smart ellipsis logic: at most 5 page slots are shown, so page 128 of 300 renders as `1 … 126 127 [128] 129 130 … 300` instead of 300 buttons.
- A grid/list **layout toggle** — the same blogs render as a 1/2/3-column grid or a dense list.
- An empty state with a "search_off" icon and a "Start Writing" CTA when nothing matches.

</details>

### 🔄 The Update Flow: Media Reconciliation

`PUT /api/v1/blogs/update-blog/:id` is restricted to the author (the `where` clause includes `author: req.user.id`), re-runs category detection, and — the interesting part — reconciles media state against the new content. `updateMediaForBlog()`:

1. Extracts all image URLs from the *new* content
2. Finds all media previously linked to this blog
3. **Frees** any media whose URL is no longer in the content → `status: "pending"`, `associatedBlogId: null` (the midnight cron will purge it from Cloudinary)
4. **Activates** any new images found in the content → `status: "active"`, linked to the blog

### 🗑️ Soft Delete and the Deleted-Blogs Graveyard

`DELETE /api/v1/blogs/delete-blog/:id` doesn't delete — it flips `isActive: false` and unlinks media back to `pending`. `GET /blogs/deleted-blogs` returns your soft-deleted posts (a "restore from trash" feature waiting for its UI), and `DELETE /blogs/delete-all` bulk-soft-deletes everything. All list queries filter `where: { isActive: true }`, so deleted content is invisible everywhere else.

### 🏷️ Auto-Categorization: The Keyword Frequency Algorithm

> 👩‍💻 **User guide card:** "why did my post land in Databases?" — the answer for non-coders is in [Step 3 — Hitting Publish](END_USER_DOCUMENTATION.md#the-writers-guide-publishing-your-first-post)). Here's the actual algorithm.

Every blog is classified into one of six categories — `frontend`, `backend`, `databases`, `devops`, `ai`, `general` — by a **keyword frequency algorithm** (`getCategoryForBlog`):

```typescript
export function getCategoryForBlog(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  let best = "general";
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) { bestScore = score; best = category; }
  }
  return best;
}
```

<details>
<summary>🖱️ Expand — The full keyword lists per category</summary>

| Category | Keywords (matched case-insensitively) |
|---|---|
| `frontend` | react, vue, angular, svelte, css, html, tailwind, flexbox, grid, frontend, ui, ux, components, responsive, dom, browser, javascript, typescript, hooks, state, usestate, useeffect |
| `backend` | node, bun, express, koa, nest, api, backend, rest, graphql, router, controller, middleware, auth, jwt, session, token, server, http, websocket |
| `databases` | sequelize, mysql, postgres, postgresql, sqlite, mongodb, redis, nosql, sql, query, orm, migration, database, db, schema, transaction, indexing |
| `devops` | cloudinary, cron, docker, kubernetes, aws, gcp, azure, deploy, deployment, ci/cd, github actions, upload, purged, cleanup, automation, pipeline |
| `ai` | ai, llm, mistral, pollinations, flux, prompt, image generation, cover art, artwork, gpt, openai, diffusion, generative, brief, artist |
| `general` | catch-all — wins ties and zero-match cases |

The category with the most keyword hits wins; ties and zero-matches fall back to `general`. It's not ML — it's a deterministic frequency counter — but it's fast, free, explainable, and surprisingly accurate for technical content.

</details>

The same logic is mirrored on the frontend (in `hooks/useBlogs.ts`) so the UI can preview categories instantly, and the backend **backfills** any `category: null` blogs at server startup — so every post ever written gets retroactively classified.

### ⏱️ Reading Time and Fallback Thumbnails

The frontend computes reading time by stripping HTML tags, counting words, and dividing by **200 WPM** (minimum 1 minute — "X min read" badges never show 0).

<details>
<summary>🖱️ Expand — The SVG thumbnail generator</summary>

My favorite frontend detail — `generateSvgThumbnail(title, content)` creates a beautiful inline SVG data-URI thumbnail:

- A gradient background **picked deterministically by hashing the title** (indigo→purple, blue→cyan, pink→rose, emerald→blue) so each post gets a stable color identity
- Wrapped title text (24-char lines) and a short summary excerpt (45-char lines)
- Decorative `</>` and `{ }` code glyphs
- A "SHOWOFF PUBLICATION" tag

It's the last resort in the image-resolution cascade:

```
blog.thumbnail   ->  first <img> in content   ->  generated SVG data-URI
```

Every blog card on the platform is guaranteed to have a visual, no matter what.

</details>

### 📖 The Blog Post Page

`/post/:id` renders the full article experience:

- A **reading-progress bar** fixed to the top — a `scaleX` transform driven by scroll position, so readers always know how far they are
- Author avatar, name, date, reading time, and category
- The article HTML rendered with Tailwind's `prose` classes
- A bookmark button (auth-only), like button (auth-gated with a "Please login to like this blog post" toast), and share button
- The full comment section
- **Author-only** Edit and Delete actions
- Auto-redirect to `/blogs` if the blog doesn't exist — no dead ends

### 🎯 Quick Quiz: The Blog Engine

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: When does the AI cover pipeline run in the create flow?**

A1: Only when the content has NO inline `<img>` tags — and before the DB insert, so a slow generation doesn't hold a transaction.

**Q2: What does `category=general` match in the listing API?**

A2: Both `category IS NULL` AND `category = 'general'` — `[null, "general"]` — so uncategorized posts are findable.

**Q3: What happens to a blog image you remove during an edit?**

A3: `updateMediaForBlog` frees it (`pending`, unlinked), and the midnight cron deletes it from Cloudinary within 24 hours.

</details>

---

## 🛠️ Project Showcase and Devlog Timelines

The **Project Hub** (`/projects`) is the portfolio half of the platform. A project carries `title`, `tagline`, `description`, a comma-separated `techStack`, `githubUrl`, `liveUrl`, and a `thumbnail`.

### 🔄 The Full CRUD Lifecycle

| Operation | Endpoint | Details |
|---|---|---|
| **Create** | `POST /projects` | Multipart; optional `thumbnail` file. **No file? The AI Cover Pipeline runs** and synthesizes a cover — tracked in `media` as `active`. |
| **List** | `GET /projects` | Every project + owner details + **computed `devlogsCount`** (active linked blogs); the devlogs array is stripped from the payload to keep the list light |
| **Detail** | `GET /projects/:id` | Full project + owner + all associated devlogs with authors, ordered `createdAt ASC` for the timeline |
| **Update** | `PUT /projects/:id` | Owner-only; optional thumbnail replacement |
| **Delete** | `DELETE /projects/:id` | Owner-only; hard delete — but devlogs survive via `SET NULL` |
| **User's projects** | `GET /projects/user` | Minimal `[{ id, title }]` for the blog editor's dropdown — deliberately no heavy fields |

### 📖 GitHub README Sync: My Favorite Feature

The **"Sync README"** button in the project form turns any GitHub repo into a populated project page in seconds. It calls `GET /projects/github-readme?githubUrl=...`:

<details>
<summary>🖱️ Expand — The URL parser that handles everything GitHub throws at you</summary>

```typescript
function parseGithubUrl(url: string) {
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//, "").replace(/^www\./, "");
  clean = clean.replace(/^github\.com\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  clean = clean.replace(/[{}]/g, ""); // GitHub copy-button braces
  const [owner, repo] = clean.split("/");
  return { owner, repo };
}
```

Users paste all sorts of things: `https://github.com/owner/repo`, `www.github.com/owner/repo.git/`, and — the sneaky one — GitHub's "Copy" button on the clone dialog wraps the URL in `{ }`, producing `https://github.com/{owner}/{repo}`. The parser strips scheme, www, `.git`, trailing slashes, and braces. Zero support tickets about URL formats.

</details>

Then:

1. **Fetch** — `GET https://api.github.com/repos/{owner}/{repo}/readme`, with an optional `GITHUB_TOKEN` for unauthenticated rate-limit headroom, and a `User-Agent: Showoff-App` header (GitHub requires one). A 404 produces a friendly "repo not found" message instead of a cryptic error.
2. **Decode** — the GitHub API returns README content base64-encoded: `Buffer.from(data.content, "base64").toString("utf-8")`.

The frontend drops that raw markdown into the description textarea, and the project detail page renders it with `marked.parse` — description always in sync with your repo.

### 🎴 The Project Card: Details That Matter

> 👩‍💻 **User guide card:** the walkthrough of what a visitor sees on a project page is in [What's on a project page](END_USER_DOCUMENTATION.md#the-project-showcase-guide)). Here's the design breakdown.

`ProjectCard.tsx` is a masterclass in information density done tastefully:

- **Thumbnail banner**, or a gradient placeholder with a terminal icon when there's no image
- A **bookmark toggle** for authenticated users
- A **devlog-count badge with a pulsing dot** — an animated attention signal showing the project is actively maintained
- **Color-coded tech badges** derived from the `techStack` string — the badge color is chosen by keyword matching:

| Keyword | Badge Color |
|---|---|
| React | Blue |
| Node / Bun | Emerald |
| Sequelize / SQL | Teal |
| AWS / cloud | Amber |
| AI / Flux | Rose |
| Anything else | Slate |

Reading a card's stack at a glance becomes possible — a subtle UI detail that pays for itself in every browsing session.

- Quick-action icons for **GitHub** and **live URL**
- An "Explore Devlogs" link into the full project page

### 📅 Devlogs: Blogs as Changelog Entries

Blogs can be associated with a project via the editor's "Associate with Showcase Project" dropdown, turning them into **devlogs**. The project detail page renders them as a vertical, alternating left/right **timeline** (`ProjectTimeline.tsx`):

```
[*] Update #1 — Project Kickoff
   `---- 12 Jan 2026 · by Sidharth · 4 min read
        [thumbnail]  "The project is born: goals, stack, structure..."   ->  Read Update ->

[*] Update #2 — Database Design
   `---- 19 Jan 2026 · by Sidharth · 8 min read
        [thumbnail]  "Schema, associations, and why we chose Sequelize..."  ->  Read Update ->
```

Each entry shows "Update #N" with the date, a thumbnail, a 120-character summary, reading time, and a "Read Update" link to the full post. Because `projectId` is `ON DELETE: SET NULL`, deleting a project **never deletes its devlogs** — a small FK choice that prevents a real user-data disaster.

### 🎯 Quick Quiz: Projects

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: What happens when you create a project without a thumbnail?**

A1: The AI Cover Pipeline runs (`generateSmartBlogCover(title)`) and synthesizes a cover — projects get AI art direction too.

**Q2: Why does the list endpoint compute `devlogsCount` and then strip the devlogs?**

A2: To keep list responses light (one number per card) while the detail page pays the cost of loading full devlogs only when needed.

**Q3: What weird GitHub URL edge case did the parser have to handle?**

A3: GitHub's copy-button wraps repo URLs in braces: `https://github.com/{owner}/{repo}`. The parser strips `{}`, scheme, `www.`, `.git`, and trailing slashes.

</details>

---

## 💖 Social Features: Bookmarks, Likes, Nested Comments and Sharing

### 🔖 Bookmarks: One Table, Two Entity Types

> 👩‍💻 **User guide card:** how saving works from the reader's chair is in [Bookmarks — read it later, everywhere](END_USER_DOCUMENTATION.md#social-and-community-guide)). The engineering below is the polymorphic trick.

The polymorphic bookmark table powers a "Save for Later" library. The backend flow is refreshingly simple — a single toggle endpoint for everything:

```typescript
// POST /api/v1/bookmarks/toggle  →  { blogId } | { projectId }
const toggleBookmark = asyncHandler(async (req, res) => {
  const { blogId, projectId } = req.body;

  // Validate: exactly one target, and it must exist
  if (blogId) await blogs.findByPk(blogId) ?? throw new ErrorHandler("Blog not found", 404);
  if (projectId) await projects.findByPk(projectId) ?? throw new ErrorHandler("Project not found", 404);

  const existing = await bookmarks.findOne({
    where: blogId ? { userId, blogId } : { userId, projectId },
  });

  if (existing) {
    await existing.destroy();
    return new ApiResponse(200, true, "Removed from bookmarks", { bookmarked: false }).send(res);
  }
  await bookmarks.create({ userId, blogId, projectId });
  return new ApiResponse(201, true, "Saved to bookmarks", { bookmarked: true }).send(res);
});
```

`GET /bookmarks` returns everything grouped as `{ blogs: [...], projects: [...] }` with full nested author/owner details — and defensively filters out any targets deleted since bookmarking.

<details>
<summary>🖱️ Expand — The frontend's optimistic bookmark system</summary>

The `AuthProvider` keeps `bookmarkedBlogIds` and `bookmarkedProjectIds` as `Set<number>`, offering **synchronous** checks and **optimistic** toggles:

```typescript
async function toggleBlogBookmark(id: number) {
  const wasBookmarked = bookmarkedBlogIds.has(id);
  // Optimistic flip + toast:
  setBookmarkedBlogIds(prev => { /* add or remove id */ });
  toast(wasBookmarked ? "Removed from bookmarks!" : "Saved to bookmarks!");
  try {
    await BookmarkApi.toggleBookmark({ blogId: id });
  } catch {
    // Roll back the optimistic update + error toast
  }
}
```

Three consequences worth noting:
- The **Library page** filters its bookmark list live against these Sets — un-saving an item removes it from the UI instantly, no refetch
- Every BlogCard/ProjectCard checks the Set synchronously to render the filled/outlined icon — zero extra requests
- The Sets re-hydrate on login and clear on the `auth:unauthorized` event

</details>

### ❤️ Likes: Optimistic UI Backed by a Unique Index

The like system is a join table (`blog_likes`) with a **unique composite index on `(user_id, blog_id)`** — the database itself makes duplicate likes impossible, so the controller is a simple find-or-toggle:

```typescript
const toggleBlogLike = asyncHandler(async (req, res) => {
  const blog = await blogs.findOne({ where: { id: req.params.id, isActive: true } });
  if (!blog) throw new ErrorHandler("Blog not found", 404);

  const existing = await likes.findOne({ where: { userId: req.user.id, blogId: blog.id } });
  if (existing) {
    await existing.destroy();
  } else {
    await likes.create({ userId: req.user.id, blogId: blog.id });
  }
  const likesCount = await likes.count({ where: { blogId: blog.id } });
  return new ApiResponse(200, true, "Like toggled", { liked: !existing, likesCount }).send(res);
});
```

<details>
<summary>🖱️ Expand — The optimistic like button</summary>

The like button on the article page performs an **optimistic update** — the heart fills and the count increments instantly, then reconciles with the server response:

```typescript
// Inside useBlog(id)
async function toggleLike() {
  setIsLiked(l => !l);
  setLikesCount(c => (isLiked ? c - 1 : c + 1));      // optimistic
  try {
    const res = await BlogApi.toggleLike(id);
    setLikesCount(res.likesCount);                     // reconcile
    setIsLiked(res.liked);
  } catch {
    setIsLiked(l => !l);                               // revert
    setLikesCount(c => (isLiked ? c - 1 : c + 1));     // revert
    toast.error("Could not update like");
  }
}
```

The "Liked by (N)" modal (`LikedUsersModal.tsx`) fetches `GET /blogs/:id/likes` on open and renders each liker's avatar, username, email, and a "View Profile" link — social proof with a route attached.

</details>

### 💬 Nested Comments with Markdown

> 👩‍💻 **User guide card:** how replying works for real users is in [Comments — nested, formatted, and safe to delete](END_USER_DOCUMENTATION.md#social-and-community-guide)). Below is the threading logic.

The comment system (`CommentSection.tsx`) is shared between blogs and projects via a `targetType` prop. Creating a comment (`POST /comments`):

1. Validates content is non-empty (after trimming)
2. Validates **exactly one** of `blogId` / `projectId` is present
3. Validates any `parentId` belongs to the **same target** — you can't cross-post replies between a blog and a project
4. Creates the comment, then re-fetches with `authorDetails` so the UI renders it without another request

Deletion has a **triple-check authorization** — a comment can be deleted by its author, the blog's author, or the project's owner:

```typescript
if (comment.authorId !== userId
    && !(await isBlogAuthorOrProjectOwner(comment))) {
  throw new ErrorHandler("You can only delete your own comments", 403);
}
```

<details>
<summary>🖱️ Expand — The comment UI, layer by layer</summary>

- **Write (Markdown) / Preview** tabbed composer with live preview via `marked` — with a try/catch fallback to raw text so a malformed markdown string can never crash the render
- **Nested threads** built recursively from the `parentId` self-reference:

```typescript
function renderCommentTree(parentId: number | null, depth: number) {
  return comments
    .filter(c => c.parentId === parentId)
    .map(c => (
      <div key={c.id} style={{ marginLeft: depth * 12 }}>
        <CommentItem comment={c} />
        {renderCommentTree(c.id, depth + 1)}  {/* recursion */}
      </div>
    ));
}
```

  With "Replying to @username" context above each reply and indentation that caps at depth 3 on mobile so threads stay tappable.
- A **creator badge** (amber "Author" chip with a verified icon) on the content owner's comments — the platform's own version of the blue check
- Timestamps formatted as short month/day/year + time
- Guests see a "Log in to post" panel instead of the composer

</details>

### 📤 Sharing: Native APIs First, Custom UI Second

The share button tries the **Web Share API** first — `navigator.share({ title, url })` — the native mobile share sheet, zero UI cost. Where unavailable (or on desktop), it falls back to a custom `ShareModal`:

- Backdrop blur, Escape-to-close, click-outside close
- A social grid with prebuilt share-intent URLs — **X/Twitter, LinkedIn, WhatsApp, Reddit, Telegram** — each opening a new tab with the title + URL pre-filled:

```typescript
// Example intent URL:
`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
```

- A copy-link row using the clipboard API with `document.execCommand` as a legacy fallback, complete with "Copied!" feedback
- Blog cards embed their own share button, so sharing never requires opening the article

### 🎯 Quick Quiz: Social Features

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: How does the bookmark table support two entity types?**

A1: Polymorphism — one row has `userId` plus either `blogId` OR `projectId`, never both, and one unified toggle endpoint serves both.

**Q2: What happens when the optimistic like request fails?**

A2: The UI reverts the heart and count (rollback), and shows an error toast.

**Q3: Who can delete a comment?**

A3: Three people: the comment's author, the blog's author, or the project's owner.

</details>

---

## ⚛️ Frontend Architecture: Routing, State, API Layer

### The Complete Route Map

16 pages, 15 of them **lazy-loaded** via `React.lazy()` with a shared `<Suspense fallback={<PageLoader />}>` — only the landing page is eagerly imported (it's the most-visited route, so its bundle is warm). This is code-splitting done with intent, not default:

| Path | Page | Auth | Notes |
|---|---|---|---|
| `/` | HomePage | — | Eagerly loaded; hero carousel, featured posts |
| `/blogs` | AllBlogsPage | — | Debounced search + category filters + smart pagination |
| `/post/:id` | BlogPostPage | — | Reading progress bar, likes, comments, share |
| `/create` / `/edit/:id` | CreateBlogPage | 🔒 | TipTap editor, project association |
| `/profile` | ProfilePage | 🔒 | Settings, avatar upload, blog management |
| `/library` | LibraryPage | 🔒 | My Publications + Save for Later tabs |
| `/user/:username` | UserProfilePage | — | Public profile with author's publications |
| `/projects` | ProjectsPage | — | Gallery with search + tech-tag filter chips |
| `/projects/:id` | ProjectDetailPage | — | Devlog timeline, README-rendered description, comments |
| `/projects/create` / `/projects/edit/:id` | CreateProjectPage | 🔒 | ProjectForm with GitHub README sync |
| `/categories` | CategoriesPage | — | Animated SVG category mesh |
| `/about` | AboutPage | — | Automation roadmap, analytics, AI sandbox |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, `/reset-password/:token` | Auth pages | — | Split-screen branded layouts |
| `*` | → redirect `/` | — | Catch-all |

Protected routes are wrapped in `<ProtectedRoute>`, which shows a spinner while the session loads, then renders children or redirects to `/login` — no flash of protected content, ever.

### 🔌 The API Layer: One Axios Instance, Five Typed Services

`src/api/client.ts` configures a single Axios instance with:

- `baseURL` resolved from `VITE_API_URL` / `VITE_API_BASE_URL`, falling back to `http://{hostname}:9000/api/v1` — the dev frontend automatically targets the local backend on any machine, no `.env` needed
- `withCredentials: true` — cookies are the auth mechanism
- A **response interceptor** that:
  - Unwraps `response.data` on success
  - Wraps failures in a typed `ApiError` (with `status` and `message`)
  - Distinguishes "no response from server" (network down) from real API errors
  - Dispatches a custom `auth:unauthorized` window event on 401
- **FormData-aware helpers** — register/update/upload calls switch to `multipart/form-data` automatically when the payload is a `FormData` instance

On top of that instance sit five namespaced service objects — `UserApi`, `BlogApi`, `ProjectApi`, `BookmarkApi`, `CommentApi` — **35+ typed methods**, one per backend endpoint. Pages never touch Axios directly; they consume hooks, which consume services. (Likes live inside `BlogApi`, not a separate `LikeApi` — a deliberate naming choice.)

### 🎭 State Management: Context and Hooks

The `AuthProvider` (168 lines, total) holds:

| State | Type |
|---|---|
| `user` | `User \| null` |
| `loading` | `boolean` (resolves after `GET /users/me`) |
| `bookmarkedBlogIds` | `Set<number>` |
| `bookmarkedProjectIds` | `Set<number>` |

**Lifecycle:**

1. On mount → `UserApi.getMe()`; success → also `fetchBookmarks()`; failure → `user = null`; finally → `loading = false`
2. Listens for the global `auth:unauthorized` window event (dispatched by the Axios interceptor) → clears user + both Sets — sessions expire gracefully everywhere at once
3. `login()` → authenticate → fetch profile → fetch bookmarks
4. `logout()` → API call in try/finally, always clears local state

The hooks layer (`useBlogs.ts`, 343 lines) provides:

| Hook | Returns | Purpose |
|---|---|---|
| `useAllBlogs()` | `{ blogs, loading }` | Homepage feed |
| `usePaginatedBlogs({page, limit, search?, category?})` | `{ blogs, pagination, loading }` | Explore page, category drawer (auto-refetch on param change) |
| `useBlog(id)` | `{ blog, loading, error, likesCount, isLiked, toggleLike, ... }` | Article page |
| `useCategoryCounts()` | `{ counts, loading }` | Category mesh + chips |

### 🎯 Quick Quiz: Frontend

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: How many pages are lazy-loaded, and which one isn't?**

A1: 15 of 16 are lazy-loaded. Only the landing page (`HomePage`) is eagerly imported.

**Q2: How does the app know the session expired without polling?**

A2: The Axios interceptor dispatches a custom `auth:unauthorized` window event on any 401; `AuthProvider` listens and clears user + bookmarks instantly.

**Q3: Why do bookmark buttons render instantly with the right state?**

A3: The bookmark ID `Set`s in `AuthProvider` give synchronous `isBlogBookmarked(id)` checks — no async lookup, no loading spinners on icons.

</details>

---

## 🔍 SEO Done Properly: sitemaps, JSON-LD, llms.txt and WebP

For a content platform, SEO isn't a feature — it's survival. ShowOff goes deep:

### `SeoHead.tsx`: The Meta Tag Machine

A `react-helmet-async` wrapper injecting per-page titles, descriptions, canonical URLs, Open Graph, and Twitter cards. For articles it injects **JSON-LD `BlogPosting` structured data** — the rich-result fuel for Google:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Building ShowOff — ...",
  "image": "https://www.showoff4u.in/og-image.webp",
  "datePublished": "2026-08-17",
  "author": { "@type": "Person", "name": "Sidharth", "url": "https://www.showoff4u.in/user/sidharth" },
  "publisher": { "@type": "Organization", "name": "ShowOff", "logo": { ... } }
}
```

Title handling is smart: it appends `| ShowOff4U` only when not already present, so page titles never double-suffix.

### The Static SEO Assets

| Asset | Purpose |
|---|---|
| `sitemap.xml` | `/` (daily, 1.0), `/blogs` (hourly, 0.9), `/projects` (daily, 0.8), `/about` (monthly, 0.6) |
| `robots.txt` | `Allow: /`, `Disallow: /api/`, sitemap pointer |
| `llms.txt` | **LLM-friendly index** — one-line tagline + primary links, following the Agentic Browsing spec so AI agents can find content |
| `googleb5106714b1abdf51.html` | Google Search Console verification |
| `og-image.webp` | Default Open Graph image |

### Performance-adjacent SEO

- Hero images converted to **WebP** — an **89% size reduction** over PNG
- Multi-resolution favicons (16/32/apple-touch/ICO/SVG)
- Async font loading (Geist + Inter) with `media="print" onload="this.media='all'"` + `<noscript>` fallback — no render-blocking fonts
- Material Symbols icons loaded the same non-blocking way
- `vercel.json` SPA rewrite so client-side routes never 404 on refresh

### 🎯 Quick Quiz: SEO

<details>
<summary>✅ Answer the 2 questions, then reveal</summary>

**Q1: What structured data type does SeoHead inject for articles?**

A1: JSON-LD `BlogPosting` — headline, image, dates, Person author, Organization publisher — which enables rich results.

**Q2: What is `llms.txt`?**

A2: A plain-text index of the site's most important pages, formatted per the llms.txt spec, so LLM crawlers and agentic browsers can navigate the platform.

</details>

---

## 📊 Platform Analytics and the Interactive Category Mesh

`GET /blogs/analytics` aggregates live platform insights:

| Metric | Source |
|---|---|
| Total articles | Active blog count |
| AI covers generated | Active blogs with a generated thumbnail |
| Average reading time | Mean of the same 200 WPM calc the frontend uses — badges and dashboards always agree |
| Cloudinary assets + live storage | `cloudinary.api.usage()` — real account-level metrics |
| Cleaned storage | Sum of `bytes` on `purged` media (+ a legacy fallback crediting older rows missing byte data with the platform's observed average asset size) |

The About page renders these as stat cards in `PlatformAnalytics.tsx`, alongside a **`CategoryMesh`** — an animated SVG radial node graph:

```
                 [devops]
                    |
     [databases] -- SHOWOFF -- [frontend]
                    |   CORE
     [backend]   --    |    -- [ai]
                    |
                 [general]
```

Six category nodes placed radially (60° apart) around a central "SHOWOFF Core" hub — spinning gradient icons, dashed **signal lines** with a `pulseDash` animation, per-category glow colors, hover scaling, and live blog count badges. Clicking a node opens a slide-over drawer listing up to 100 articles from that category with thumbnails, authors, and reading times — **analytics that double as navigation**.

---

## 🛡️ Security Measures: The Full Defense Matrix

| Measure | Implementation |
|---|---|
| Password hashing | Argon2 via `Bun.password.hash()` on model hooks |
| Session tokens | HS256 JWTs, 7-day expiry, in **httpOnly** cookies |
| XSS protection | Tokens unreachable from JS; TipTap sanitizes editor output |
| Reset tokens | 32-byte random, **SHA-256 hashed** before storage, 5-minute expiry |
| Brute-force protection | `authLimiter` (15 req/15 min) + `globalLimiter` (300 req/15 min) |
| SQL injection | Sequelize parameterized queries everywhere |
| File uploads | Memory-only storage, uploaded to Cloudinary (no disk writes) |
| Soft deletes | `isActive` flags on users and blogs — nothing destructive |
| Security headers | Helmet with `crossOriginResourcePolicy: "cross-origin"` for Cloudinary images |
| CORS | Origin allow-list (production domain, `*.vercel.app` previews, localhost) with `credentials: true` |
| Rate limit headers | `RateLimit-*` per IETF draft-8, so clients see remaining quota |

<details>
<summary>🖱️ Expand — Two subtle security details most people miss</summary>

**1. Helmet's cross-origin policy is a *feature* requirement.** By default, Helmet sets `Cross-Origin-Resource-Policy: same-origin`, which would **block Cloudinary images from rendering on the site** (different origin!). The config explicitly allows cross-origin so the CDN works:

```typescript
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
```

Security defaults conflict with legitimate needs — knowing *why* you're relaxing a default is the difference between a hole and a feature.

**2. The `authenticate` middleware's DB hit is a security feature.** Re-hydrating the user on every request means `isActive: false` users are locked out instantly, even with an unexpired JWT. Some apps skip this for performance; the cost of one indexed `findByPk` per request is worth the immediate revocation.

</details>

---

## 🚀 Deployment and Production Ops: The War Stories

ShowOff runs on a classic but battle-tested **free-tier stack**:

- **Frontend → Vercel**: static SPA with SPA rewrites, HTTPS, edge-cached assets
- **Backend → Render**: Bun server bound to `0.0.0.0`
- **Database → Aiven MySQL**: managed MySQL over SSL

Production presented five interesting problems worth sharing — each one a lesson that tutorials never teach:

### War Story 1: Cross-Domain Cookies

With the frontend on Vercel (`showoff4u.in`) and the API on Render (`api.showoff4u.in`), the login cookie had to survive a **cross-site request**. Localhost cookies work in an afternoon; cross-domain cookies took days:

<details>
<summary>🖱️ Expand — The full cookie puzzle</summary>

The requirements stack up quickly:

1. `SameSite=None` — required for cross-site cookie delivery (modern browsers block SameSite=Lax cookies on cross-site fetches)
2. `Secure` — *mandatory* when `SameSite=None`; browsers reject the cookie outright otherwise
3. `Domain` config — the cookie domain must cover the API host
4. `withCredentials: true` on the Axios client — otherwise cookies are never sent
5. `trust proxy` — Express must trust the Render proxy headers to see `x-forwarded-proto: https`, which the runtime detection relies on:

```typescript
secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https"
```

The fix in production: `app.set("trust proxy", 1)` (only when `NODE_ENV === "production"`), `sameSite: "none"`, `secure: true`, `COOKIE_DOMAIN` env, and `withCredentials: true` everywhere. The lesson: **understand the whole request path (proxy headers, protocol detection, domain) before shipping auth.**

</details>

### War Story 2: Cold Starts and A Sleeping Database

Free-tier Render spins down after ~15 minutes of inactivity. Worse, the Aiven MySQL free tier can also idle. The first time I hit the site after a night of sleep, everything was cold — first paint took 30+ seconds, and the DB connection pool had to re-establish.

**The defense system:**

| Defense | How |
|---|---|
| Keep-alive cron | `*/14 * * * *` — fetches `{BACKEND_URL}/api/v1/health` every 14 minutes (Render's spin-down threshold is 15) |
| DB keep-alive | Health endpoints execute `SELECT 1` against MySQL — every ping also warms the DB connection |
| Health endpoints bypass rate limiting | `/health`, `/healthz`, `/` are skipped by `globalLimiter` so monitors never get 429'd |

### War Story 3: Self-Healing Startup

A year of schema evolution left baggage: **duplicate indexes** on the `users` table (from repeated `alter: true` syncs) and **duplicate usernames** (from a pre-unique-constraint migration). Rather than hand-migrating a hobby database, `server.ts` self-heals on every boot:

```
startConnection()
├── 1. sequelize.authenticate()        Verify MySQL connection
├── 2. cleanupDuplicateIndexes()       Drop redundant index keys on users
│        └── SHOW INDEX FROM users  ->  DROP INDEX for duplicates
├── 3. deduplicateUsernames()          Rename duplicates to username_{id}
│        └── SELECT username, COUNT(*) ... HAVING count > 1
├── 4. sequelize.sync()                Create/update tables
├── 5. backfillCategories()            Auto-classify blogs with null category
├── 6. app.listen(PORT, "0.0.0.0")     Start HTTP server
└── 7. initCronJobs()                  Midnight cleanup + 14-min keep-alive
```

**Machines can fix their own state if you let them.** Every one of these steps turned a would-be migration into a non-event.

### War Story 4: Production Database SSL

The Sequelize config detects a cloud database and enables SSL automatically:

```typescript
const isCloudDb = DB_HOST.includes("aivencloud.com") || DB_SSL === "true";
// when cloud: ssl: { require: true, rejectUnauthorized: false }
```

Local development stays untouched; production gets a TLS-wrapped connection. No config toggling between environments.

### War Story 5: Vercel SPA 404s

Initially, refreshing `/blogs` returned a Vercel **404** — Vercel has no idea about client-side routes. The one-file fix:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Every path serves the SPA shell; the router takes it from there.

### 🧭 Interactive: The 60-Second Deployment Decision Tree

Picking a hosting stack was its own mini-project. Open each branch to see how the choice was made:

<details>
<summary>Branch 1 — Where does the API live?</summary>

**Answer: Render (free tier).** The backend is a single long-running Bun process — not a serverless function. It needs:
- A persistent process (`bun server.ts`) — no cold-start per request
- A public HTTPS URL for the cookie domain
- A keep-alive cron to dodge the 15-minute spin-down (solved — see War Story 2)

Vercel Functions were the alternative, but a long-lived Express app with `node-cron` doesn't fit the serverless model. **Long-running jobs → long-running server.**

</details>

<details>
<summary>Branch 2 — Where does the frontend live?</summary>

**Answer: Vercel.** The frontend is a static SPA — Vercel's specialty. Build → deploy → edge CDN, with the one-line SPA rewrite from War Story 5. Free tier HTTPS + the global CDN beats self-hosting Nginx for zero maintenance cost.

</details>

<details>
<summary>Branch 3 — Where does the database live?</summary>

**Answer: Aiven MySQL (free tier).** It needed to be:
- Managed (no `mysqld` babysitting on a hobby budget)
- SSL-capable (the config auto-detects it — War Story 4)
- Free — so the auto-SSL detection keys off `aivencloud.com` in the hostname

Alternatives considered: Railway (pricier), PlanetScale (MySQL-compatible but not identical, and the free tier went away), Supabase Postgres (would've required rewriting all dialect-specific code). **Staying on MySQL kept the Sequelize layer honest.**

</details>

<details>
<summary>Branch 4 — How do the three talk to each other?</summary>

**Answer:** CORS allow-list (`FRONTEND_URL`) + `COOKIE_DOMAIN` for the cross-site cookie, `BACKEND_URL` for the keep-alive cron, and the Vercel rewrite for deep links. Every env var in the system exists to wire exactly one of these three handshakes — no more, no less.

</details>

### 🎯 Quick Quiz: Deployment

<details>
<summary>✅ Answer the 3 questions, then reveal</summary>

**Q1: Why do health endpoints run `SELECT 1`?**

A1: To keep the managed MySQL database connection warm — the query is free, and it prevents cold-start connection delays.

**Q2: Why does `sameSite: "none"` require `secure: true`?**

A2: Browser spec — SameSite=None cookies are rejected unless they're Secure (HTTPS-only).

**Q3: What does the startup sequence do before `sequelize.sync()`?**

A3: Cleans up duplicate indexes and deduplicates usernames — self-healing from previous migrations.

</details>

---

## ⚡ Performance and Optimization

| Technique | Where | Impact |
|---|---|---|
| Route code-splitting | 15/16 pages via `React.lazy()` | Initial bundle only contains the landing page |
| WebP hero images | 8 mockups converted | **89% size reduction** over PNG |
| Debounced search | 300ms debounce on Explore | ~1 request per typing burst instead of per keystroke |
| Server-side pagination | `limit`/`page` + `totalItems` | Explore never loads more than 9 posts at once |
| Optimistic UI | Likes, bookmarks | Feels instant; network is backgrounded |
| Indexed queries | Unique indexes, `findByPk`, `count` | Like counts are single indexed lookups |
| Lazy media cleanup | Midnight cron | Cloudinary bill stays tiny |
| `SELECT 1` keep-alive | Health endpoints | No cold-start penalty on first request |
| Smart pagination UI | Max 5 page slots + ellipsis | DOM stays small even on page 300 |
| Memory-only uploads | Multer memory storage | No disk I/O; serverless-friendly |
| Async fonts | `media="print" onload` trick | No render-blocking font download |
| Prerendered SEO assets | sitemap, robots, llms.txt | Static files, zero runtime cost |

---

## 🧠 Challenges and Lessons Learned: 12 Honest Confessions

Building ShowOff taught me more than any tutorial could. Here are the honest highlights:

1. **Cookie authentication across domains is genuinely hard.** Localhost → cookie works in an afternoon; `sameSite: none` + `secure` + `COOKIE_DOMAIN` + trust-proxy took days of debugging. Understand the whole request path before shipping auth.

2. **Free-tier infrastructure forces creative engineering.** The keep-alive cron, `SELECT 1` health checks, and rate-limiter bypasses for monitors were all born from one Render cold start at the wrong moment. Resilience patterns I'd never have built on a paid stack came for free.

3. **AI pipelines need fallbacks.** The 5-tier cover pipeline exists because real-world APIs fail: rate limits, quota exhaustion, network errors. Every tier degrades gracefully — and the platform never breaks if all of them fail.

4. **Track your assets or lose them.** Without the `media` lifecycle table, Cloudinary would be full of orphans. The `pending → active → purged` state machine is a pattern I'll reuse in every media-heavy app.

5. **Keep docs current.** My README drifted behind the code (the AI pipeline got upgraded from Mistral-only to Gemini + Cloudflare Flux mid-project). Documentation is a feature — schedule time to maintain it.

6. **Small self-healing touches win.** Duplicate-index cleanup and username dedup at startup turned migrations into non-events. Machines can fix their own state if you let them.

7. **The database should enforce what it can.** The unique composite index on `blog_likes` means "one like per user" is guaranteed by MySQL — the controller is simpler because the schema is smarter.

8. **Prompt engineering is debugging the LLM's failure modes.** The pipeline bans "photography" and literal tool metaphors because those are the LLM's lazy defaults. Constrain the output, or the output constrains your quality.

9. **Optimistic UI is a contract, not a shortcut.** The like button's revert-on-failure path is as important as its optimistic path. If you can't roll back, don't update optimistically.

10. **Soft deletes are a UX feature.** Deleted blogs and accounts aren't just safe — the rename-to-`deleted_username_id` trick frees usernames while keeping constraints happy. Destructive features can still be gentle.

11. **One context provider is enough.** Global state fit on one index card: user + bookmark sets. React Context beat Redux for this app, and the codebase is cleaner for it.

12. **The boring parts are the hard parts.** CORS, cookies, SSL, cold starts, SPA rewrites — none of them are in the feature list, all of them were the actual work. Production is where tutorials end and engineering begins.

---

## 🗺️ Roadmap: What's Next

The platform is far from done. Top of the list:

- [ ] **AI-powered search** — semantic search over blog content using embeddings + a vector database (Qdrant was prototyped in early commits; the groundwork is laid)
- [ ] **Server-side comment trees** — the model supports `parentId` nesting but the API currently returns flat lists; building the tree server-side is a clean next step
- [ ] **Email notifications** — likes, comments, and follows deserve digest emails
- [ ] **Content monetization** — premium posts and subscriptions
- [ ] **More AI** — AI-powered titles, summaries, and SEO meta generation at publish time
- [ ] **Restore-from-trash UI** — the deleted-blogs endpoint exists; the UI doesn't
- [ ] **Follow system** — the join-table pattern is proven by `blog_likes`; follows are just another unique-composite-index table
- [ ] **Rich SEO** — dynamic sitemap generation for every blog and project URL

---

## 🚀 Getting Started: Run It Locally in 10 Minutes

```bash
# 1. Clone the repository
git clone https://github.com/SidharthSinghShrinet/Sequelize-BlogApp.git
cd Sequelize

# 2. Install backend dependencies
cd backend
bun install

# 3. Configure environment variables
# Create backend/.env with the values from Appendix C

# 4. Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS blog_db;"

# 5. Start the backend
bun run dev          # → http://localhost:9000

# 6. In a new terminal, start the frontend
cd ../frontend
bun install
bun run dev          # → http://localhost:3000
```

The backend creates all tables automatically on first boot via `sequelize.sync()` — no migration files to run. The startup sequence also self-heals (index cleanup, username dedup, category backfill) so even an old database boots cleanly.

### 📜 Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` (backend) | `bun --watch server.ts` | Watch-mode dev server |
| `start` (backend) | `bun run server.ts` | Production start |
| `dev` (frontend) | `bunx --bun vite` | Vite dev server (port 3000) |
| `build` (frontend) | `vite build` | Production build → `dist/` |
| `lint` (frontend) | `eslint .` | Full-project lint |
| `preview` (frontend) | `vite preview` | Preview production build |

Plus one-off seed scripts (`bun run seed:javajs`, `seed:initial100`, `enrich`, ...) that used multiple LLMs to generate the platform's initial content library.

---

## 🔧 Common Setup Problems and Fixes

<details>
<summary>❓ "bun: command not found"</summary>

Install Bun: `curl -fsSL https://bun.sh/install | bash` (or `powershell -c "irm bun.sh/install.ps1 | iex"` on Windows).

</details>

<details>
<summary>❓ "Access denied for user 'root'@'localhost'"</summary>

Your MySQL root password differs from the `.env` default. Update `DB_PASSWORD` in `backend/.env`. The project assumes `root`/`root` by default.

</details>

<details>
<summary>❓ Login works but "401 Unauthorized" on protected routes</summary>

The Axios client uses the cookie from `req.cookies` — make sure you're accessing the frontend from `http://localhost:3000` (the CORS allow-list includes localhost origins) and that cookies are enabled in the browser.

</details>

<details>
<summary>❓ Emails fail to send during password reset</summary>

Without a `RESEND_API_KEY`, the dev fallback prints the reset link to the server console. If you've set a key, check the Resend dashboard for the sender domain verification.

</details>

<details>
<summary>❓ AI covers never generate (thumbnail always SVG)</summary>

The pipeline needs at least one working tier: `GEMINI_API_KEY` + `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN` (preferred), or `POLLINATIONS_API_KEY`, or `UNSPLASH_ACCESS_KEY` / `PEXELS_API_KEY`. If all fail, the pipeline returns `null` and the SVG fallback kicks in — which is by design.

</details>

---

## 📚 Appendix A: Full API Reference (Every Endpoint)

All routes are prefixed with `/api/v1`. Auth column: 🔒 = `authenticate` required, ⚡ = optional auth, — = public.

### Users

| Method | Endpoint | Auth | Parameters | Description |
|---|---|---|---|---|
| POST | `/users/register` | — | `username`, `email`, `password`, `phoneNumber`, optional `profileImage` (file) | Register (+ rate limited to 15/15min) |
| POST | `/users/login` | — | `email`, `password` | Login, sets JWT cookie (+ rate limited) |
| GET | `/users/logout` | — | — | Clears the auth cookie |
| GET | `/users/me` | 🔒 | — | Current user's profile |
| PUT | `/users/update` | 🔒 | Any subset: `username`, `email`, `phoneNumber`, `password`, `profileImage` (file) | Update profile |
| DELETE | `/users/delete` | 🔒 | — | Soft-delete + anonymize account |
| GET | `/users/profile/:username` | — | — | Public profile (5 fields only) |
| POST | `/users/forgot-password` | — | `email` | Send reset email (+ rate limited) |
| POST | `/users/reset-password` | — | `token`, `password`, `confirmPassword` | Reset password (+ rate limited) |

<details>
<summary>🧪 Live example — `POST /users/login`</summary>

**Request:**
```json
{ "email": "sidharth@showoff4u.in", "password": "hunter2" }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "username": "sidharth",
    "email": "sidharth@showoff4u.in",
    "profileImage": null
  }
}
```
`Set-Cookie: token=...; HttpOnly; SameSite=None; Secure` rides along in the headers.

</details>

### Blogs

| Method | Endpoint | Auth | Parameters | Description |
|---|---|---|---|---|
| POST | `/blogs/upload` | 🔒 | `image` (file, multipart) | Upload to Cloudinary → pending media row |
| POST | `/blogs/create-blog` | 🔒 | `title`, `content`, optional `projectId` | Create blog (+ AI cover + category + media sync) |
| GET | `/blogs/get-all-blogs` | — | `page`, `limit`, `search`, `category`, `all`, `authorId` | List with pagination/filters |
| GET | `/blogs/get-user-blogs` | 🔒 | — | Current user's active blogs |
| GET | `/blogs/blog/:id` | ⚡ | — | Single blog + `likesCount` + `isLikedByMe` |
| PUT | `/blogs/update-blog/:id` | 🔒 | `title`, `content`, optional `projectId` | Update own blog (media reconciliation) |
| DELETE | `/blogs/delete-blog/:id` | 🔒 | — | Soft delete (author only) |
| DELETE | `/blogs/delete-all` | 🔒 | — | Soft-delete ALL user blogs |
| GET | `/blogs/deleted-blogs` | 🔒 | — | User's soft-deleted blogs |
| GET | `/blogs/analytics` | — | — | Platform analytics |
| GET | `/blogs/category-counts` | — | — | Counts per category |
| POST | `/blogs/test-ai-prompt` | — | `{ title }` | AI sandbox — run the cover pipeline |
| POST | `/blogs/:id/like` | 🔒 | — | Toggle like → `{ liked, likesCount }` |
| GET | `/blogs/:id/likes` | — | — | Like list with `likedUsers` |

<details>
<summary>🧪 Live example — `GET /blogs/get-all-blogs?page=1&limit=9&category=Sequelize`</summary>

**Response (200):**
```json
{
  "success": true,
  "message": "Blogs fetched successfully",
  "data": {
    "blogs": [
      {
        "id": 42,
        "title": "Mastering Sequelize Transactions",
        "thumbnail": "https://res.cloudinary.com/.../blog_thumbnails/abc123.jpg",
        "category": "Sequelize",
        "readingTime": 8,
        "createdAt": "2026-01-12T10:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 9, "totalItems": 87, "totalPages": 10 }
  }
}
```

</details>

### Projects

| Method | Endpoint | Auth | Parameters | Description |
|---|---|---|---|---|
| POST | `/projects` | 🔒 | Multipart: `title`, `tagline`, `description`, `techStack`, optional `githubUrl`, `liveUrl`, `thumbnail` | Create (+ AI cover if no thumbnail) |
| GET | `/projects` | — | — | All projects + `devlogsCount` |
| GET | `/projects/user` | 🔒 | — | Minimal `[{ id, title }]` for editor dropdown |
| GET | `/projects/github-readme` | 🔒 | Query: `githubUrl` | Fetch + decode GitHub README |
| GET | `/projects/:id` | — | — | Detail + owner + devlog timeline |
| PUT | `/projects/:id` | 🔒 | Multipart: same as create | Update own project |
| DELETE | `/projects/:id` | 🔒 | — | Delete own project (devlogs survive) |

### Bookmarks

| Method | Endpoint | Auth | Parameters | Description |
|---|---|---|---|---|
| POST | `/bookmarks/toggle` | 🔒 | `{ blogId }` OR `{ projectId }` | Toggle bookmark |
| GET | `/bookmarks` | 🔒 | — | All bookmarks grouped `{ blogs, projects }` |

### Comments

| Method | Endpoint | Auth | Parameters | Description |
|---|---|---|---|---|
| POST | `/comments` | 🔒 | `content`, `blogId` XOR `projectId`, optional `parentId` | Create comment (nested replies) |
| GET | `/comments/blog/:blogId` | — | — | Flat list with `authorDetails` |
| GET | `/comments/project/:projectId` | — | — | Same for projects |
| DELETE | `/comments/:id` | 🔒 | — | Delete (author / blog author / project owner) |

### Health (before rate limiter)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET / HEAD | `/`, `/healthz`, `/api/v1/health` | — | Runs `SELECT 1`, returns uptime + DB status |

---

## 📚 Appendix B: Database Schema Reference (Every Column)

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `username` | STRING(255) | NOT NULL, UNIQUE |
| `email` | STRING(255) | NOT NULL, UNIQUE, `isEmail` |
| `password` | STRING(255) | NOT NULL (argon2 hash) |
| `phoneNumber` | STRING(255) | NOT NULL, UNIQUE, len 10 |
| `isActive` | BOOLEAN | DEFAULT true |
| `profileImage` | STRING(255) | NULLABLE |
| `resetPasswordToken` | STRING(255) | NULLABLE (SHA-256 hash) |
| `resetPasswordTokenExpiry` | DATE | NULLABLE |

**Hooks:** `beforeCreate`, `beforeUpdate` — hash password when changed.

### `blogs`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `title` | STRING(255) | NOT NULL |
| `content` | TEXT | NOT NULL (HTML) |
| `thumbnail` | STRING(255) | NULLABLE |
| `author` | INTEGER | NOT NULL, FK → users.id |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, **SET NULL** on delete |
| `category` | STRING(255) | NULLABLE (auto-classified) |
| `isActive` | BOOLEAN | DEFAULT true |
| `createdAt` / `updatedAt` | DATE | DEFAULT NOW |

### `projects`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `title` | STRING(255) | NOT NULL |
| `tagline` | STRING(255) | NOT NULL |
| `description` | TEXT | NOT NULL (markdown) |
| `techStack` | STRING(255) | NOT NULL (comma-separated) |
| `githubUrl` | STRING(255) | NULLABLE |
| `liveUrl` | STRING(255) | NULLABLE |
| `thumbnail` | STRING(255) | NULLABLE |
| `ownerId` | INTEGER | NOT NULL, FK → users.id, **CASCADE** |

### `bookmarks`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `userId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NULLABLE, FK → blogs.id, CASCADE |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, CASCADE |

Rule: exactly one of `blogId` / `projectId` set.

### `media`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `publicId` | STRING | NOT NULL |
| `url` | STRING | NOT NULL |
| `status` | ENUM | DEFAULT 'pending' — `pending` / `active` / `purged` |
| `bytes` | INTEGER | NULLABLE |
| `associatedBlogId` | INTEGER | NULLABLE, FK → blogs.id, SET NULL |

### `comments`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `content` | TEXT | NOT NULL (markdown) |
| `authorId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NULLABLE, FK → blogs.id, CASCADE |
| `projectId` | INTEGER | NULLABLE, FK → projects.id, CASCADE |
| `parentId` | INTEGER | NULLABLE, self-FK → comments.id, CASCADE |

### `blog_likes`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT |
| `userId` | INTEGER | NOT NULL, FK → users.id, CASCADE |
| `blogId` | INTEGER | NOT NULL, FK → blogs.id, CASCADE |

**Unique composite index:** `(user_id, blog_id)`.

### All Associations

```
User     -- hasMany --> Blog        (as "blogs",      FK author)
User     -- hasMany --> Project     (as "projects",   FK ownerId)
User     -- hasMany --> Bookmark    (as "bookmarks",  FK userId)
User     -- hasMany --> Comment     (as "comments",   FK authorId)
User     -- hasMany --> Like        (as "likes",      FK userId)
Blog     -- hasMany --> Bookmark    (as "bookmarks",  FK blogId)
Blog     -- hasMany --> Comment     (as "comments",   FK blogId)
Blog     -- hasMany --> Like        (as "likes",      FK blogId)
Blog     -- hasMany --> Media       (as "media",      FK associatedBlogId, SET NULL)
Project  -- hasMany --> Bookmark    (as "bookmarks",  FK projectId)
Project  -- hasMany --> Comment     (as "comments",   FK projectId)
Project  -- hasMany --> Blog        (as "devlogs",    FK projectId, SET NULL)
Comment  -- hasMany --> Comment     (as "replies",    FK parentId, self)
```

---

## 📚 Appendix C: Environment Variables Reference

Create `backend/.env` with:

```env
# ─── Server ───────────────────────────────────────────────
PORT=9000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:9000
NODE_ENV=development
COOKIE_DOMAIN=              # e.g. .showoff4u.in (production cross-domain auth)

# ─── Database (MySQL) ─────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog_db
DB_SSL=false                # true → SSL required (cloud databases)

# ─── Cloudinary Image Hosting ─────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── AI Cover Pipeline ────────────────────────────────────
GEMINI_API_KEY=             # primary LLM (keyword + art direction)
CLOUDFLARE_ACCOUNT_ID=      # primary image gen (Flux-1-Schnell)
CLOUDFLARE_API_TOKEN=       # Cloudflare Workers AI token
POLLINATIONS_API_KEY=       # fallback LLM (Mistral) + Flux fallback
UNSPLASH_ACCESS_KEY=        # stock photo tier 1
PEXELS_API_KEY=             # stock photo tier 2

# ─── GitHub (README fetching, higher rate limit) ──────────
GITHUB_TOKEN=

# ─── JWT ──────────────────────────────────────────────────
JWT_SECRET=your_secure_jwt_secret

# ─── Resend Email ─────────────────────────────────────────
RESEND_API_KEY=
MAIL_FROM_EMAIL=onboarding@resend.dev
MAIL_FROM_NAME=ShowOff
```

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | ✅ | — | Backend port |
| `FRONTEND_URL` | ✅ | — | CORS + reset links |
| `BACKEND_URL` | — | — | Keep-alive cron target |
| `COOKIE_DOMAIN` | — | — | Production cookie domain |
| `DB_*` | ✅ | — | MySQL connection |
| `CLOUDINARY_*` | ✅ | — | Image hosting |
| `GEMINI_API_KEY` | — | — | Primary LLM |
| `CLOUDFLARE_*` | — | — | Primary image gen |
| `POLLINATIONS_API_KEY` | — | — | AI fallbacks |
| `UNSPLASH_ACCESS_KEY` | — | — | Stock photo tier |
| `PEXELS_API_KEY` | — | — | Stock photo tier |
| `GITHUB_TOKEN` | — | — | README fetching |
| `JWT_SECRET` | — | `default_secret_key` | JWT signing |
| `RESEND_API_KEY` | ✅ | — | Emails |
| `MAIL_FROM_*` | — | `onboarding@resend.dev` / `ShowOff` | Sender identity |

---

## 📚 Appendix D: Frontend Routes and Pages

| Path | Page | Auth | Description |
|---|---|---|---|
| `/` | HomePage | — | Hero carousel (Ant Design), featured posts, CTA |
| `/login` | LoginPage | — | Split-screen branded login |
| `/register` | RegisterPage | — | Register + password strength meter + avatar |
| `/forgot-password` | ForgotPasswordPage | — | Email form → "Email Dispatched" state |
| `/reset-password` / `/:token` | ResetPasswordPage | — | Token + new password form |
| `/blogs` | AllBlogsPage | — | Search, category filter, grid/list toggle, pagination |
| `/post/:id` | BlogPostPage | — | Reading progress, likes, comments, share, JSON-LD |
| `/create` | CreateBlogPage | 🔒 | TipTap editor + project dropdown |
| `/edit/:id` | CreateBlogPage | 🔒 | Pre-populated editor |
| `/profile` | ProfilePage | 🔒 | Settings + blog management |
| `/library` | LibraryPage | 🔒 | Publications + bookmarks tabs |
| `/user/:username` | UserProfilePage | — | Public profile + publications |
| `/about` | AboutPage | — | Manifesto, roadmap, stack, analytics, AI sandbox |
| `/categories` | CategoriesPage | — | Interactive category mesh |
| `/projects` | ProjectsPage | — | Gallery + search + tech chips |
| `/projects/:id` | ProjectDetailPage | — | Timeline + README description + comments |
| `/projects/create` | CreateProjectPage | 🔒 | ProjectForm |
| `/projects/edit/:id` | CreateProjectPage | 🔒 | Pre-populated ProjectForm |
| `*` | → `/` | — | Catch-all redirect |

---

## 📚 Appendix E: Frontend Component Library Tour

| Component | Purpose |
|---|---|
| `TopNavBar` | Sticky glass header: nav links, active-route indicator, dark mode toggle, auth-dependent actions, mobile drawer |
| `Footer` | Minimal footer with dynamic copyright year |
| `Logo` | Typographic "show**off**" wordmark |
| `ProtectedRoute` | Auth guard wrapper (spinner → redirect) |
| `BlogCard` | Blog card: grid/list layouts, category chip, excerpt, bookmark, owner actions, share |
| `ProjectCard` | Project card: thumbnail, tech badges, devlog count, bookmark, GitHub/live links |
| `ProjectForm` | Create/edit form + GitHub README sync + thumbnail preview |
| `ProjectTimeline` | Vertical alternating devlog timeline |
| `Tabs` | Reusable tab bar (line / pill variants) |
| `CategoryMesh` | Interactive SVG radial category graph |
| `CategoryBlogsList` | Slide-over drawer with up to 100 category articles |
| `CommentSection` | Markdown comment composer + nested threads + creator badges |
| `ShareModal` | Native share fallback: social intents + copy link |
| `LikedUsersModal` | "Liked by (N)" user list |
| `SeoHead` | react-helmet-async wrapper + JSON-LD injection |
| `PlatformAnalytics` | Live stat cards from the analytics API |
| `AiSandbox` | Interactive AI pipeline playground with animated console |
| `AutomationRoadmap` | 5-stage clickable pipeline explainer |
| `TechStackGrid` | Technology showcase grid |
| `AboutHero` | About page hero |

---


## 🏁 The Grand Finale: 12 Rapid-Fire Questions

You've read everything. Time for the boss fight. One `<details>` per question — open them one at a time and score yourself:

<details>
<summary>Q1 — What is the only data stored about a password-reset token in the database?</summary>

Its **SHA-256 hash** (plus an expiry). The raw token never touches the DB — a leaked database can't be replayed.

</details>

<details>
<summary>Q2 — Why does `authenticate` query the database on every request?</summary>

To guarantee `req.user` is the **current** user — deleted/deactivated accounts are locked out instantly, even with a still-valid JWT.

</details>

<details>
<summary>Q3 — Which two tables hold the platform's images?</summary>

`media` (tracked lifecycle) and... that's it. Every asset — uploads, AI covers, profile images — is registered in `media` or lives as a Cloudinary URL on the owning row.

</details>

<details>
<summary>Q4 — What runs at midnight, every night?</summary>

The **media cleanup cron** (`0 0 * * *`): deletes `pending` media older than 24h from Cloudinary and marks the rows `purged`.

</details>

<details>
<summary>Q5 — How does the platform pick a blog's category with zero user input?</summary>

**Keyword frequency** — `getCategoryForBlog` scores the title + content against 6 keyword banks and picks the highest-scoring category.

</details>

<details>
<summary>Q6 — Why does the AI pipeline try stock photos BEFORE generating an image?</summary>

Stock APIs are instant and free for popular topics; AI generation is the fallback tier for topics stock photos can't cover.

</details>

<details>
<summary>Q7 — What protects the rate-limited auth endpoints from being 429'd by uptime monitors?</summary>

Monitors only hit `/health`, `/healthz`, and `/` — which `globalLimiter` **skips**.

</details>

<details>
<summary>Q8 — What happens to a soft-deleted user's username?</summary>

It's renamed to `deleted_{username}_{id}`, freeing the original while keeping the UNIQUE constraint happy.

</details>

<details>
<summary>Q9 — Name the one request that changed the "liked by" flow from a page feature to a modal.</summary>

`GET /blogs/:id/likes` — opened on demand by the `LikedUsersModal`, so the article page never pays the cost of loading liker lists eagerly.

</details>

<details>
<summary>Q10 — Why do devlogs survive their project being deleted?</summary>

`projectId` is `ON DELETE: SET NULL` — deleting a project nulls the link instead of cascading, so a year of changelog entries is never destroyed.

</details>

<details>
<summary>Q11 — What single JSON file fixes Vercel's 404-on-refresh problem?</summary>

`vercel.json` — `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`. Every path serves the SPA shell.

</details>

<details>
<summary>Q12 — Where does the raw reset token live so the user can actually use it?</summary>

Nowhere server-side. It's only in the email link (and the user's URL bar) — the server only ever sees the hash.

</details>

**Scoring:** 9–12 correct → you could maintain this codebase. 5–8 → solid; skim the sections you missed. 0–4 → the chai is on you, and the post is worth a second read. ☕

---

## 🏁 Final Thoughts

ShowOff started as a Sequelize learning project and grew into a production platform with AI-generated cover art, a tracked media lifecycle, nested markdown comments, GitHub-integrated project showcases, and a real deployment story across Vercel, Render, and Aiven. It's the most complete full-stack project I've built — and the parts I'm proudest of aren't the features, but the systems underneath: the 5-tier fallback pipeline, the self-healing startup sequence, and the midnight cleanup cron that quietly deletes what nobody uses anymore.

If you're building something similar, steal the ideas that help:

1. **Track your media** — the `pending → active → purged` state machine pays for itself in storage and sanity
2. **Give your AI a chain of fallbacks** — resilience beats accuracy in production
3. **Let your server fix itself on boot** — self-healing turns migrations into non-events
4. **Let the database enforce the rules** — unique indexes are free correctness
5. **Keep the boring parts visible** — cookies, CORS, and cold starts are where the real engineering lives

**Live platform:** [showoff4u.in](https://www.showoff4u.in)
**Source code:** [github.com/SidharthSinghShrinet/Sequelize-BlogApp](https://github.com/SidharthSinghShrinet/Sequelize-BlogApp)

<details>
<summary>🎁 One last thing — the Easter egg</summary>

Find the typo in the backend file names. It's been there since the first commit. I know about it. I love it.

Hint: it's not `contoller` — no wait, it is `contoller`. 😄

</details>

Happy building, and happy posting — write. share. showoff. 🚀
