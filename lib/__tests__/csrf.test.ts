import { generateCSRFToken, validateCSRFToken, storeCSRFToken } from '../csrf'

describe('CSRF Protection', () => {
  beforeEach(() => {
    // Clear the CSRF tokens map before each test
    const csrfTokens = (global as any).csrfTokens
    if (csrfTokens) {
      csrfTokens.clear()
    }
    // Use fake timers
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers()
  })

  it('should generate a valid CSRF token', () => {
    const token = generateCSRFToken()
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.length).toBe(64) // 32 bytes * 2 (hex encoding)
  })

  it('should store and validate CSRF tokens correctly', () => {
    const sessionId = 'session123'
    const token = generateCSRFToken()
    
    // Store the token
    storeCSRFToken(sessionId, token)
    
    // Validate the token
    expect(validateCSRFToken(sessionId, token)).toBe(true)
  })

  it('should reject invalid CSRF tokens', () => {
    const sessionId = 'session456'
    const validToken = generateCSRFToken()
    const invalidToken = generateCSRFToken()
    
    // Store the valid token
    storeCSRFToken(sessionId, validToken)
    
    // Try to validate with invalid token
    expect(validateCSRFToken(sessionId, invalidToken)).toBe(false)
  })

  it('should reject tokens for non-existent sessions', () => {
    const sessionId = 'nonexistent'
    const token = generateCSRFToken()
    
    // Should reject since no token was stored
    expect(validateCSRFToken(sessionId, token)).toBe(false)
  })

  it('should reject expired tokens', () => {
    const sessionId = 'session789'
    const token = generateCSRFToken()
    
    // Store the token
    storeCSRFToken(sessionId, token)
    
    // Fast-forward time by more than 1 hour
    jest.advanceTimersByTime(61 * 60 * 1000)
    
    // Token should be expired
    expect(validateCSRFToken(sessionId, token)).toBe(false)
  })

  it('should use one-time tokens (removed after validation)', () => {
    const sessionId = 'session-onetime'
    const token = generateCSRFToken()
    
    // Store the token
    storeCSRFToken(sessionId, token)
    
    // First validation should succeed
    expect(validateCSRFToken(sessionId, token)).toBe(true)
    
    // Second validation should fail (token was removed)
    expect(validateCSRFToken(sessionId, token)).toBe(false)
  })

  it('should handle multiple sessions independently', () => {
    const session1 = 'session1'
    const session2 = 'session2'
    const token1 = generateCSRFToken()
    const token2 = generateCSRFToken()
    
    // Store tokens for different sessions
    storeCSRFToken(session1, token1)
    storeCSRFToken(session2, token2)
    
    // Each session should validate its own token
    expect(validateCSRFToken(session1, token1)).toBe(true)
    expect(validateCSRFToken(session2, token2)).toBe(true)
    
    // Cross-validation should fail
    expect(validateCSRFToken(session1, token2)).toBe(false)
    expect(validateCSRFToken(session2, token1)).toBe(false)
  })
})
