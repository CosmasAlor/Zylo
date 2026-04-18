# Supabase Setup Guide for Zylo

This guide walks you through preparing the Zylo database for Supabase migration.

## Prerequisites

- Node.js 18+ with npm
- Supabase account ([supabase.com](https://supabase.com))
- Local PostgreSQL database with existing Zylo data (optional, for data migration)
- Vercel account for deployment

---

## Step 1: Set Up Supabase Project

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Select organization and region (pick closest to your users)
4. Set a strong database password
5. Wait for project initialization (~2 minutes)

### 1.2 Get Connection String
1. Navigate to **Settings → Database**
2. Under **Connection Pooling**, click **"Connection string"**
3. Make sure **URI** is selected
4. Copy the full connection string:
   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require
   ```

---

## Step 2: Run Prisma Migrations on Supabase

### 2.1 Prepare Environment
1. Create `.env.local` in the project root
2. Add your Supabase connection string:
   ```bash
   DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[region].pooling.supabase.com:6543/postgres?sslmode=require
   ```

### 2.2 Run Migrations
```bash
# Generate Prisma client (if not already done)
npm run prisma:generate

# Run migrations to create schema in Supabase
npx prisma migrate deploy

# (Optional) View the database
npx prisma studio
```

### 2.3 Verify Schema
In Prisma Studio, verify all tables are created:
- ✅ Appointment
- ✅ LogEntry
- ✅ ModuleConfig
- ✅ ContentBlock
- ✅ BlogPost
- ✅ MediaItem
- ✅ GalleryItem

---

## Step 3: (Optional) Migrate Data from Local Database

If you have existing data in a local PostgreSQL database:

### 3.1 Backup Local Data
```bash
# Create backup of local database
pg_dump your_local_db > backup_$(date +%s).sql
```

### 3.2 Run Migration Script
```bash
# Ensure DATABASE_URL points to your LOCAL database
# (The script will read from there and write to Supabase)

# For Windows:
$env:DATABASE_URL="postgresql://localhost:5432/your_local_db"
npx ts-node -r dotenv/config migrate.ts

# For macOS/Linux:
DATABASE_URL="postgresql://localhost:5432/your_local_db" npx ts-node -r dotenv/config migrate.ts
```

The script will:
1. ✅ Read all data from your local database
2. ✅ Connect to Supabase
3. ✅ Migrate all records
4. ✅ Verify the migration

---

## Step 4: Environment Variables for Deployment

### 4.1 Prepare Environment File
Copy the Supabase environment template:
```bash
cp .env.supabase.example .env.production
```

Then fill in with your actual values:
- `DATABASE_URL`: From Supabase Settings → Database
- `NEXTAUTH_URL`: Your deployment domain
- `NEXT_PUBLIC_APP_URL`: Same as `NEXTAUTH_URL`
- `AUTH_SECRET`: Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `ADMIN_EMAIL`: Your admin email
- `ADMIN_PASSWORD`: Strong password

### 4.2 Test Locally
```bash
# Start dev server with Supabase
npm run dev

# In another terminal, verify connection
npx prisma studio
```

---

## Step 5: Deploy to Vercel

### 5.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New" → "Project"**
3. Import your GitHub repository
4. Select Next.js as framework (auto-detected)

### 5.2 Add Environment Variables
In Vercel Project Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase connection string |
| `NEXTAUTH_URL` | Your Vercel domain or custom domain |
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` |
| `AUTH_SECRET` | Random 32-byte base64 string |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password |

### 5.3 Configure Build Command
In Vercel Project Settings → Build & Development Settings:
- **Build Command**: `npm run build` (already includes `prisma generate`)
- **Start Command**: `npm run start`

### 5.4 Deploy
Click **"Deploy"** and wait for the build to complete.

---

## Step 6: Verify Deployment

### 6.1 Check Health Endpoint
```bash
curl https://your-domain.com/api/health
# Should return: {"status":"ok"}
```

### 6.2 Test Admin Login
1. Go to `https://your-domain.com/admin/login`
2. Use your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Verify you can access the admin dashboard

### 6.3 Check Database Connection
In admin dashboard, check:
- ✅ Logs are being recorded
- ✅ You can view existing data
- ✅ No connection errors in browser console

---

## Troubleshooting

### "SSL connection refused"
**Solution**: Make sure `?sslmode=require` is in your DATABASE_URL

### "Authentication failed for user postgres"
**Solution**: Check password in connection string matches Supabase

### "FATAL: remaining connection slots reserved for non-replication superuser connections"
**Solution**: You've hit connection limit. Check for leaking connections or upgrade plan.

### "Prisma Client not generated"
**Solution**: Run `npm run prisma:generate` before deploying

### Build fails: "Type error: Module '@prisma/client' has no exported member"
**Solution**: This is fixed by the build script that runs `prisma generate` first

---

## Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Check current connection
npx prisma db execute --stdin < /dev/null

# Reset Supabase database (⚠️ destructive - use with caution!)
# npx prisma migrate reset

# View pending migrations
npx prisma migrate status
```

---

## Security Notes

🔒 **Never commit `.env.local` or credentials to git**

- Add `*.env` to `.gitignore` (already done)
- Use Vercel's environment variable management for production
- Rotate `AUTH_SECRET` periodically
- Use strong passwords for admin and database

---

## Next Steps

1. ✅ Database setup complete
2. ✅ Deploy to Vercel
3. Start using your Zylo app in production!

For additional help, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
