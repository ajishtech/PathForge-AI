# 🚀 Deploying PathForge AI — Vercel + Supabase (Free Tier)

This guide walks you through deploying PathForge AI for **$0/month** using:

- **Vercel** (Free Hobby Plan) — hosts the Next.js app
- **Supabase** (Free Plan) — hosts the PostgreSQL database

---

## Prerequisites

- A **GitHub** account (to host your code)
- **Node.js 20+** installed locally
- **Git** installed locally

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign up with GitHub
3. Click **"New Project"**
   - **Name**: `pathforge-ai`
   - **Database Password**: Choose a strong password (save it — you'll need it)
   - **Region**: Pick the closest to your users
4. Wait ~2 minutes for the project to be provisioned

### Get Your Connection Strings

1. Go to **Project Settings** (gear icon in sidebar) → **Database**
2. Scroll to **Connection string** section
3. Select the **URI** tab

You need **two** connection strings:

| Type | Where to find | Port | Used for |
|------|--------------|------|----------|
| **Pooled (Transaction)** | Connection string → URI (default) | `6543` | Runtime app connections |
| **Direct** | Toggle "Display connection pooler" OFF, or find "Direct connection" | `5432` | Prisma migrations |

They look like this:

```
# Pooled (DATABASE_URL) — port 6543
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct (DIRECT_URL) — port 5432
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> ⚠️ Replace `[YOUR-PASSWORD]` with the database password you set when creating the project.

---

## Step 2: Configure Local Environment

Create/update your `.env` file in the project root:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# AI (optional)
OPENAI_API_KEY=""
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## Step 3: Push Database Schema to Supabase

This creates all the tables in your Supabase database:

```bash
npm install
npx prisma db push
```

You should see output like:

```
Your database is now in sync with your Prisma schema.
```

### Verify Tables Were Created

Go to **Supabase Dashboard → Table Editor**. You should see these tables:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Resume`
- `UserSkill`
- `RoadmapStep`
- `UserCourse`
- `DailyGoal`
- `Achievement`
- `StudyLog`
- `ChatMessage`
- `InterviewSession`

---

## Step 4: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:

- [ ] Landing page loads
- [ ] Registration works (creates user in Supabase)
- [ ] Login works
- [ ] Dashboard loads after login

---

## Step 5: Push Code to GitHub

If you don't have a GitHub repo yet:

```bash
# Initialize git (skip if already done)
git init
git branch -M main

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pathforge-ai.git
```

Push your code:

```bash
git add .
git commit -m "Prepare for Vercel + Supabase deployment"
git push -u origin main
```

> ⚠️ Make sure `.env` is in your `.gitignore` (it already is). **Never commit secrets to GitHub.**

---

## Step 6: Deploy to Vercel

### 6a. Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** → Sign up with GitHub

### 6b. Import Project

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import"** next to your `pathforge-ai` repository
3. Vercel auto-detects it's a Next.js project — no config needed

### 6c. Set Environment Variables

Before clicking Deploy, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase **pooled** connection string (port 6543) |
| `DIRECT_URL` | Your Supabase **direct** connection string (port 5432) |
| `AUTH_SECRET` | Output of `openssl rand -base64 32` |
| `AUTH_URL` | Leave blank for now (update after first deploy) |
| `OPENAI_API_KEY` | Your OpenAI key (optional) |
| `GOOGLE_CLIENT_ID` | Google OAuth ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret (optional) |
| `GITHUB_CLIENT_ID` | GitHub OAuth ID (optional) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret (optional) |

### 6d. Deploy

Click **"Deploy"** and wait ~2 minutes.

Vercel will run:

```
npm install → prisma generate → next build
```

### 6e. Update AUTH_URL

After deployment, Vercel gives you a URL like `https://pathforge-ai.vercel.app`.

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Set `AUTH_URL` to your Vercel URL: `https://pathforge-ai.vercel.app`
3. Click **Redeploy** (Deployments tab → three dots → Redeploy)

---

## Step 7: Update OAuth Callbacks (If Using OAuth)

If you're using Google or GitHub login, update the callback URLs in their developer consoles:

### Google OAuth

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
   ```
   https://pathforge-ai.vercel.app/api/auth/callback/google
   ```

### GitHub OAuth

1. Go to [GitHub → Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth App
3. Set **Authorization callback URL**:
   ```
   https://pathforge-ai.vercel.app/api/auth/callback/github
   ```

---

## ✅ Verification Checklist

After deployment, verify these work on your Vercel URL:

- [ ] Landing page loads
- [ ] User registration
- [ ] User login (credentials)
- [ ] Google/GitHub OAuth login (if configured)
- [ ] Dashboard loads
- [ ] Resume upload & analysis
- [ ] Career roadmap generation
- [ ] Course recommendations
- [ ] Interview practice
- [ ] Chat with AI assistant
- [ ] Progress tracking
- [ ] Daily goals

---

## Free Tier Limits

### Vercel (Hobby Plan)

| Resource | Limit |
|----------|-------|
| Deployments | Unlimited |
| Bandwidth | 100 GB/month |
| Serverless Function Duration | 60 seconds |
| Builds | 6,000 minutes/month |

### Supabase (Free Plan)

| Resource | Limit |
|----------|-------|
| Database Size | 500 MB |
| Storage | 1 GB |
| Bandwidth | 5 GB |
| Monthly Active Users | 50,000 |
| Projects | 2 active |

> 💡 These limits are more than enough for a portfolio/personal project.

---

## Troubleshooting

### Build fails with Prisma error

Make sure both `DATABASE_URL` and `DIRECT_URL` are set in Vercel environment variables.

### "Can't reach database server" on Vercel

- Verify your Supabase project is active (free projects pause after 1 week of inactivity)
- Check your connection strings have the correct password
- Go to Supabase Dashboard and click **"Restore"** if paused

### OAuth redirect error

Make sure `AUTH_URL` in Vercel env vars matches your actual Vercel deployment URL (including `https://`).

### Schema changes after deployment

If you change `prisma/schema.prisma`, run locally:

```bash
npx prisma db push
```

Then push and redeploy on Vercel.

---

## Custom Domain (Optional)

1. Go to **Vercel Dashboard → Your Project → Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `AUTH_URL` to your custom domain
5. Update OAuth callback URLs to use your custom domain
