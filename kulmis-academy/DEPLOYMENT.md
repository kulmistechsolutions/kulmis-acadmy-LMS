# Kulmis Academy — Deployment Guide

Step-by-step requirements and guidelines to deploy the LMS to production.

---

## Table of contents

1. [Pre-deployment checklist](#1-pre-deployment-checklist)
2. [Environment variables](#2-environment-variables)
3. [Database (PostgreSQL)](#3-database-postgresql)
4. [Auth (NextAuth)](#4-auth-nextauth)
5. [Sanity CMS](#5-sanity-cms)
6. [Deploy to Vercel (recommended)](#6-deploy-to-vercel-recommended)
7. [Deploy to other platforms](#7-deploy-to-other-platforms)
8. [Post-deploy verification](#8-post-deploy-verification)
9. [Custom domain & SSL](#9-custom-domain--ssl)

---

## 1. Pre-deployment checklist

Before deploying, ensure:

| Step | Action |
|------|--------|
| ✅ | App builds locally: `npm run build` (no TypeScript or build errors) |
| ✅ | You have a **PostgreSQL** database URL for production |
| ✅ | You have **Sanity** project ID and dataset (or will create them) |
| ✅ | You generated **AUTH_SECRET** for NextAuth (see below) |
| ✅ | Code is in a **Git** repo (GitHub, GitLab, or Bitbucket) for Vercel/Railway |

---

## 2. Environment variables

All variables your app uses in production. Set these in your hosting provider’s dashboard (e.g. Vercel → Project → Settings → Environment Variables).

### Required

| Variable | Description | Example (production) |
|----------|-------------|----------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/dbname?sslmode=require` |
| `AUTH_SECRET` | Secret for NextAuth JWT/session signing | Generate with `npx auth secret` (see below) |
| `NEXTAUTH_ADMIN_EMAILS` | Comma-separated emails that get admin role | `admin@yourdomain.com` |

### Recommended for production

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL of your app (certificates, links) | `https://yourdomain.com` |
| `AUTH_TRUST_HOST` | Set to `true` when behind a proxy (e.g. Vercel) | `true` |

### Optional (Sanity)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | From sanity.io dashboard |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | `production` |

### Generate AUTH_SECRET

Run locally (one time):

```bash
npx auth secret
```

Copy the output and set it as `AUTH_SECRET` in your production environment. **Never commit this value to Git.**

---

## 3. Database (PostgreSQL)

### Option A: Vercel Postgres (if you deploy on Vercel)

1. In Vercel: Project → **Storage** → **Create Database** → **Postgres**.
2. Connect it to your project; Vercel will add `POSTGRES_URL` (or similar).
3. Use that URL as `DATABASE_URL`. If the variable is named differently (e.g. `POSTGRES_PRISMA_URL`), set **Environment Variables** so your app has:
   - `DATABASE_URL` = that connection string (Prisma expects this name).

### Option B: External PostgreSQL (Neon, Supabase, Railway, etc.)

1. Create a PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)).
2. Copy the **connection string** (often with `?sslmode=require` for cloud DBs).
3. Set `DATABASE_URL` in your hosting provider to this value.

### Run migrations in production

After `DATABASE_URL` is set (and before or right after first deploy):

**From your machine (with production `DATABASE_URL` in `.env`):**

```bash
cd kulmis-academy
# Set DATABASE_URL to production URL in .env, then:
npx prisma migrate deploy
```

**Or from Vercel (Build command):**  
Add to your build step so migrations run on deploy:

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

(Alternatively, run `prisma migrate deploy` in a one-off job or CI step; avoid running it from multiple instances at once.)

---

## 4. Auth (NextAuth)

- **AUTH_SECRET** — Must be set in production (see [Environment variables](#2-environment-variables)).
- **AUTH_TRUST_HOST** — Set to `true` when deployed behind Vercel or another proxy.
- **AUTH_URL** — Optional. NextAuth can infer the URL from the request. If you use a custom domain, you can set:
  - `AUTH_URL=https://yourdomain.com`
- Your app already uses `trustHost: true` in `auth.ts`, which is correct for Vercel.

No code changes are required for deployment if env vars are set.

---

## 5. Sanity CMS

- Ensure **NEXT_PUBLIC_SANITY_PROJECT_ID** and **NEXT_PUBLIC_SANITY_DATASET** are set in production so the app can load courses.
- In Sanity dashboard, add your production domain (e.g. `https://yourdomain.com`) to **CORS origins** if you use Sanity’s client from the browser.
- Course images are served from `cdn.sanity.io`; `next.config.ts` already allows this via `images.remotePatterns`.

---

## 6. Deploy to Vercel (recommended)

### Step 1: Push code to Git

```bash
cd c:\Users\hp\Desktop\LMS\kulmis-academy
git init
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

(Use your actual repo URL and branch name.)

### Step 2: Create Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project**.
3. Import your Git repository.
4. **Root Directory:** if the app is in a subfolder (e.g. `kulmis-academy`), set it to `kulmis-academy`. Otherwise leave blank.
5. **Framework Preset:** Next.js (auto-detected).
6. **Build Command:** `npx prisma generate && next build`  
   (or include `npx prisma migrate deploy` if you want migrations on deploy; see [Database](#3-database-postgresql)).
7. **Output Directory:** leave default.
8. **Install Command:** `npm install`

### Step 3: Set environment variables in Vercel

In the project: **Settings** → **Environment Variables**. Add:

| Name | Value | Environments |
|------|--------|----------------|
| `DATABASE_URL` | Your production PostgreSQL URL | Production, Preview (optional) |
| `AUTH_SECRET` | Output of `npx auth secret` | Production, Preview |
| `AUTH_TRUST_HOST` | `true` | Production, Preview |
| `NEXTAUTH_ADMIN_EMAILS` | Your admin email(s) | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` (or custom domain) | Production, Preview |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Production, Preview |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview |

Then **Save**.

### Step 4: Deploy

- Click **Deploy** (or push to the connected branch; Vercel will auto-deploy).
- Wait for the build to finish. If the build fails, check the logs (often missing env var or Prisma/migration issue).

### Step 5: Run migrations (if not in build)

If you did **not** add `prisma migrate deploy` to the build command:

```bash
# Locally, with DATABASE_URL pointing to production DB:
npx prisma migrate deploy
```

### Step 6: Create first admin user

The app uses credentials (email + password). You need at least one user in the database:

1. **Option A — Registration:**  
   Go to `https://your-app.vercel.app/sign-up` and register with the email you set in `NEXTAUTH_ADMIN_EMAILS`. That email will get the admin role (if your code assigns role by this list on sign-up).

2. **Option B — Database:**  
   If your code does not auto-set admin from `NEXTAUTH_ADMIN_EMAILS` on sign-up, run a one-time update (e.g. with Prisma Studio or SQL):
   - Prisma Studio: `npx prisma studio` (with production `DATABASE_URL`), open User, set `role` to `admin` for that email.

---

## 7. Deploy to other platforms

### Railway / Render / similar (Node server)

1. **Build:** `npm install && npx prisma generate && next build`
2. **Start:** `npm start` (runs `next start`)
3. Set all [environment variables](#2-environment-variables) in the platform’s dashboard.
4. Run migrations once: `npx prisma migrate deploy` (via one-off command or CLI).
5. Ensure the app listens on the port the platform provides (e.g. `PORT`); Next.js uses `PORT` by default.

### Docker (self-hosted)

Example minimal Dockerfile (place in `kulmis-academy/`):

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

Run migrations separately or in an entrypoint script. Set env vars via `-e` or a `.env` file when running the container.

---

## 8. Post-deploy verification

After the first successful deploy:

| Check | How |
|-------|-----|
| Homepage loads | Open `https://your-domain` |
| Sign up | `/sign-up` — create an account |
| Sign in | `/sign-in` — log in |
| Dashboard | `/dashboard` — only when logged in |
| Admin | Log in with an admin email and open `/admin` |
| Courses | Ensure Sanity env vars are set; courses load from Sanity |
| Certificate | Complete a course (if applicable) and open certificate/verify URL |
| Theme | Use theme switcher; confirm light/dark/system and persistence |

If anything fails, check:

- Build logs (missing env, Prisma generate/migrate).
- Runtime logs (database connection, AUTH_SECRET).
- Browser console and network tab (wrong `NEXT_PUBLIC_APP_URL`, CORS, or auth redirects).

---

## 9. Custom domain & SSL

### Vercel

1. **Settings** → **Domains** → add your domain (e.g. `academy.yourdomain.com`).
2. Follow Vercel’s DNS instructions (CNAME or A record).
3. SSL is automatic (Let’s Encrypt).
4. Set **NEXT_PUBLIC_APP_URL** (and optionally **AUTH_URL**) to `https://academy.yourdomain.com`.

### Other hosts

- Use the host’s “Add domain” and SSL (e.g. Let’s Encrypt) so the app is served over HTTPS.
- Set **NEXT_PUBLIC_APP_URL** and **AUTH_URL** to the final production URL.

---

## Quick reference

### Minimum production env vars

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_TRUST_HOST="true"
NEXTAUTH_ADMIN_EMAILS="admin@example.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_SANITY_PROJECT_ID="..."
NEXT_PUBLIC_SANITY_DATASET="production"
```

### Useful commands

```bash
# Generate auth secret
npx auth secret

# Prisma: generate client (in build)
npx prisma generate

# Prisma: run migrations (once per deployment / DB change)
npx prisma migrate deploy

# Local production build test
npm run build && npm run start
```

---

If you tell me your target (e.g. “Vercel only” or “Railway”), I can narrow this to a minimal step list for that platform.
