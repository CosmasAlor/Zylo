# Zylo Dental Clinic Platform

Production-oriented dental clinic platform built with Next.js App Router, TypeScript, Tailwind, Prisma, PostgreSQL, and NextAuth.


![Landing Page](./image/landing.png)


## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma 7 + PostgreSQL
- NextAuth (Credentials flow)
- React Hook Form + Zod

## Setup Steps


1. Install dependencies:

```bash
npm install
```

2. Copy environment variables and update values:

```bash
copy .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migration:

```bash
npx prisma migrate dev --name init_appointment
```

5. (Optional) Seed demo/test data:

```bash
npm run db:seed
```

6. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zylo?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="replace-with-long-random-secret"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="password123"
```

## Migration Commands

- Generate client:

```bash
npm run prisma:generate
```

- Create and apply a new migration:

```bash
npx prisma migrate dev --name <migration_name>
```

- Check migration status:

```bash
npx prisma migrate status
```

## Deployment Instructions

1. Build app:

```bash
npm run build
```

2. Run production server:

```bash
npm run start
```

3. Ensure production env vars are set (especially `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`).

4. Apply migrations in deployment pipeline before app start:

```bash
npx prisma migrate deploy
```

## Admin Access

- Login URL: `/admin/login`
- Default development credentials are taken from `.env`:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
