# Kulmis Academy

AI-enhanced Learning Management System (LMS) — Next.js, Tailwind, Sanity, PostgreSQL, NextAuth.  
**No Stripe:** Pro access is manual — students request, admin approves.

**Run all commands from this directory** (`kulmis-academy`), not from the LMS root.

## Setup

1. Copy `.env.example` to `.env` (or `.env.local`) and set:
   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — from `npx auth secret` (required for NextAuth)
   - `NEXTAUTH_ADMIN_EMAILS` — comma-separated emails that get **admin** role on sign-up (see Admin access below)
   - Optional: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` for courses

2. Database:
   ```bash
   npx prisma db push
   ```

3. Run from the `kulmis-academy` folder:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Admin access (log in as admin and see all users & Pro requests)

- **Option A — Sign up as admin:** In `.env.local` set `NEXTAUTH_ADMIN_EMAILS="your@email.com"`. Then **sign up** with that email. The account is created with role `admin`. Sign in and go to **Dashboard** → **Admin** (or open `/admin`).
- **Option B — Make an existing user admin:** Run in your database: `UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';` Then sign in and visit `/admin`.

On the **Admin** page you get: **All users** (table), **Pending Pro requests** (approve/reject), and **All Pro requests** (full history).

## Features

- **NextAuth** — Sign in / sign up; dashboard and admin protected.
- **Student:** Request Pro access (optional message). See status (Pending / Approved / Rejected).
- **Admin:** View all users and all Pro requests; approve or reject pending requests.
- **Sanity** — Course schema in `schemas/`; use `lib/sanity.ts` client when Studio is configured.
- **Design** — DESIGN.md is the source of truth; do not change color, font, or text.
