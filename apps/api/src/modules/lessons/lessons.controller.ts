import { Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { LessonsService, LessonsResponse } from './lessons.service';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('api/v1/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  /**
   * Bài 2.2: Lấy danh sách bài học (Áp dụng Cache-Aside qua Redis)
   * GET /api/v1/lessons
   */
  @Get()
  async getLessons(): Promise<LessonsResponse> {
    return this.lessonsService.getLessons();
  }

  /**
   * Bài 2.2: Xóa Cache thủ công (Cache Invalidation)
   * DELETE /api/v1/lessons/cache
   */
  @Delete('cache')
  @HttpCode(HttpStatus.OK)
  async clearCache() {
    return this.lessonsService.clearCache();
  }

  /**
   * Bài 2.3: API thử nghiệm Rate Limiting (Giới hạn tối đa 5 request trong 60 giây)
   * POST /api/v1/lessons/test-rate-limit
   */
  @Post('test-rate-limit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @RateLimit({ limit: 5, ttlSeconds: 60 })
  testRateLimit() {
    return {
      statusCode: HttpStatus.OK,
      message: '✅ Yêu cầu hợp lệ! Bạn chưa vượt quá giới hạn 5 request/60s.',
      timestamp: new Date().toISOString(),
    };
  }
}
