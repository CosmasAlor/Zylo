const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

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
