/**
 * Simple in-memory rate limiter
 * Production'da Redis (Upstash/Vercel KV) kullanılmalı
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (identifier: string): Promise<{ success: boolean; remaining: number }> => {
      const now = Date.now();
      const entry = rateLimitMap.get(identifier);

      // Clean up expired entries periodically
      if (rateLimitMap.size > 10000) {
        const toDelete: string[] = [];
        rateLimitMap.forEach((value, key) => {
          if (value.resetTime < now) {
            toDelete.push(key);
          }
        });
        toDelete.forEach(key => rateLimitMap.delete(key));
      }

      if (!entry || entry.resetTime < now) {
        // New or expired entry
        rateLimitMap.set(identifier, {
          count: 1,
          resetTime: now + config.interval,
        });
        return { success: true, remaining: config.maxRequests - 1 };
      }

      if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        return { success: false, remaining: 0 };
      }

      // Increment count
      entry.count++;
      rateLimitMap.set(identifier, entry);
      return { success: true, remaining: config.maxRequests - entry.count };
    },
  };
}

// Pre-configured rate limiters
export const loginRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 min
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});

export const strictApiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute (for sensitive endpoints)
});
