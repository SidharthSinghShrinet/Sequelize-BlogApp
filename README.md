# ShowOff — Knowledge Sharing Platform

A full-stack developer knowledge-sharing platform designed for developers, creators, teachers, and technical learning enthusiasts. Users can publish rich blog posts, showcase projects with GitHub integration, bookmark content, and leverage AI-generated cover art — all powered by modern web technologies.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Feature Documentation](#feature-documentation)
  - [User System](#1-user-system)
  - [Blog System](#2-blog-system)
  - [Project Showcase](#3-project-showcase)
  - [Bookmark System](#4-bookmark-system)
  - [Media Management & Cloudinary Integration](#5-media-management--cloudinary-integration)
  - [AI Cover Pipeline](#6-ai-cover-pipeline)
  - [Category System](#7-category-system)
  - [Dark Mode](#8-dark-mode)
  - [Platform Analytics](#9-platform-analytics)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [API Endpoints](#api-endpoints)
- [Frontend Routes & Page Components](#frontend-routes--page-components)
- [Frontend Component Library](#frontend-component-library)
- [Frontend Hooks & Utilities](#frontend-hooks--utilities)
- [Database Models & Associations](#database-models--associations)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [Error Handling Strategy](#error-handling-strategy)
- [Security Measures](#security-measures)
- [Startup Orchestration](#startup-orchestration)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)

---

## Architecture Overview

```
Sequelize/                          (monorepo root)
├── backend/                        Express + Sequelize + MySQL API
│   ├── config/                     DB connection, Cloudinary SDK, cron scheduler
│   ├── controllers/                Route handler functions (business logic)
│   ├── middleware/                  Auth guard, error handler, file upload config
│   ├── model/                      Sequelize model definitions + associations
│   ├── routes/                     Express router wiring
│   ├── utils/                      Helper modules (JWT, email, Cloudinary, AI, categories, API response)
│   ├── app.ts                      Express app factory (middleware, routes, CORS)
│   └── server.ts                   Database bootstrap, sync, startup orchestration
├── frontend/                       React 19 SPA
│   ├── src/api/                    Axios client with interceptors + typed API service objects
│   ├── src/components/             16 reusable UI components
│   ├── src/context/                React Context providers (auth state, bookmarks)
│   ├── src/hooks/                  Custom hooks (blog pagination, categories, utilities)
│   ├── src/pages/                  16 page-level route components
│   └── vite.config.ts              Vite configuration (dev server port 3000)
└── README.md
```

The backend follows a layered architecture: **Routes → Middleware → Controllers → Models → Database**. The frontend uses a **Context + Hooks** pattern for state management with Axios interceptors for cross-cutting concerns like 401 handling.

---

## Tech Stack

### Backend

| Technology                | Version  | Purpose                                      |
|---------------------------|----------|----------------------------------------------|
| **Bun**                   | 1.3+     | JavaScript runtime, package manager, test runner |
| **Express**               | 5.x      | HTTP server framework, routing, middleware    |
| **Sequelize**             | 6.x      | Object-Relational Mapping for MySQL           |
| **MySQL2**                | 3.x      | MySQL database driver                         |
| **JOSE**                  | 6.x      | JWT signing (`SignJWT`) and verification (`jwtVerify`) |
| **Cloudinary**            | 2.x      | Cloud-based image hosting SDK                 |
| **Multer**                | 2.x      | `multipart/form-data` parsing with memory storage |
| **Nodemailer**            | 9.x      | Email transport (password reset)              |
| **node-cron**             | 4.x      | Scheduled background job runner               |
| **Morgan**                | 1.x      | HTTP request logging middleware               |
| **express-async-handler** | 1.x      | Wraps async route handlers for error propagation |
| **cookie-parser**         | 1.x      | Parses `Cookie` header into `req.cookies`     |
| **cors**                  | 2.x      | Cross-Origin Resource Sharing configuration   |
| **dotenv**                | 17.x     | Loads `.env` into `process.env`               |
| **Pollinations AI**       | —        | LLM chat API (Mistral) + Flux image generation |
| **Unsplash API**          | —        | Stock photo search for AI cover fallback      |
| **Pexels API**            | —        | Stock photo search for AI cover fallback      |

### Frontend

| Technology                    | Version | Purpose                                      |
|-------------------------------|---------|----------------------------------------------|
| **React**                     | 19.x    | UI library                                   |
| **TypeScript**                | 6.x     | Static type checking                         |
| **Vite**                      | 8.x     | Build tool, HMR dev server, bundler          |
| **Tailwind CSS**              | 3.x     | Utility-first CSS framework                  |
| **@tailwindcss/forms**        | 0.5.x   | Better form input resets                     |
| **@tailwindcss/typography**   | 0.5.x   | Prose classes for rich text content          |
| **@tailwindcss/container-queries** | 0.1.x | Container query support                     |
| **TipTap (ProseMirror)**      | 3.x     | Headless rich text editor framework          |
| **@tiptap/starter-kit**       | 3.x     | Essential editor extensions                  |
| **@tiptap/extension-link**    | 3.x     | Hyperlink support in editor                  |
| **@tiptap/extension-image**   | 3.x     | Inline image embedding                       |
| **@tiptap/extension-placeholder** | 3.x | Placeholder text for empty editor            |
| **Ant Design**                | 6.x     | Carousel component for hero section          |
| **React Hook Form**           | 7.x     | Performant form state management             |
| **@hookform/resolvers**       | 5.x     | Zod integration for React Hook Form          |
| **Zod**                       | 4.x     | Schema-based form validation                 |
| **Axios**                     | 1.x     | HTTP client with interceptors                |
| **React Router DOM**          | 7.x     | Client-side routing                          |
| **react-hot-toast**           | 2.x     | Toast notification system                    |
| **marked**                    | 18.x    | Markdown-to-HTML rendering                   |
| **ESLint**                    | 10.x    | Code linting                                 |
| **PostCSS**                   | 8.x     | CSS transformation pipeline                  |
| **Autoprefixer**              | 10.x    | CSS vendor prefix injection                  |

---

## Feature Documentation

### 1. User System

#### Registration (`POST /api/v1/users/register`)
Accepts `username`, `email`, `password`, `phoneNumber` fields with optional `profileImage` file upload (multipart). Validation rules:
- All fields required
- Password length: 6–20 characters
- Username must be unique among active users
- Email must be unique among active users
- Phone number must be exactly 10 characters

On success, hashes the password using Bun's built-in `Bun.password.hash()` (argon2) and creates the user. If a file was uploaded, it is sent to Cloudinary and the secure URL is stored as `profileImage`.

#### Login (`POST /api/v1/users/login`)
Accepts `email` and `password`. Verifies credentials using `Bun.password.verify()` against the stored hash. On success, generates a JWT via JOSE's `SignJWT` with HS256 algorithm, 7-day expiration, containing the user ID. The token is set as an httpOnly, secure cookie named `token`.

#### Profile Management
- **Get Me** (`GET /api/v1/users/me`): Returns the authenticated user's profile (excluding password).
- **Update Me** (`PUT /api/v1/users/update`): Updates username, email, phone, password, and/or profile image. Checks uniqueness constraints before updating. Password re-hashing is automatic via the `beforeUpdate` Sequelize hook.
- **Delete Me** (`DELETE /api/v1/users/delete`): Soft-deletes by setting `isActive = false` and renaming the username/email to `deleted_{username}_{id}` / `deleted_{username}_{id}@deleted.com`. Clears the auth cookie.

#### Password Reset Flow
1. **Forgot Password** (`POST /api/v1/users/forgot-password`): Accepts `email`. Generates a 32-byte random token via `crypto.randomBytes()`, hashes it with SHA-256, and stores the hash + 5-minute expiry in the database. Sends an HTML email containing a reset link (pointing to `FRONTEND_URL/reset-password?token=...`) using Nodemailer. Falls back to Ethereal test accounts if no SMTP credentials are configured.
2. **Reset Password** (`POST /api/v1/users/reset-password`): Accepts `token`, `password`, `confirmPassword`. Hashes the incoming token with SHA-256, finds the matching user where the token hash matches and the expiry is still valid, then updates the password and clears the reset fields.

#### Public Profile (`GET /api/v1/users/profile/:username`)
Returns the user's `id`, `username`, `email`, `createdAt`, `profileImage` — no sensitive data exposed.

#### Frontend Auth Context (`AuthContext.tsx`)
The `AuthProvider` wraps the entire app and exposes:
- `user` — current user object or `null`
- `loading` — initial auth check in progress
- `login(data)` — authenticates, fetches profile, fetches bookmarks
- `register(data)` — creates account
- `logout()` — calls API, clears local state
- `updateUser(updatedUser)` — syncs updated profile to context
- Bookmark state and toggle functions (see [Bookmark System](#4-bookmark-system))

On initial mount, the context calls `UserApi.getMe()` to restore the session from the cookie. It also listens for a custom `auth:unauthorized` window event (dispatched by the Axios interceptor on 401 responses) to clear the user state.

---

### 2. Blog System

#### Editor (`CreateBlogPage.tsx`)
The blog editor uses **TipTap** (a headless wrapper around ProseMirror) with the following extensions:
- **StarterKit**: Bold, italic, heading (H1/H2), code blocks, bullet lists, ordered lists, blockquotes
- **Link**: Hyperlinks with custom styling
- **Image**: Inline image embedding
- **Placeholder**: "Write your content here..." placeholder text

**Toolbar buttons** provide formatting controls:
- Bold, Italic, H1, H2, Link, Web Image URL, Local Image Upload, Code Block
- Active states are tracked via `editor.isActive()` for visual feedback
- A **BubbleMenu** appears when an image is selected, offering a delete button

**Image upload flow** (local):
1. Clicking "Upload Local Image" opens a file picker (`<input type="file">`)
2. Selected file is sent as `multipart/form-data` to `POST /blogs/upload`
3. Server uploads to Cloudinary, returns `secure_url`
4. Image is inserted into the editor via `editor.chain().focus().setImage()`

**Project association**: A dropdown select lists the user's projects (fetched via `ProjectApi.getUserProjects()`). Selecting one links the blog as a devlog to that project.

**Validation** (Zod schema):
- Title: 5–100 characters
- Content: 20+ characters (HTML stripped for counting)
- projectId: optional numeric

#### Blog Creation (`POST /api/v1/blogs/create-blog`)
- Receives `title`, `content` (HTML), optional `projectId`
- Detects whether content contains inline images (`<img>` regex)
- If no inline images found, triggers the **AI Cover Pipeline** to generate a thumbnail
- Runs `getCategoryForBlog(title, content)` for auto-classification
- Creates the blog record in the database
- Calls `activateMediaForBlog(content, blogId)` to link any uploaded images from the `media` table to this blog (status → `active`)
- If an AI cover was generated, stores it in the `media` table with `status: active`

#### Blog Listing (`GET /api/v1/blogs/get-all-blogs`)
Supports pagination and filtering via query parameters:
- `page` (default: 1), `limit` (default: 9)
- `search` — text search across title and content (SQL `LIKE`)
- `category` — filter by category name (use `general` to match null/general)
- `all` — if `true`, returns all blogs without pagination
- `authorId` — filter by author

Returns either paginated results (`{ blogs, pagination: { totalItems, totalPages, currentPage, limit } }`) or the full list.

#### Blog Retrieval (`GET /api/v1/blogs/blog/:id`)
Returns a single blog with `authorDetails` (id, username, email, phone).

#### Blog Update (`PUT /api/v1/blogs/update-blog/:id`)
Only the author can update. Re-runs category detection and media sync. The `updateMediaForBlog()` function:
1. Extracts all image URLs from the new content
2. Finds all media previously linked to this blog
3. Frees (sets `status: pending`, `associatedBlogId: null`) any media whose URL is no longer in the content
4. Activates any new images found in the content

#### Blog Deletion (`DELETE /api/v1/blogs/delete-blog/:id`)
- Sets `isActive = false` (soft delete)
- Marks all associated media as `pending` with unset `associatedBlogId` — the nightly cron job will purge them from Cloudinary

#### Batch Delete (`DELETE /api/v1/blogs/delete-all`)
Soft-deletes all active blogs for the authenticated user and frees their media.

#### Image Upload (`POST /api/v1/blogs/upload`)
Accepts a single image file (multipart, field name `image`), uploads to Cloudinary's `blog_images` folder, creates a `media` record with `status: pending`, and returns the Cloudinary result (including `secure_url`).

#### Deleted Blog Management (`GET /api/v1/blogs/deleted-blogs`)
Returns the authenticated user's soft-deleted blogs for potential restoration.

#### AI Prompt Testing (`POST /api/v1/blogs/test-ai-prompt`)
Accepts `{ title }` and runs just the AI cover generation pipeline without creating a blog. Useful for the **AI Sandbox** frontend feature.

#### Frontend Blog Card (`BlogCard.tsx`)
A reusable component that renders a blog post in either **grid** or **list** layout:
- Displays thumbnail (via `getBlogImageUrl()` — prefers blog thumbnail, falls back to first `<img>` in content, then generates an SVG)
- Shows category tag, author avatar/name, date, title, text excerpt (150 chars)
- **Bookmark button** for authenticated users (filled/outlined icon based on state)
- Owner-specific **Edit** and **Delete** action buttons
- Clicking the author navigates to their profile (or library if it's the current user)

#### Frontend Hooks
- `useAllBlogs()` — fetches all blogs on mount (for homepage)
- `usePaginatedBlogs({ page, limit, search, category })` — paginated fetching with auto-refetch on parameter change
- `useBlog(id)` — fetches a single blog by ID
- `useCategoryCounts()` — fetches blog counts per category
- `getBlogImageUrl(content, title, id, thumbnail?)` — image resolution cascade
- `calculateReadingTime(htmlContent)` — estimates reading time at 200 WPM, minimum 1 minute
- `generateSvgThumbnail(title, content)` — generates a beautiful inline SVG thumbnail with gradient backgrounds and wrapped text as a data URI fallback

---

### 3. Project Showcase

#### Project CRUD
Projects have: `title`, `tagline`, `description`, `techStack` (comma-separated), `githubUrl`, `liveUrl`, `thumbnail`. All operations validate ownership.

- **Create** (`POST /api/v1/projects`): Accepts multipart with optional `thumbnail` file. If no file is provided, runs the AI Cover Pipeline for a generated thumbnail. Tracks AI-generated covers in the `media` table.
- **Read** (`GET /api/v1/projects`): Lists all projects with owner details and devlog count. Returns `devlogsCount` computed from linked blog count.
- **Read Single** (`GET /api/v1/projects/:id`): Returns the project with owner details and all associated devlog blogs (with their authors), ordered chronologically.
- **Update** (`PUT /api/v1/projects/:id`): Only owner can update. Supports thumbnail replacement.
- **Delete** (`DELETE /api/v1/projects/:id`): Only owner can delete.
- **User Projects** (`GET /api/v1/projects/user`): Returns minimal project list (id, title) for the blog editor's dropdown association.

#### GitHub README Sync
`GET /api/v1/projects/github-readme?githubUrl=https://github.com/owner/repo`:
1. Parses the URL to extract `owner` and `repo`
2. Calls `https://api.github.com/repos/{owner}/{repo}/readme` with optional `GITHUB_TOKEN` auth header
3. Decodes the base64-encoded README content
4. Returns the raw markdown text

On the frontend, the **ProjectForm** component provides a "Sync README" button that calls this endpoint and populates the description textarea with the fetched content.

#### Frontend Project Card (`ProjectCard.tsx`)
Displays a project with:
- Thumbnail banner (or gradient placeholder with terminal icon)
- Bookmark toggle button
- Devlog count badge with animated dot
- Owner avatar and name
- Title and tagline
- Tech stack badges with color-coded styling (React → blue, Node/Bun → green, Sequelize → teal, AWS → amber, AI → rose)
- GitHub and live URL quick-action icons
- "Explore Devlogs" link to the project detail page

#### Frontend Project Timeline (`ProjectTimeline.tsx`)
Renders a vertical chronological timeline of devlog blog posts associated with a project. Each entry shows the blog title, author, date, and a link to read the full post.

#### Frontend Project Form (`ProjectForm.tsx`)
A controlled form component with:
- Title, tagline, tech stack, GitHub URL, live URL, description fields
- Client-side validation (required fields, URL format, length limits)
- File upload with preview thumbnail
- GitHub README sync button with loading state
- Used by both Create and Edit project pages

---

### 4. Bookmark System

#### Data Model
The `bookmarks` table stores a polymorphic relationship: each bookmark has a `userId` plus either a `blogId` or `projectId` (never both). This allows a single unified toggle endpoint.

#### Toggle (`POST /api/v1/bookmarks/toggle`)
Accepts `{ blogId }` or `{ projectId }`. Checks existence of the target entity. If a bookmark exists, deletes it (returns `{ bookmarked: false }`). If not, creates it (returns `{ bookmarked: true }`).

#### Fetch (`GET /api/v1/bookmarks`)
Returns all bookmarks for the authenticated user, grouped as `{ blogs: [...], projects: [...] }` with full entity details including author/owner information.

#### Frontend Integration
- **AuthContext** maintains `bookmarkedBlogIds` and `bookmarkedProjectIds` as `Set<number>`
- Bookmark state is fetched on login and refreshed via `refreshBookmarks()`
- `isBlogBookmarked(id)` / `isProjectBookmarked(id)` — synchronous checks
- `toggleBlogBookmark(id)` / `toggleProjectBookmark(id)` — optimistic toggle with toast feedback
- BlogCard and ProjectCard render bookmark buttons conditionally for authenticated users
- **Library page** (`/library`) displays all bookmarked blogs and projects in separate sections

---

### 5. Media Management & Cloudinary Integration

#### Media Lifecycle
Every image uploaded to ShowOff is tracked in the `media` table with a three-state status:

```
[Upload] → status: "pending"
              ↓ (blog created/updated with this image URL)
           status: "active"
              ↓ (blog soft-deleted or image removed from content)
           status: "pending"
              ↓ (cron job runs at midnight, image older than 24h)
           status: "purged" (Cloudinary deletion)
```

#### Upload Flow
1. Frontend sends image file to `POST /blogs/upload`
2. Backend `multer` middleware stores buffer in `req.file.buffer`
3. `uploadStream()` utility uploads to Cloudinary's `blog_images` folder
4. A `media` record is created with `status: "pending"`
5. The Cloudinary `secure_url` is returned to the frontend
6. When the blog is saved (create/update), `activateMediaForBlog()` finds all images in the content HTML and updates their media records to `status: "active"` with `associatedBlogId` set

#### Cleanup Cron Job (`config/cron.ts`)
Runs daily at midnight (`0 0 * * *`):
1. Queries for all media with `status: "pending"` and `createdAt` older than 24 hours
2. For each orphaned asset, calls `cloudinary.uploader.destroy(publicId)` to delete from Cloudinary
3. Updates the media record to `status: "purged"` and clears `associatedBlogId`

#### Cloudinary Configuration (`config/cloudinary.ts`)
Initialized with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from environment variables.

#### Utility Functions (`utils/cloudinary.utils.ts`)
- `uploadBufferToCloudinary(buffer, folder, mimeType?)`: Converts buffer to base64 data URI and uploads
- `uploadStream(req)`: Extracts buffer from Express request and delegates to `uploadBufferToCloudinary`

---

### 6. AI Cover Pipeline

The AI cover image system (`utils/ai.utils.ts`) is a multi-stage pipeline that generates blog/project cover art automatically when no user-uploaded thumbnail exists.

#### Pipeline Stages

```
Blog Title
    ↓
Stage 1: Extract Search Keyword (Mistral LLM)
    ↓
Stage 2: Try Unsplash Stock Photo Search
    ↓ (if no result)
Stage 3: Try Pexels Stock Photo Search
    ↓ (if no result)
Stage 4: Fallback to AI Generation (Mistral + Flux)
    ↓ (if any buffer obtained)
Stage 5: Upload to Cloudinary
    ↓
Return { url, publicId, bytes }
```

#### Stage 1 — Keyword Extraction
Sends a prompt to Mistral (`mistral-small-3.2` via Pollinations API): *"Extract the single most important programming language, technology, or core topic name from this blog title... Output ONLY the term."* Returns a clean 1–2 word search keyword.

#### Stage 2 — Unsplash
Calls `https://api.unsplash.com/search/photos?query={keyword}&per_page=1` with the `UNSPLASH_ACCESS_KEY`. If a photo is found, fetches and returns the image buffer.

#### Stage 3 — Pexels
Calls `https://api.pexels.com/v1/search?query={keyword}&per_page=1` with the `PEXELS_API_KEY`. If a photo is found, fetches and returns the image buffer.

#### Stage 4 — AI Generation
1. Sends an **art direction prompt** to Mistral: *"Design a beautiful, high-quality visual concept for an article cover representing this specific topic... Describe only visual objects, colors, and art style."*
2. Mistral returns a descriptive text brief
3. The brief is passed as a prompt to **Flux** via `https://image.pollinations.ai/prompt/{brief}?width=800&height=450&model=flux`
4. Flux returns the generated image buffer

#### Stage 5 — Cloudinary Upload
The final buffer (from any source) is uploaded to Cloudinary via `uploadBufferToCloudinary()` and the result (`{ url, publicId, bytes }`) is returned.

---

### 7. Category System

Blogs are auto-categorized using keyword frequency analysis on both the title and content.

#### Categories & Keywords

| Category   | Keywords (matched case-insensitively)                                                                 |
|------------|-------------------------------------------------------------------------------------------------------|
| frontend   | react, vue, angular, svelte, css, html, tailwind, flexbox, grid, frontend, ui, ux, components, responsive, dom, browser, javascript, typescript, hooks, state, usestate, useeffect |
| backend    | node, bun, express, koa, nest, api, backend, rest, graphql, router, controller, middleware, auth, jwt, session, token, server, http, websocket |
| databases  | sequelize, mysql, postgres, postgresql, sqlite, mongodb, redis, nosql, sql, query, orm, migration, database, db, schema, transaction, indexing |
| devops     | cloudinary, cron, docker, kubernetes, aws, gcp, azure, deploy, deployment, ci/cd, github actions, upload, purged, cleanup, automation, pipeline |
| ai         | ai, llm, mistral, pollinations, flux, prompt, image generation, cover art, artwork, gpt, openai, diffusion, generative, brief, artist |
| general    | catch-all (default when no category reaches the highest match count)                                  |

#### Algorithm (`getCategoryForBlog`)
1. Combine `title + content`, convert to lowercase
2. Iterate over each category's keyword list
3. Count how many keywords appear in the combined text
4. The category with the highest match count wins
5. If no category has any matches (or `general` ties), defaults to `general`

The same logic exists on both **backend** (`utils/category.utils.ts`) and **frontend** (`hooks/useBlogs.ts`) for consistency.

#### Startup Backfill (`server.ts` `backfillCategories()`)
On server start, any blog with `category: null` is automatically classified using `getCategoryForBlog()`.

---

### 8. Dark Mode

Dark mode is implemented using Tailwind's `dark:` variant with class-based toggling.

- **Toggle**: A button in the `TopNavBar` switches the `dark` class on `document.documentElement`
- **Persistence**: The preference is saved to `localStorage` under the key `"theme"`
- **Initial state**: Checks `localStorage` first, then falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
- **Styling**: All components use Tailwind's `dark:` prefix variants (e.g., `dark:bg-slate-900`, `dark:text-white`)
- **Transitions**: CSS `transition-colors duration-300` on the body and key containers

---

### 9. Platform Analytics

Two read-only endpoints provide platform-level insights:

- `GET /api/v1/blogs/analytics` — Returns overall platform analytics (currently blog count by category)
- `GET /api/v1/blogs/category-counts` — Returns a `Record<categoryName, count>` for all 6 categories

Frontend components (`PlatformAnalytics.tsx`, `CategoryMesh.tsx`) render this data as interactive visualizations.

---

## Backend Architecture

### Application Entry Points

#### `app.ts` — Express App Factory
- Loads environment variables via `dotenv`
- Configures middleware stack: `cors()` (origin: `http://localhost:3000`, credentials: true), `morgan('dev')`, `cookie-parser`, `express.urlencoded`, `express.json`
- Mounts four route groups under `/api/v1`: `/users`, `/blogs`, `/projects`, `/bookmarks`
- Imports `./model/associations.ts` to register Sequelize relationships
- Registers the global error handler middleware last

#### `server.ts` — Bootstrap & Startup
Handles the complete startup sequence (see [Startup Orchestration](#startup-orchestration)).

### Routes (`routes/`)
Each route file defines an Express `Router`, attaches middleware (`authenticate` where required, `upload` for multipart endpoints), and maps HTTP methods + paths to controller functions.

### Controllers (`controllers/`)
Each controller function is wrapped with `express-async-handler` to automatically forward thrown errors to the Express error middleware. Controllers:
- Extract data from `req.body`, `req.params`, `req.query`, `req.file`, `req.user`
- Validate inputs (throw `ErrorHandler` with appropriate status codes)
- Interact with models via Sequelize
- Use the `ApiResponse` utility to send consistent JSON responses

### Models (`model/`)
Five Sequelize models with their fields, types, validations, and hooks:
- **User**: `beforeCreate` and `beforeUpdate` hooks hash the password via `Bun.password.hash()`
- **Blog**: Standard fields with `isActive` for soft delete
- **Project**: Fields for showcase metadata
- **Bookmark**: Polymorphic relationship (blogId OR projectId)
- **Media**: Status lifecycle tracking

### Associations (`model/associations.ts`)
Defines all relationships between models (see [Database Models & Associations](#database-models--associations)).

---

## Frontend Architecture

### Application Entry

`index.html` → `src/main.tsx` → `src/App.tsx`

The `App` component wraps everything in `AuthProvider` (for global auth state) and `BrowserRouter` (for client-side routing). `react-hot-toast`'s `Toaster` is rendered at the top level.

### Routing

All routes are defined in `App.tsx` using React Router DOM v7's `<Routes>` and `<Route>` components. Protected routes (create, edit, profile, library) are wrapped with the `<ProtectedRoute>` component which redirects to `/login` if no user is authenticated.

### State Management

**AuthContext** (`context/AuthContext.tsx`) is the primary state container, holding:
- Current user object
- Bookmark sets (blog IDs and project IDs)
- Auth methods (login, register, logout, updateUser)
- Bookmark methods (toggle, check, refresh)

No additional state management library is used — React Context + useState/useEffect is sufficient for this application's complexity.

### API Layer (`api/client.ts`)

An Axios instance configured with:
- `baseURL: 'http://localhost:9000/api/v1'`
- `withCredentials: true` (sends cookies)
- Default `Content-Type: application/json`

**Response interceptor**: Unwraps `response.data` for success, throws `ApiError` for failures, and dispatches `auth:unauthorized` event on 401 responses.

**API service objects** (`UserApi`, `BlogApi`, `ProjectApi`, `BookmarkApi`) are namespaced collections of methods, each mapping to a backend endpoint.

---

## API Endpoints

All routes are prefixed with `/api/v1`.

### Authentication & Users

| Method | Endpoint                  | Auth Required | Parameters                          | Description                              |
|--------|---------------------------|---------------|--------------------------------------|------------------------------------------|
| POST   | `/users/register`         | No            | `username`, `email`, `password`, `phoneNumber`, optional `profileImage` (file) | Create new user account |
| POST   | `/users/login`            | No            | `email`, `password`                  | Authenticate, set JWT cookie             |
| GET    | `/users/logout`           | No            | —                                    | Clear auth cookie                        |
| GET    | `/users/me`               | Yes           | —                                    | Get authenticated user's profile         |
| PUT    | `/users/update`           | Yes           | Optional fields + optional `profileImage` (file) | Update profile               |
| DELETE | `/users/delete`           | Yes           | —                                    | Soft-delete account                      |
| GET    | `/users/profile/:username`| No            | —                                    | Get public user profile                  |
| POST   | `/users/forgot-password`  | No            | `email`                              | Send password reset email                |
| POST   | `/users/reset-password`   | No            | `token`, `password`, `confirmPassword` | Reset password with valid token        |

### Blogs

| Method | Endpoint                       | Auth Required | Parameters / Body                     | Description                              |
|--------|--------------------------------|---------------|---------------------------------------|------------------------------------------|
| POST   | `/blogs/create-blog`           | Yes           | `title`, `content`, optional `projectId` | Create new blog                      |
| GET    | `/blogs/get-all-blogs`         | No            | Query: `page`, `limit`, `search`, `category`, `all`, `authorId` | List blogs with pagination |
| GET    | `/blogs/get-user-blogs`        | Yes           | —                                     | Get current user's blogs                 |
| GET    | `/blogs/blog/:id`              | No            | —                                     | Get single blog by ID                    |
| PUT    | `/blogs/update-blog/:id`       | Yes           | `title`, `content`, optional `projectId` | Update blog (author only)            |
| DELETE | `/blogs/delete-blog/:id`       | Yes           | —                                     | Soft-delete blog (author only)           |
| DELETE | `/blogs/delete-all`            | Yes           | —                                     | Soft-delete all user blogs               |
| POST   | `/blogs/upload`                | Yes           | `image` (file, multipart)             | Upload image to Cloudinary               |
| GET    | `/blogs/deleted-blogs`         | Yes           | —                                     | Get user's soft-deleted blogs            |
| GET    | `/blogs/analytics`             | No            | —                                     | Platform analytics data                  |
| GET    | `/blogs/category-counts`       | No            | —                                     | Blog counts per category                 |
| POST   | `/blogs/test-ai-prompt`        | No            | `{ title }`                           | Test AI cover generation pipeline        |

### Projects

| Method | Endpoint                      | Auth Required | Parameters / Body                     | Description                              |
|--------|-------------------------------|---------------|---------------------------------------|------------------------------------------|
| POST   | `/projects`                   | Yes           | Multipart: `title`, `tagline`, `description`, `techStack`, optional `githubUrl`, `liveUrl`, `thumbnail` (file) | Create project |
| GET    | `/projects`                   | No            | —                                     | List all projects with devlog counts     |
| GET    | `/projects/user`              | Yes           | —                                     | Get current user's projects (minimal)    |
| GET    | `/projects/:id`               | No            | —                                     | Get project detail with devlogs timeline |
| PUT    | `/projects/:id`               | Yes           | Multipart: same as create             | Update project (owner only)              |
| DELETE | `/projects/:id`               | Yes           | —                                     | Delete project (owner only)              |
| GET    | `/projects/github-readme`     | Yes           | Query: `githubUrl`                    | Fetch and decode README from GitHub      |

### Bookmarks

| Method | Endpoint                 | Auth Required | Body                                | Description                              |
|--------|--------------------------|---------------|--------------------------------------|------------------------------------------|
| POST   | `/bookmarks/toggle`      | Yes           | `{ blogId }` OR `{ projectId }`      | Toggle bookmark on/off                   |
| GET    | `/bookmarks`             | Yes           | —                                    | Get all bookmarked items                 |

---

## Frontend Routes & Page Components

| Path                   | Page Component        | Auth Required | Layout Components    | Description                                                                 |
|------------------------|-----------------------|---------------|----------------------|-----------------------------------------------------------------------------|
| `/`                    | HomePage              | No            | TopNavBar, Footer    | Landing page with hero carousel (Ant Design), featured posts grid, CTA      |
| `/login`               | LoginPage             | No            | TopNavBar, Footer    | Email/password login form, link to register/forgot-password                 |
| `/register`            | RegisterPage          | No            | TopNavBar, Footer    | Registration form with all required fields, optional avatar upload          |
| `/forgot-password`     | ForgotPasswordPage    | No            | TopNavBar, Footer    | Email input form, sends reset link                                          |
| `/reset-password`      | ResetPasswordPage     | No            | TopNavBar, Footer    | Token + new password + confirm form                                         |
| `/blogs`               | AllBlogsPage          | No            | TopNavBar, Footer    | Paginated blog grid with search bar, category filter, grid/list layout toggle |
| `/post/:id`            | BlogPostPage          | No            | TopNavBar, Footer    | Full blog article with HTML rendering (`marked`), author info, reading time |
| `/create`              | CreateBlogPage        | Yes           | TopNavBar, Footer    | TipTap rich text editor, project dropdown, form validation                  |
| `/edit/:id`            | CreateBlogPage        | Yes           | TopNavBar, Footer    | Same as create but pre-populated with existing blog data                    |
| `/profile`             | ProfilePage           | Yes           | TopNavBar, Footer    | User settings (edit profile, change password/avatar), blog management list  |
| `/library`             | LibraryPage           | Yes           | TopNavBar, Footer    | Bookmarked blogs and projects in separate card grids                        |
| `/user/:username`      | UserProfilePage       | No            | TopNavBar, Footer    | Public profile showing user's blogs, bio info                               |
| `/about`               | AboutPage             | No            | TopNavBar, Footer    | Platform description, tech stack showcase, automation roadmap               |
| `/categories`          | CategoriesPage        | No            | TopNavBar, Footer    | Interactive category mesh visualization with keyword display and blog counts |
| `/projects`            | ProjectsPage          | No            | TopNavBar, Footer    | Project gallery grid with cards, create button                              |
| `/projects/:id`        | ProjectDetailPage     | No            | TopNavBar, Footer    | Project detail with devlog timeline, GitHub/live links, edit/delete controls |
| `/projects/create`     | CreateProjectPage     | Yes           | TopNavBar, Footer    | ProjectForm with GitHub README sync, AI cover fallback                      |
| `/projects/edit/:id`   | CreateProjectPage     | Yes           | TopNavBar, Footer    | ProjectForm pre-populated for editing                                       |

---

## Frontend Component Library

### `TopNavBar.tsx`
Sticky header with:
- Logo component linking to `/`
- Nav links: Home, Explore, Project Hub, About, Library (auth-only)
- Active route indicator (colored bar animation via NavLink)
- Search icon (UI placeholder), dark mode toggle button
- Auth-dependent right side: user avatar + dropdown **or** Login/Signup buttons
- "Create Blog" CTA button for authenticated users
- Glass-morphism backdrop blur effect

### `Footer.tsx`
Simple footer with "Built with ShowOff" branding.

### `Logo.tsx`
Renders the "ShowOff" text logo with gradient styling and optional font size prop.

### `ProtectedRoute.tsx`
A wrapper component that checks `useAuth().user`. If no user, redirects to `/login`. Otherwise renders children.

### `BlogCard.tsx`
Props: `{ post, isOwnerCard?, onDelete?, layout?: 'grid' | 'list' }`
- **Grid layout**: Vertical card with image, category tag, bookmark button, author info, title, excerpt
- **List layout**: Horizontal card with smaller thumbnail, same content, better for dense views
- Owner mode: shows Edit/Delete action buttons
- Author click navigates to public profile or library

### `ProjectCard.tsx`
Props: `{ project }`
- Thumbnail banner with gradient placeholder fallback
- Bookmark button, devlog count badge with pulse animation
- Color-coded tech stack badges based on keyword matching
- Quick-action icons for GitHub and live URL
- "Explore Devlogs" link

### `ProjectForm.tsx`
Props: `{ initialValues?, onSubmit, isSubmitting, buttonText }`
- Controlled form with all project fields
- Client-side validation (required checks, URL pattern)
- Thumbnail file upload with preview
- GitHub README sync button with loading spinner
- Used by both create and edit project pages

### `ProjectTimeline.tsx`
Props: `{ devlogs }`
- Renders a vertical timeline with alternating left/right layout
- Each entry shows blog title, author initial + name, date
- Links to the full blog post

### `Tabs.tsx`
Props: `{ tabs: { key, label, content }[], defaultActiveKey? }`
- Simple tab switching component for toggling between content views

### `CategoryMesh.tsx`
Interactive 3D-like grid of category cards. Each card shows:
- Category icon (Material Symbols), name, description
- Blog count with color-coded background gradient
- Click navigates to `/blogs?category={id}`
- Imports and uses `CATEGORIES` array from `useBlogs`

### `CategoryBlogsList.tsx`
Props: `{ category, blogs }`
- Displays a section header with category icon and name
- Renders a horizontal scrollable row of BlogCards for the given category
- "View All" link to filtered blog listing

### `AboutHero.tsx`
Simple hero section for the About page with an illustration and tagline.

### `AutomationRoadmap.tsx`
Visual roadmap/stepper showing the automation pipeline stages (keyword extraction → Unsplash → Pexels → AI generation → Cloudinary upload).

### `TechStackGrid.tsx`
A grid display of all technologies used in the platform, with icons and labels.

### `PlatformAnalytics.tsx`
Data visualization dashboard showing:
- Category distribution (blog counts per category)
- Platform statistics overview
- Fetches data from `BlogApi.getAnalytics()`

### `AiSandbox.tsx`
An interactive sandbox where users can:
- Enter a blog title
- Click "Generate Cover" to test the AI cover pipeline
- See the generated image preview and details

---

## Frontend Hooks & Utilities

All defined in `hooks/useBlogs.ts`.

### Data Fetching Hooks

| Hook                        | Return                      | Description                                    |
|-----------------------------|-----------------------------|------------------------------------------------|
| `useAllBlogs()`             | `{ blogs, loading }`        | Fetch all active blogs on mount                |
| `usePaginatedBlogs(options)`| `{ blogs, pagination, loading }` | Fetch blogs with page/limit/search/category |
| `useBlog(id)`               | `{ blog, loading, error }`  | Fetch single blog by ID                        |
| `useCategoryCounts()`       | `{ counts, loading }`       | Fetch blog counts per category                 |

### Utility Functions

| Function                            | Purpose                                                                 |
|-------------------------------------|-------------------------------------------------------------------------|
| `generateSvgThumbnail(title, content)` | Creates an inline SVG data URI with gradient background, wrapped title, and summary excerpt |
| `getBlogImageUrl(content, title, id, thumbnail?)` | Image resolution cascade: thumbnail → first `<img>` in content → SVG generation |
| `calculateReadingTime(htmlContent)` | Strips HTML, counts words, divides by 200 WPM, returns minutes (min 1) |
| `getCategoryForBlog(title, content)` | Keyword frequency analysis (mirrors backend logic)                      |

### Category Constants

The `CATEGORIES` array exports metadata for each category: `id`, `name`, `description`, `icon` (Material Symbols name), `color` (Tailwind gradient), and `keywords` array.

---

## Database Models & Associations

### Users (`users`)

| Column                    | Type         | Constraints / Notes                                                |
|---------------------------|--------------|--------------------------------------------------------------------|
| `id`                      | INTEGER      | PRIMARY KEY, AUTO_INCREMENT                                        |
| `username`                | STRING(255)  | NOT NULL, UNIQUE                                                   |
| `email`                   | STRING(255)  | NOT NULL, UNIQUE, `validate: { isEmail: true }`                    |
| `password`                | STRING(255)  | NOT NULL (hashed via `Bun.password.hash()` on beforeCreate/beforeUpdate) |
| `phoneNumber`             | STRING(255)  | NOT NULL, UNIQUE, `validate: { len: [10, 10] }`                    |
| `isActive`                | BOOLEAN      | DEFAULT true (soft-delete flag)                                    |
| `profileImage`            | STRING(255)  | NULLABLE (Cloudinary URL)                                          |
| `resetPasswordToken`      | STRING(255)  | NULLABLE (SHA-256 hash of reset token)                             |
| `resetPasswordTokenExpiry`| DATE         | NULLABLE (5-minute expiry window)                                  |

**Hooks**: `beforeCreate` and `beforeUpdate` check if `password` was changed, then hash via `Bun.password.hash()`.

### Blogs (`blogs`)

| Column      | Type         | Constraints / Notes                                                |
|-------------|--------------|--------------------------------------------------------------------|
| `id`        | INTEGER      | PRIMARY KEY, AUTO_INCREMENT                                        |
| `title`     | STRING(255)  | NOT NULL                                                          |
| `content`   | TEXT         | NOT NULL (HTML from TipTap editor)                                |
| `thumbnail` | STRING(255)  | NULLABLE (AI-generated or uploaded URL)                            |
| `author`    | INTEGER      | NOT NULL, FOREIGN KEY → users.id                                   |
| `projectId` | INTEGER      | NULLABLE, FOREIGN KEY → projects.id (SET NULL on delete)           |
| `category`  | STRING(255)  | NULLABLE (auto-classified)                                        |
| `isActive`  | BOOLEAN      | DEFAULT true (soft-delete flag)                                   |
| `createdAt` | DATE         | NOT NULL, DEFAULT NOW                                             |
| `updatedAt` | DATE         | NOT NULL, DEFAULT NOW                                             |

### Projects (`projects`)

| Column      | Type         | Constraints / Notes                                                |
|-------------|--------------|--------------------------------------------------------------------|
| `id`        | INTEGER      | PRIMARY KEY, AUTO_INCREMENT                                        |
| `title`     | STRING(255)  | NOT NULL                                                          |
| `tagline`   | STRING(255)  | NOT NULL                                                          |
| `description`| TEXT        | NOT NULL                                                          |
| `techStack` | STRING(255)  | NOT NULL (comma-separated tags)                                   |
| `githubUrl` | STRING(255)  | NULLABLE                                                          |
| `liveUrl`   | STRING(255)  | NULLABLE                                                          |
| `thumbnail` | STRING(255)  | NULLABLE                                                          |
| `ownerId`   | INTEGER      | NOT NULL, FOREIGN KEY → users.id (CASCADE on delete)               |

### Bookmarks (`bookmarks`)

| Column      | Type    | Constraints / Notes                                                |
|-------------|---------|--------------------------------------------------------------------|
| `id`        | INTEGER | PRIMARY KEY, AUTO_INCREMENT                                        |
| `userId`    | INTEGER | NOT NULL, FOREIGN KEY → users.id (CASCADE)                         |
| `blogId`    | INTEGER | NULLABLE, FOREIGN KEY → blogs.id (CASCADE)                         |
| `projectId` | INTEGER | NULLABLE, FOREIGN KEY → projects.id (CASCADE)                      |

One of `blogId` or `projectId` must be set; never both.

### Media (`media`)

| Column             | Type    | Constraints / Notes                                                |
|--------------------|---------|--------------------------------------------------------------------|
| `id`               | INTEGER | PRIMARY KEY, AUTO_INCREMENT                                        |
| `publicId`         | STRING  | NOT NULL (Cloudinary public ID)                                   |
| `url`              | STRING  | NOT NULL (Cloudinary secure URL)                                  |
| `status`           | ENUM    | NOT NULL, DEFAULT 'pending' (values: pending, active, purged)      |
| `bytes`            | INTEGER | NULLABLE (file size in bytes)                                     |
| `associatedBlogId` | INTEGER | NULLABLE, FOREIGN KEY → blogs.id (SET NULL on delete)              |

### Entity Relationships (Associations)

```
User (1) ──────────── hasMany ──────────→ Blog (as "blogs", FK: author)
User (1) ──────────── hasMany ──────────→ Project (as "projects", FK: ownerId)
User (1) ──────────── hasMany ──────────→ Bookmark (as "bookmarks", FK: userId)
Blog (1) ──────────── hasMany ──────────→ Bookmark (as "bookmarks", FK: blogId)
Project (1) ───────── hasMany ──────────→ Bookmark (as "bookmarks", FK: projectId)
Project (1) ───────── hasMany ──────────→ Blog (as "devlogs", FK: projectId, ON DELETE: SET NULL)
Blog (1) ───────────── hasMany ──────────→ Media (as "media", FK: associatedBlogId, ON DELETE: SET NULL)

Blog ─── belongsTo ───→ User (as "authorDetails", FK: author)
Project ─── belongsTo ───→ User (as "ownerDetails", FK: ownerId)
Bookmark ─── belongsTo ───→ User (as "user", FK: userId)
Bookmark ─── belongsTo ───→ Blog (as "blog", FK: blogId)
Bookmark ─── belongsTo ───→ Project (as "project", FK: projectId)
Blog ─── belongsTo ───→ Project (as "projectDetails", FK: projectId)
```

---

## Middleware

### `auth.middleware.ts` — Authentication Guard
1. Extracts the JWT from `req.cookies.token` (or parses the `Cookie` header directly)
2. Verifies the token using JOSE's `jwtVerify()` with HS256 and the JWT secret
3. Extracts the `userId` from the decoded payload
4. Fetches the user from the database via `users.findByPk(userId)`
5. Attaches the Sequelize model instance to `req.user` for downstream controllers
6. Throws `ErrorHandler(401)` or `ErrorHandler(404)` on failure

**Type augmentation**: Extends the Express `Request` interface with an optional `user?: Model` property.

### `error.middleware.ts` — Global Error Handler
- Logs the full error object to console
- Handles `SequelizeValidationError` → 400 with a user-friendly message about field constraints
- Handles `SequelizeUniqueConstraintError` → 400 with the specific error message
- For all other errors: responds with `err.statusCode` (or 500) and `err.message` (or "Internal Server Error")
- Returns JSON: `{ success: false, message, errorObj }`

### `multer.middleware.ts` — File Upload Configuration
Configures Multer with memory storage (files stored as `Buffer` in `req.file.buffer`, no disk writes). Used on all multipart endpoints (user avatar, blog images, project thumbnails).

---

## Utilities

| File                          | Export(s)                                       | Purpose                                                        |
|-------------------------------|-------------------------------------------------|----------------------------------------------------------------|
| `utils/ai.utils.ts`           | `generateSmartBlogCover(blogTitle)`             | Multi-stage AI cover pipeline (keyword extraction → stock photos → AI generation → Cloudinary) |
| `utils/ApiResponse.utils.ts`  | `class ApiResponse`                             | Standardized response builder: `{ success, message, data?, meta? }` with `.send(res)` method |
| `utils/category.utils.ts`     | `CATEGORY_KEYWORDS`, `getCategoryForBlog()`     | Keyword-based auto-categorization for blog content             |
| `utils/cloudinary.utils.ts`   | `uploadBufferToCloudinary()`, `uploadStream()`  | Cloudinary image upload helpers (buffer → base64 → upload)     |
| `utils/email.utils.ts`        | `sendResetPasswordEmail(email, resetUrl)`       | Sends HTML password reset email via Nodemailer (Ethereal fallback) |
| `utils/errorHandler.utils.ts` | `class ErrorHandler`                            | Custom error class with `message` and `statusCode` fields       |
| `utils/jwt.utils.ts`          | `generateToken(id)`                             | Creates HS256 JWT with 7-day expiry containing user ID          |

### `ApiResponse` Usage Pattern
```typescript
new ApiResponse(200, true, "Success message", data).send(res);
// → { success: true, message: "Success message", data: { ... } }
```

### `ErrorHandler` Usage Pattern
```typescript
throw new ErrorHandler("Not found", 404);
// → Caught by error middleware, responds with status 404
```

---

## Error Handling Strategy

The application uses a unified error handling approach:

1. **Controllers** are wrapped with `express-async-handler`, which catches any thrown error and passes it to `next(err)`
2. **Business logic errors** use the custom `ErrorHandler` class: `throw new ErrorHandler("message", statusCode)`
3. **Sequelize errors** (validation, unique constraint) are caught by the global error middleware and formatted into user-friendly messages
4. **The Axios interceptor** on the frontend catches all HTTP errors, wraps them in `ApiError` (with `status` and `message`), and dispatches a custom `auth:unauthorized` event on 401 responses
5. **Frontend components** display errors via `react-hot-toast` notifications

---

## Security Measures

| Measure                    | Implementation                                                   |
|----------------------------|------------------------------------------------------------------|
| Password hashing           | `Bun.password.hash()` (argon2) on beforeCreate/beforeUpdate hook |
| JWT authentication         | HS256-signed tokens with 7-day expiry, stored in httpOnly cookies|
| HTTP-only cookies          | `res.cookie("token", token, { httpOnly: true, secure: true })`   |
| CORS restriction           | Only `http://localhost:3000` allowed (credentials: true)         |
| Input validation           | Backend: manual checks + Sequelize validations; Frontend: Zod schemas |
| XSS protection             | No raw HTML rendering (TipTap sanitizes), cookie not accessible via JS |
| Password reset tokens      | 32-byte random token, SHA-256 hashed before database storage, 5-min expiry |
| Soft delete                | `isActive` flag prevents access to deleted resources             |
| SQL injection protection   | Sequelize parameterized queries (`replacements`)                 |
| File upload               | Memory storage only (no disk writes), validated as image type    |

---

## Startup Orchestration

The complete startup sequence in `server.ts`:

```
startConnection()
├── 1. sequelize.authenticate()          Verify MySQL connection
├── 2. cleanupDuplicateIndexes()         Remove redundant index keys on users table
│   └── SHOW INDEX FROM users
│   └── DROP INDEX for duplicate email/username/phone indexes
├── 3. deduplicateUsernames()            Fix duplicate usernames from previous migrations
│   └── SELECT username, COUNT(*) ... HAVING count > 1
│   └── UPDATE users SET username = username_{id} for duplicates
├── 4. sequelize.sync()                  Create/update tables (comment/uncomment { alter: true } as needed)
├── 5. backfillCategories()              Auto-classify blogs with null category
│   └── blogs.findAll({ where: { category: null } })
│   └── For each: getCategoryForBlog(title, content) → blog.update({ category })
├── 6. app.listen(PORT)                  Start HTTP server
└── 7. initCronJobs()                    Schedule daily midnight cleanup cron
    └── cron.schedule("0 0 * * *", ...)  Clean orphaned pending media > 24h old
```

---

## Environment Variables

Create `backend/.env` with the following variables:

```env
# ─── Server ───────────────────────────────────────────────
PORT=9000
FRONTEND_URL=http://localhost:3000

# ─── Database (MySQL) ─────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog_db

# ─── Cloudinary Image Hosting ─────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── AI Cover Pipeline ────────────────────────────────────
PEXELS_API_KEY=your_pexels_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
POLLINATIONS_API_KEY=your_pollinations_api_key

# ─── GitHub API (for README fetching, higher rate limit) ──
GITHUB_TOKEN=your_github_pat_token

# ─── JWT Secret (optional, defaults to "default_secret_key")
JWT_SECRET=your_secure_jwt_secret

# ─── SMTP (optional, falls back to Ethereal test accounts) ─
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Variable Descriptions

| Variable                  | Required | Default            | Description                                              |
|---------------------------|----------|--------------------|----------------------------------------------------------|
| `PORT`                    | Yes      | —                  | Backend HTTP server port                                 |
| `FRONTEND_URL`            | Yes      | —                  | Frontend origin (for CORS and password reset links)      |
| `DB_HOST`                 | Yes      | —                  | MySQL host                                               |
| `DB_PORT`                 | Yes      | —                  | MySQL port                                               |
| `DB_USER`                 | Yes      | —                  | MySQL username                                           |
| `DB_PASSWORD`             | Yes      | —                  | MySQL password                                           |
| `DB_NAME`                 | Yes      | —                  | MySQL database name                                      |
| `CLOUDINARY_CLOUD_NAME`   | Yes      | —                  | Cloudinary cloud name                                    |
| `CLOUDINARY_API_KEY`      | Yes      | —                  | Cloudinary API key                                       |
| `CLOUDINARY_API_SECRET`   | Yes      | —                  | Cloudinary API secret                                    |
| `PEXELS_API_KEY`          | No       | —                  | Pexels API key (stock photo fallback)                    |
| `UNSPLASH_ACCESS_KEY`     | No       | —                  | Unsplash API key (stock photo fallback)                  |
| `POLLINATIONS_API_KEY`    | No       | —                  | Pollinations AI API key (Mistral + Flux)                 |
| `GITHUB_TOKEN`            | No       | —                  | GitHub personal access token (for README fetching)       |
| `JWT_SECRET`              | No       | `default_secret_key` | Secret key for JWT signing                              |
| `SMTP_HOST`               | No       | Ethereal test      | SMTP server hostname                                     |
| `SMTP_PORT`               | No       | Ethereal test      | SMTP server port                                         |
| `SMTP_USER`               | No       | Ethereal test      | SMTP username                                            |
| `SMTP_PASS`               | No       | Ethereal test      | SMTP password                                            |

---

## Getting Started

### Prerequisites

- **Bun** (v1.3+): [Install Bun](https://bun.sh/docs/installation)
- **MySQL** (8.0+): Running on `localhost:3306` (or configure connection via `.env`)

### Setup Instructions

```bash
# 1. Clone the repository
git clone <repository-url>
cd Sequelize

# 2. Install backend dependencies
cd backend
bun install

# 3. Configure environment variables
# Create backend/.env with the values from the table above

# 4. Create the MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS blog_db;"

# 5. Start the backend server
bun run dev
# Server starts on http://localhost:9000

# 6. In a new terminal, install frontend dependencies
cd ../frontend
bun install

# 7. Start the frontend dev server
bun run dev
# Opens http://localhost:3000
```

The backend will automatically create the database tables on first startup via `sequelize.sync()`. The startup script also handles index cleanup, username deduplication, and category backfill.

---

## Available Scripts

### Backend (`backend/`)

| Script    | Command                   | Description                            |
|-----------|---------------------------|----------------------------------------|
| `dev`     | `bun --watch server.ts`   | Development server with file watching  |
| `start`   | `bun run server.ts`       | Production start (no watch)            |

### Frontend (`frontend/`)

| Script      | Command                   | Description                            |
|-------------|---------------------------|----------------------------------------|
| `dev`       | `bunx --bun vite`         | Development server on port 3000 with HMR|
| `build`     | `bunx --bun vite build`   | Production build to `dist/` directory   |
| `lint`      | `eslint .`                | Run ESLint across the project           |
| `preview`   | `vite preview`            | Preview the production build locally    |

---

## Project Structure

### Backend (`backend/`)

```
backend/
├── config/
│   ├── cloudinary.ts          Cloudinary SDK configuration
│   ├── cron.ts                Scheduled job definitions (orphan media cleanup)
│   └── db.ts                  Sequelize MySQL connection setup
├── controllers/
│   ├── blog.contoller.ts      Blog CRUD, image upload, analytics, AI test
│   ├── bookmark.controller.ts Bookmark toggle and retrieval
│   ├── project.controller.ts  Project CRUD, GitHub README fetch, user projects
│   └── user.contoller.ts      Register, login, logout, profile, password reset
├── middleware/
│   ├── auth.middleware.ts     JWT verification, user hydration to req.user
│   ├── error.middleware.ts    Global error handler (Sequelize + custom errors)
│   └── multer.middleware.ts   Multer memory storage configuration
├── model/
│   ├── associations.ts        All model relationship definitions
│   ├── blog.model.ts          Blog model (title, content, thumbnail, category, etc.)
│   ├── bookmark.model.ts      Bookmark model (polymorphic: blog or project)
│   ├── media.model.ts         Media tracking model (Cloudinary asset lifecycle)
│   ├── project.model.ts       Project showcase model
│   └── user.model.ts          User model (with password hashing hooks)
├── routes/
│   ├── blog.routes.ts         Blog endpoint routing
│   ├── bookmark.routes.ts     Bookmark endpoint routing
│   ├── project.routes.ts      Project endpoint routing
│   └── user.routes.ts         User endpoint routing
├── utils/
│   ├── ai.utils.ts            AI cover generation pipeline (Mistral, Unsplash, Pexels, Flux)
│   ├── ApiResponse.utils.ts   Standardized API response class
│   ├── category.utils.ts      Keyword-based blog categorization
│   ├── cloudinary.utils.ts    Cloudinary upload helpers (buffer and stream)
│   ├── email.utils.ts         Nodemailer password reset email sending
│   ├── errorHandler.utils.ts  Custom HTTP error class
│   └── jwt.utils.ts           JWT token generation (JOSE SignJWT)
├── app.ts                     Express app setup and configuration
├── server.ts                  Bootstrap orchestration and server start
├── .env                       Environment variables (not committed)
├── .gitignore
├── package.json
└── tsconfig.json
```

### Frontend (`frontend/`)

```
frontend/
├── public/                    Static assets (hero mockups, logo, favicon, icons)
├── src/
│   ├── api/
│   │   └── client.ts          Axios instance, ApiError class, typed API services
│   ├── assets/                Static images (react.svg, vite.svg, hero.png)
│   ├── components/
│   │   ├── AboutHero.tsx              About page hero section
│   │   ├── AiSandbox.tsx             Interactive AI cover generation test sandbox
│   │   ├── AutomationRoadmap.tsx      Visual automation pipeline stepper
│   │   ├── BlogCard.tsx               Blog post card (grid/list layouts, bookmark, owner actions)
│   │   ├── CategoryBlogsList.tsx      Horizontal scrollable blog list by category
│   │   ├── CategoryMesh.tsx           Interactive category grid with icons and counts
│   │   ├── Footer.tsx                 Site footer
│   │   ├── Logo.tsx                   ShowOff brand logo text
│   │   ├── PlatformAnalytics.tsx      Category distribution analytics dashboard
│   │   ├── ProjectCard.tsx            Project showcase card (badges, bookmark, links)
│   │   ├── ProjectForm.tsx            Controlled project creation/editing form
│   │   ├── ProjectTimeline.tsx        Devlog blog timeline for a project
│   │   ├── ProtectedRoute.tsx         Auth guard wrapper for protected pages
│   │   ├── Tabs.tsx                   Simple tab switching component
│   │   ├── TechStackGrid.tsx          Technologies used grid display
│   │   └── TopNavBar.tsx              Sticky header with nav, auth, dark mode
│   ├── context/
│   │   └── AuthContext.tsx     Auth state provider (user, bookmarks, auth methods)
│   ├── hooks/
│   │   └── useBlogs.ts        Data hooks (useAllBlogs, usePaginatedBlogs, useBlog, useCategoryCounts), utilities (SVG generation, image URL resolution, reading time, category constants)
│   ├── pages/
│   │   ├── AboutPage.tsx              Platform information page
│   │   ├── AllBlogsPage.tsx           Paginated blog listing with search/filter
│   │   ├── BlogPostPage.tsx           Full blog article view
│   │   ├── CategoriesPage.tsx         Category explorer with mesh visualization
│   │   ├── CreateBlogPage.tsx         Blog editor (TipTap) with form validation
│   │   ├── CreateProjectPage.tsx      Project create/edit form wrapper
│   │   ├── ForgotPasswordPage.tsx     Password reset request form
│   │   ├── HomePage.tsx               Landing page with hero carousel and featured blogs
│   │   ├── LibraryPage.tsx            User's bookmarked items
│   │   ├── LoginPage.tsx              Login form
│   │   ├── ProfilePage.tsx            User profile settings and blog management
│   │   ├── ProjectDetailPage.tsx      Project detail with devlog timeline
│   │   ├── ProjectsPage.tsx           Project showcase gallery
│   │   ├── RegisterPage.tsx           Registration form
│   │   ├── ResetPasswordPage.tsx      Password reset form with token
│   │   └── UserProfilePage.tsx        Public user profile
│   ├── App.tsx                 Root component with routing
│   ├── App.css                 Legacy CSS (limited usage)
│   ├── index.css               Tailwind directives, custom component classes, TipTap/scrollbar styles
│   └── main.tsx                ReactDOM entry point
├── index.html                  HTML entry point with Google Fonts
├── vite.config.ts              Vite configuration (React plugin, port 3000)
├── tailwind.config.js          Tailwind theme (colors, spacing, fonts, plugins)
├── postcss.config.js           PostCSS pipeline (Tailwind + Autoprefixer)
├── eslint.config.js            ESLint flat config
├── tsconfig.json               Root TypeScript config (references)
├── tsconfig.app.json           TypeScript config for app source
├── tsconfig.node.json          TypeScript config for Vite/Node files
├── package.json
└── .gitignore
```

---

## License

This project is private and for educational/portfolio purposes.
