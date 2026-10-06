import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('api/v1/waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  /**
   * Đăng ký Waitlist (Kết hợp Redis Rate Limiting + RabbitMQ Async Processing)
   * POST /api/v1/waitlist
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RateLimitGuard)
  @RateLimit({ limit: 10, ttlSeconds: 60 })
  async register(@Body() dto: CreateWaitlistDto) {
    return this.waitlistService.register(dto);
  }

  /**
   * Lấy danh sách Waitlist đã đăng ký
   * GET /api/v1/waitlist
   */
  @Get()
  async getAll() {
    return this.waitlistService.getAll();
  }
}
