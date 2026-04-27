import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiting configuration for different endpoints
const RATE_LIMITS = {
  "/api/auth": { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes for auth
  "/api/contact": { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 messages per hour
  "/api/book": { limit: 5, windowMs: 60 * 60 * 1000 }, // 5 bookings per hour
  "default": { limit: 20, windowMs: 60 * 1000 }, // 20 requests per minute for other APIs
};

export function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
    request.headers.get("x-real-ip") || 
    "unknown";

  const pathname = request.nextUrl.pathname;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    let rateLimitConfig = RATE_LIMITS.default;
    
    // Find matching rate limit config
    for (const [path, config] of Object.entries(RATE_LIMITS)) {
      if (path !== "default" && pathname.startsWith(path)) {
        rateLimitConfig = config;
        break;
      }
    }

    if (!rateLimit(ip, rateLimitConfig.limit, rateLimitConfig.windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Add security headers
    const response = NextResponse.next();
    
    // Enhanced security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    
    // Add rate limit headers for API responses
    response.headers.set("X-RateLimit-Limit", rateLimitConfig.limit.toString());
    response.headers.set("X-RateLimit-Window", (rateLimitConfig.windowMs / 1000).toString());

    return response;
  }

  // Add security headers for non-API routes
  const response = NextResponse.next();
  
  // Enhanced security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
  ],
};
