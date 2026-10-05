import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';

export interface LessonItem {
  id: string;
  pillar: 'MAIN_ARTICLE' | 'MINI_STORY' | 'POINT_OF_VIEW' | 'VOCABULARY';
  title: string;
  speaker: string;
  audioDurationSeconds: number;
  sampleAudioUrl: string;
  transcriptSample: string;
}

export interface LessonsResponse {
  source: 'CACHE (Redis)' | 'DATABASE (Origin)';
  responseTimeMs: number;
  cachedTtlSeconds?: number;
  data: LessonItem[];
}

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);
  private readonly CACHE_KEY = 'speakup:lessons:all';
  private readonly CACHE_TTL_SECONDS = 60; // Cache trong 60 giây

  constructor(private readonly redisService: RedisService) {}

  /**
   * Lấy danh sách bài học áp dụng Cache-Aside Pattern
   */
  async getLessons(): Promise<LessonsResponse> {
    const startTime = Date.now();

    // -------------------------------------------------------------------------
    // BƯỚC 1: Kiểm tra trong Redis Cache trước
    // -------------------------------------------------------------------------
    const cachedData = await this.redisService.get<LessonItem[]>(this.CACHE_KEY);

    if (cachedData) {
      const ttl = await this.redisService.ttl(this.CACHE_KEY);
      const responseTimeMs = Date.now() - startTime;
      this.logger.log(`⚡ [CACHE HIT] Lấy dữ liệu từ Redis (${responseTimeMs}ms) - TTL còn: ${ttl}s`);

      return {
        source: 'CACHE (Redis)',
        responseTimeMs,
        cachedTtlSeconds: ttl,
        data: cachedData,
      };
    }

    // -------------------------------------------------------------------------
    // BƯỚC 2: [CACHE MISS] Chưa có trong Cache -> Giả lập truy vấn Database
    // -------------------------------------------------------------------------
    this.logger.warn(`⏳ [CACHE MISS] Chưa có cache. Đang truy vấn Database gốc...`);

    // Mô phỏng độ trễ truy vấn database (khoảng 60ms)
    await new Promise((resolve) => setTimeout(resolve, 60));

    const dbLessons = this.getMockDatabaseLessons();

    // -------------------------------------------------------------------------
    // BƯỚC 3: Lưu kết quả vào Redis Cache với TTL (60 giây)
    // -------------------------------------------------------------------------
    await this.redisService.set(this.CACHE_KEY, dbLessons, this.CACHE_TTL_SECONDS);
    this.logger.log(`💾 [CACHE STORED] Đã lưu vào Redis key "${this.CACHE_KEY}" với TTL ${this.CACHE_TTL_SECONDS}s`);

    const responseTimeMs = Date.now() - startTime;

    return {
      source: 'DATABASE (Origin)',
      responseTimeMs,
      cachedTtlSeconds: this.CACHE_TTL_SECONDS,
      data: dbLessons,
    };
  }

  /**
   * Xóa Cache chủ động (Cache Invalidation)
   */
  async clearCache(): Promise<{ success: boolean; message: string }> {
    const deleted = await this.redisService.del(this.CACHE_KEY);
    this.logger.log(`🗑️ [CACHE INVALIDATED] Đã xóa cache key "${this.CACHE_KEY}"`);
    return {
      success: deleted,
      message: deleted
        ? `Đã xóa cache "${this.CACHE_KEY}" thành công khỏi Redis!`
        : `Key "${this.CACHE_KEY}" không tồn tại trong Redis.`,
    };
  }

  /**
   * Dữ liệu bài học mẫu theo phương pháp Effortless English
   */
  private getMockDatabaseLessons(): LessonItem[] {
    return [
      {
        id: 'lesson-01-main',
        pillar: 'MAIN_ARTICLE',
        title: 'A Kiss - Main Audio Article',
        speaker: 'A.J. Hoge',
        audioDurationSeconds: 420,
        sampleAudioUrl: 'https://cdn.speakup.app/audio/a-kiss-main.mp3',
        transcriptSample: 'Carlos bought a new car. It was a very expensive car. It was a huge, blue, fast car...',
      },
      {
        id: 'lesson-01-ms',
        pillar: 'MINI_STORY',
        title: 'A Kiss - Mini-Story (Q&A Interactive)',
        speaker: 'A.J. Hoge',
        audioDurationSeconds: 680,
        sampleAudioUrl: 'https://cdn.speakup.app/audio/a-kiss-ms.mp3',
        transcriptSample: 'Did Carlos buy a cheap car? No, he did not! He bought a very expensive car...',
      },
      {
        id: 'lesson-01-pov',
        pillar: 'POINT_OF_VIEW',
        title: 'A Kiss - Point of View (Past to Future)',
        speaker: 'A.J. Hoge',
        audioDurationSeconds: 310,
        sampleAudioUrl: 'https://cdn.speakup.app/audio/a-kiss-pov.mp3',
        transcriptSample: 'Since last year, Carlos had been driving his new expensive car every single day...',
      },
      {
        id: 'lesson-01-voc',
        pillar: 'VOCABULARY',
        title: 'A Kiss - Vocabulary Explanation',
        speaker: 'A.J. Hoge',
        audioDurationSeconds: 290,
        sampleAudioUrl: 'https://cdn.speakup.app/audio/a-kiss-voc.mp3',
        transcriptSample: 'Huge means very, very big. Not just big, but gigantic...',
      },
    ];
  }
}
