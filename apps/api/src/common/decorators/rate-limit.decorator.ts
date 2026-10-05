import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  limit: number;      // Số request tối đa cho phép
  ttlSeconds: number; // Trong khoảng thời gian (giây)
}

export const RATE_LIMIT_KEY = 'RATE_LIMIT_OPTIONS';

/**
 * Decorator giới hạn số lượt gọi API sử dụng Redis
 * @example @RateLimit({ limit: 5, ttlSeconds: 60 })
 */
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);
