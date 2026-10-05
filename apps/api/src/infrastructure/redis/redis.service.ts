import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD', 'speakup_redis_secret');

    this.logger.log(`Initializing Redis client connecting to ${host}:${port}...`);

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`, err.stack);
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      const pong = await this.client.ping();
      this.logger.log(`✅ Redis connected successfully! Ping response: ${pong}`);
    } catch (err) {
      this.logger.error(`❌ Failed to connect to Redis: ${(err as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting Redis client...');
    await this.client.quit();
  }

  /**
   * Lấy client ioredis gốc nếu cần gọi các lệnh nâng cao
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Lấy dữ liệu từ cache theo key (Tự động deserialize JSON)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      this.logger.error(`Error getting key "${key}" from Redis: ${(err as Error).message}`);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào cache (Tự động serialize JSON)
   * @param key Khóa định danh
   * @param value Dữ liệu cần lưu
   * @param ttlSeconds Thời gian sống tính bằng giây (Time to live). Mặc định không hết hạn.
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (err) {
      this.logger.error(`Error setting key "${key}" to Redis: ${(err as Error).message}`);
    }
  }

  /**
   * Xóa một key khỏi cache
   */
  async del(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (err) {
      this.logger.error(`Error deleting key "${key}" from Redis: ${(err as Error).message}`);
      return false;
    }
  }

  /**
   * Lấy thời gian sống còn lại của key (tính bằng giây)
   * Trả về -1 nếu key không có hạn, -2 nếu key không tồn tại
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Tăng giá trị số của key lên 1 (Dùng cho Rate Limiting / Counters)
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Đặt thời hạn hết hạn cho một key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.client.expire(key, seconds);
    return result === 1;
  }
}
