/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * @fileoverview Provides CSRF token generation, validation, and storage
 */

import { randomBytes } from "crypto";

// Store CSRF tokens in memory (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a cryptographically secure CSRF token
 * @returns A 64-character hexadecimal string representing the CSRF token
 * 
 * @example
 * ```typescript
 * const token = generateCSRFToken();
 * console.log(token); // "a1b2c3d4e5f6..."
 * ```
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Validate a CSRF token against a stored session token
 * @param sessionId - The unique session identifier
 * @param providedToken - The CSRF token provided by the client
 * @returns true if the token is valid, false otherwise
 * 
 * @example
 * ```typescript
 * if (validateCSRFToken(sessionId, clientToken)) {
 *   // Process the request
 * } else {
 *   // Reject the request - possible CSRF attack
 * }
 * ```
 */
export function validateCSRFToken(sessionId: string, providedToken: string): boolean {
  const tokenData = csrfTokens.get(sessionId);
  
  if (!tokenData) {
    return false;
  }
  
  // Check if token has expired (1 hour)
  if (Date.now() > tokenData.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  // Validate token
  const isValid = tokenData.token === providedToken;
  
  // Remove token after validation (one-time use)
  csrfTokens.delete(sessionId);
  
  return isValid;
}

/**
 * Store a CSRF token for a session
 * @param sessionId - The unique session identifier
 * @param token - The CSRF token to store
 * 
 * @example
 * ```typescript
 * const token = generateCSRFToken();
 * storeCSRFToken(sessionId, token);
 * ```
 */
export function storeCSRFToken(sessionId: string, token: string): void {
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
}

// Cleanup expired tokens every 30 minutes
if (typeof globalThis !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [sessionId, tokenData] of csrfTokens.entries()) {
      if (now > tokenData.expires) {
        csrfTokens.delete(sessionId);
      }
    }
  }, 30 * 60 * 1000);
  
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}
