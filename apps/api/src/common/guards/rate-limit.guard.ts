import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';
import { RedisService } from '../../infrastructure/redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu endpoint không khai báo @RateLimit thì bỏ qua
    if (!options) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    // Xác định IP người gọi
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const routePath = req.route?.path || req.url;
    const redisKey = `ratelimit:${clientIp}:${routePath}`;

    // Tăng số đếm bằng Redis INCR
    const currentCount = await this.redisService.incr(redisKey);

    // Nếu đây là request đầu tiên, thiết lập thời hạn sống (TTL)
    if (currentCount === 1) {
      await this.redisService.expire(redisKey, options.ttlSeconds);
    }

    const remainingTtl = await this.redisService.ttl(redisKey);
    const remainingRequests = Math.max(0, options.limit - currentCount);

    // Gắn headers chuẩn vào Response
    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', remainingRequests);
    res.setHeader('X-RateLimit-Reset', remainingTtl > 0 ? remainingTtl : options.ttlSeconds);

    this.logger.debug(
      `[RateLimit] IP ${clientIp} gọi ${routePath}: ${currentCount}/${options.limit} (TTL: ${remainingTtl}s)`
    );

    // Kiểm tra nếu vượt quá giới hạn
    if (currentCount > options.limit) {
      this.logger.warn(`[RateLimit BLOCKED] IP ${clientIp} đã vượt quá giới hạn gọi ${routePath}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Bạn đã gửi quá nhiều yêu cầu. Giới hạn là ${options.limit} lượt mỗi ${options.ttlSeconds} giây. Vui lòng thử lại sau ${remainingTtl} giây.`,
          retryAfterSeconds: remainingTtl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
