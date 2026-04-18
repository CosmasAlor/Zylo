# Zylo Deployment Guide (Vercel + Supabase)

## Overview
This guide covers deploying your Next.js 16 Zylo app to Vercel with Supabase as the PostgreSQL database.

---

## Phase 1: Supabase Setup

### 1. Create Supabase Account & Project
- Go to [supabase.com](https://supabase.com)
- Sign up and create a new project
- Choose your region (preferably closer to your users)
- Wait for project initialization (~2 minutes)

### 2. Get Database Connection String
1. Once project is ready, go to **Settings → Database**
2. Under "Connection Pooling" section, click **Connection string**
3. Select **URI** option
4. Copy the full connection string (it will look like):
   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require
   ```
5. **Important**: Replace `[YOUR-PASSWORD]` if needed (initial password sent in email)

### 3. Run Prisma Migrations on Supabase
Once you have the connection string:

```bash
# Set temporary DATABASE_URL
$env:DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma studio
```

---

## Phase 2: Generate Required Secrets

### AUTH_SECRET
Generate a secure random secret (use one of these):

**Option A: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option B: Online Generator** (if Node isn't available)
- Go to [1password.com/password-generator](https://1password.com/password-generator/)
- Generate a 32-byte Base64 string

**Save this value** - you'll need it for Vercel env vars.

---

## Phase 3: Vercel Deployment

### Method A: GitHub Integration (Recommended)

#### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial Zylo deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zylo.git
git push -u origin main
```

#### 2. Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Authenticate and select your GitHub repo
4. Click "Import"

#### 3. Add Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require` | From Supabase |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Will be your Vercel domain |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Same as above |
| `AUTH_SECRET` | Generated random secret | From Phase 2 above |
| `ADMIN_EMAIL` | Your admin email | e.g., admin@example.com |
| `ADMIN_PASSWORD` | Strong password | Use a password manager |

#### 4. Deploy
- Click "Deploy"
- Wait for build to complete (~3-5 minutes)
- Your app will be live at `https://your-project.vercel.app`

---

### Method B: Vercel CLI

#### 1. Install & Login
```bash
npm install -g vercel
vercel login
```

#### 2. Deploy
```bash
vercel --prod
```

#### 3. Add Environment Variables (via CLI or web dashboard)
Same variables as Method A above.

---

## Phase 4: Post-Deployment Verification

### 1. Test Health Endpoint
```bash
curl https://your-project.vercel.app/api/health
```
Expected: `{"status":"ok"}`

### 2. Check Admin Login
- Go to `https://your-project.vercel.app/admin/login`
- Use your `ADMIN_EMAIL` and `ADMIN_PASSWORD`

### 3. Verify Database Connection
Once logged in, visit `/admin/cms` or any admin page that accesses the database.

### 4. Monitor Logs
In Vercel Dashboard → Deployments → View Logs

If issues occur:
```bash
vercel logs <deployment-url>
```

---

## Environment Variables Checklist

```env
# ✓ Required - Database (from Supabase)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require

# ✓ Required - Auth
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
AUTH_SECRET=<generated-base64-secret>

# ✓ Required - Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong-password-here
```

---

## Troubleshooting

### Database Connection Fails
- Verify Supabase project is active (not paused)
- Check connection string includes `:6543` (pooling port)
- Ensure `sslmode=require` is in the URL

### Auth Errors
- Verify `AUTH_SECRET` is set and matches between dev and prod
- Ensure `NEXTAUTH_URL` matches your actual domain
- Check cookies are being set (Chrome DevTools → Application → Cookies)

### Build Fails
- Check Vercel build logs for TypeScript errors
- Run `npm run typecheck` locally to debug
- Verify all required env vars are set

### Admin Login Redirects
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are correct
- Verify `AUTH_SECRET` is properly set
- Clear browser cookies and try again

---

## Ongoing Maintenance

### Update Code
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys on push
```

### Update Database (Migrations)
```bash
# Local: Make schema changes in prisma.schema
npx prisma migrate dev --name migration_name

# Production (Supabase):
# 1. Push code with migration files
# 2. Vercel runs `npm run build` which includes migration
# 3. Or manually run: npx prisma migrate deploy
```

### Monitor Performance
- Vercel Analytics: [vercel.com/analytics](https://vercel.com/analytics)
- Check Web Vitals at `/api/web-vitals` endpoint
- View logs: `vercel logs <url>`

---

## Security Reminders

✓ Never commit `.env.local` or environment variables  
✓ Use strong passwords for `ADMIN_PASSWORD`  
✓ Rotate `AUTH_SECRET` if compromised  
✓ Keep Supabase connection string confidential  
✓ Enable Vercel deployment protection by team/branch  

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build & test production
npm run build
npm run start

# Database operations
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
npx prisma studio

# Type checking before deploy
npm run typecheck
npm run lint

# Format code
npm run format
```

---

**Last Updated:** April 17, 2026  
**Next.js Version:** 16.2.3  
**Database:** Supabase (PostgreSQL 15+)
