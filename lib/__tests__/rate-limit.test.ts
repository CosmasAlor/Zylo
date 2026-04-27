import { rateLimit } from '../rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the rate limit map before each test
    const rateLimitMap = (global as any).rateLimitMap
    if (rateLimitMap) {
      rateLimitMap.clear()
    }
    // Use fake timers
    jest.useFakeTimers()
  })

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers()
  })

  it('should allow requests within the limit', () => {
    const ip = '192.168.1.1'
    
    // First request should be allowed
    expect(rateLimit(ip, 5, 60000)).toBe(true)
    
    // Second request should be allowed
    expect(rateLimit(ip, 5, 60000)).toBe(true)
    
    // Third request should be allowed
    expect(rateLimit(ip, 5, 60000)).toBe(true)
  })

  it('should block requests that exceed the limit', () => {
    const ip = '192.168.1.2'
    
    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(ip, 5, 60000)).toBe(true)
    }
    
    // 6th request should be blocked
    expect(rateLimit(ip, 5, 60000)).toBe(false)
  })

  it('should reset after the window expires', () => {
    const ip = '192.168.1.3'
    
    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(ip, 5, 100)).toBe(true)
    }
    
    // Should be blocked
    expect(rateLimit(ip, 5, 100)).toBe(false)
    
    // Wait for the window to expire (simulate time passing)
    jest.advanceTimersByTime(101)
    
    // Should be allowed again
    expect(rateLimit(ip, 5, 100)).toBe(true)
  })

  it('should handle different IPs independently', () => {
    const ip1 = '192.168.1.4'
    const ip2 = '192.168.1.5'
    
    // Make 5 requests from ip1
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(ip1, 5, 60000)).toBe(true)
    }
    
    // ip1 should be blocked
    expect(rateLimit(ip1, 5, 60000)).toBe(false)
    
    // ip2 should still be allowed
    expect(rateLimit(ip2, 5, 60000)).toBe(true)
  })

  it('should handle unknown IP addresses', () => {
    const unknownIp = 'unknown'
    
    // Should work with unknown IP
    expect(rateLimit(unknownIp, 3, 60000)).toBe(true)
    expect(rateLimit(unknownIp, 3, 60000)).toBe(true)
    expect(rateLimit(unknownIp, 3, 60000)).toBe(true)
    expect(rateLimit(unknownIp, 3, 60000)).toBe(false)
  })
})
