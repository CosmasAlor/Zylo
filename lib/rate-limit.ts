/**
 * In-memory rate limiting utility for API endpoints
 * @fileoverview Provides rate limiting functionality to prevent abuse
 */

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Cleanup old rate limit entries every 5 minutes to prevent memory leaks
 * This runs automatically when the module is loaded
 */
if (typeof globalThis !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    const thirtyMinutesMs = 30 * 60 * 1000;
    
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now - record.lastReset > thirtyMinutesMs) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
  
  // Prevent interval from keeping process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

/**
 * Check if a request should be rate limited
 * @param ip - The IP address of the client
 * @param limit - Maximum number of requests allowed in the time window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if request is allowed, false if rate limited
 * 
 * @example
 * ```typescript
 * // Allow 10 requests per minute
 * if (rateLimit(clientIp, 10, 60000)) {
 *   // Process request
 * } else {
 *   // Return 429 Too Many Requests
 * }
 * ```
 */
export function rateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // First request from this IP
  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; // Allowed
  }

  // Reset if window has expired
  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
    return true; // Allowed
  }

  // Check if under limit
  if (record.count < limit) {
    record.count++;
    return true; // Allowed
  }

  return false; // Rate limited
}
