# Copilot instructions for Zylo

- This is a Next.js 16 App Router project using TypeScript, Tailwind CSS 4, Prisma 7, PostgreSQL, and NextAuth.
- Import aliases use `@/*` from `tsconfig.json`; most code imports via `@/components`, `@/lib`, and `@/modules`.

## Architecture

- `app/` is the primary UI router. It uses route groups like `app/(marketing)` and admin routes under `app/admin`.
- `modules/*` is the main domain structure: `appointments`, `blog`, `gallery`, `logs`, `media`, `admin`.
- Each module often exposes:
  - `components/` for local UI
  - `services/` for business logic and DB access
  - `validations/` for Zod schemas
  - `api/` for route handler logic
- Shared UI primitives live in `components/ui`; reusable sections are in `components/sections`.

## Database and backend patterns

- Use `@/lib/prisma` for the general Prisma singleton client.
- Use `@/lib/db/prisma` when code currently imports `db` in service or action files.
- `lib/env.ts` throws if required env vars are missing; do not bypass it.
- Prisma is configured with `@prisma/adapter-pg` and uses a singleton in development.

## Authentication and admin routing

- `auth.ts` configures NextAuth with Credentials provider and admin login based on `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.
- `proxy.ts` is the app-level guard for `/admin/*`; do not introduce `middleware.ts` in this repo.
- Unauthorized admin access should redirect to `/admin/login`.
- `app/admin/login/page.tsx` renders the custom sign-in page.

## API conventions

- API routes use App Router route handlers and `NextResponse`.
- Follow existing patterns in `modules/appointments/api/route-handler.ts` and `app/api/logs/route.ts`:
  - validate body with Zod
  - use `safeParse`
  - use `rateLimit` from `@/lib/rate-limit`
  - return structured JSON with status codes
- `app/api/logs/route.ts` expects admin session checks for GET/DELETE and accepts client POST logging.

## Developer workflow

- Install: `npm install`
- Generate client: `npm run prisma:generate`
- Migrate: `npx prisma migrate dev --name <migration_name>`
- Seed: `npm run db:seed`
- Dev server: `npm run dev` (uses `next dev --webpack`)
- Build: `npm run build`
- Start prod: `npm run start`
- Useful checks: `npm run lint`, `npm run typecheck`, `npm run format`, `npm run format:check`

## Environment

- Required env vars: `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` should point to the app origin.

## Project-specific gotchas

- Avoid duplicate route segments in `app/`; do not create multiple `page.tsx` files that resolve to the same route.
- `proxy.ts` must remain the single request interceptor for admin route protection.
- Use `fetch` to `/api/logs` for runtime logging instead of inventing a new logging path.
- Keep admin actions server-side with `"use server"` and Next.js action conventions.

If any section is unclear or incomplete, ask for the exact area you want the instructions to cover next.