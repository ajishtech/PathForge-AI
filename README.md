# PathForge AI

PathForge AI is an AI-powered career mentor built with Next.js, Auth.js, Prisma, PostgreSQL (Supabase), Tailwind CSS, and OpenAI-compatible AI workflows. It helps users upload resumes, analyze skills, generate career roadmaps, find courses, prepare for interviews, track progress, create daily goals, generate portfolio content, analyze GitHub profiles, and chat with a career assistant.

## macOS Setup

### 1. Install prerequisites

Install Node.js 20 or newer. The easiest macOS option is Homebrew:

```bash
brew install node
```

### 2. Open the project

```bash
cd "pathforge-ai"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create or update `.env` in the project root:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

OPENAI_API_KEY=""
```

Get your database URLs from: **Supabase Dashboard → Project Settings → Database → Connection string**.

### 5. Set up the database

```bash
npm run db:push
npm run db:generate
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Build for production

```bash
npm run build
npm run start
```

## Useful Commands

```bash
npm run dev        # Start local development server
npm run build      # Generate Prisma client and build Next.js
npm run start      # Start production server after build
npm run lint       # Run ESLint
npm run db:push    # Push Prisma schema to database
npm run db:generate # Generate Prisma client
```

## Deploying to Vercel (Free Tier)

### Prerequisites

- A [Supabase](https://supabase.com) account (free tier) with a project created
- A [Vercel](https://vercel.com) account (free tier)
- Your code pushed to a GitHub repository

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push origin main
```

### Step 2: Push database schema to Supabase

Run this locally to create all the tables in your Supabase database:

```bash
npx prisma db push
```

Make sure your `.env` has the correct `DATABASE_URL` and `DIRECT_URL` from Supabase.

### Step 3: Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no framework config needed

### Step 4: Set environment variables on Vercel

In your Vercel project settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase **pooled** connection string |
| `DIRECT_URL` | Your Supabase **direct** connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Your Vercel URL (e.g. `https://pathforge-ai.vercel.app`) |
| `OPENAI_API_KEY` | Your OpenAI key (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret (optional) |
| `GITHUB_CLIENT_ID` | GitHub OAuth ID (optional) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret (optional) |

### Step 5: Deploy

Click **Deploy** — Vercel will run `npm run build` (which triggers `prisma generate && next build`).

### Step 6: Update OAuth callbacks (if using OAuth)

Update your Google/GitHub OAuth apps to use the Vercel callback URLs:

```text
https://your-app.vercel.app/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/github
```

## Optional OAuth Setup

To enable Google or GitHub login, create OAuth apps in their developer consoles and set:

```bash
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

Use this local callback URL for development:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

## Troubleshooting

If Prisma errors after changing the schema, run:

```bash
npm run db:push
npm run db:generate
```

If port 3000 is already in use, start Next.js on another port:

```bash
npm run dev -- -p 3001
```
