# Troubleshooting: 404 "Page Not Found" Errors

This document records the resolution of common 404 errors encountered during the development of the Zylo Dental Clinic platform.

## 1. Route Conflicts (Multiple `page.tsx`)
**Problem**: The root URL (`/`) or other paths return a 404 error even though the `page.tsx` file exists.
**Cause**: Next.js does not allow multiple `page.tsx` files to resolve to the same route. In this project, having both `app/page.tsx` and `app/(marketing)/page.tsx` caused a conflict that resulted in a 404.
**Solution**: 
- Ensure only one `page.tsx` exists for each unique route path.
- Check within Route Groups (folders with parentheses like `(marketing)`) for redundant files.
- **Action Taken**: Deleted `app/(marketing)/page.tsx` in favor of the root `app/page.tsx`.

## 2. Middleware vs. Proxy Conflict
**Problem**: All routes return 404 or the server fails to handle requests.
**Cause**: The project uses a modern Next.js convention where `proxy.ts` replaces `middleware.ts`. Detecting both files (`middleware.ts` and `proxy.ts`) at the root level causes an `Unhandled Rejection` error in the dev server, which prevents routes from being compiled.
**Solution**:
- Systematically use `proxy.ts` for all request interception and authentication logic.
- Delete `middleware.ts` if it exists.
- **Action Taken**: Removed `middleware.ts` and verified that `proxy.ts` is handling `/admin` route protection.

## 3. Server Recompilation Latency
**Problem**: First request to a page returns 404 or times out.
**Cause**: In development mode, Next.js compiles routes on-demand ("Lazy Loading"). If the first request hits a complex page while the server is struggling or recovering from a conflict, it may temporarily return a 404.
**Solution**:
- Wait for the "Compiling..." message in the terminal to complete.
- Refresh the browser after 2-3 seconds.
- Restart the dev server (`npm run dev`) if the state becomes inconsistent.

---
*Last Updated: 2026-04-16*
