const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Cleanup old entries every 5 minutes to prevent unbounded growth
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

export function rateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; // Allowed
  }

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
    return true; // Allowed
  }

  if (record.count < limit) {
    record.count++;
    return true; // Allowed
  }

  return false; // Rate limited
}
