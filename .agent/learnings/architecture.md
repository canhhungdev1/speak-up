# Architecture Decisions & System Design

> Lưu trữ các quyết định về kiến trúc hệ thống, giải pháp kỹ thuật và lý do lựa chọn (Trade-offs).
> AI sẽ tự động append nội dung vào đây sau các session làm việc.

---

## 1. Docker & Infrastructure Architecture (2026-10-05)

### Quyết định kỹ thuật:
- **Hạ tầng Containerized:** Sử dụng `docker-compose.yml` để điều phối PostgreSQL 16 Alpine, Redis 7 Alpine, và RabbitMQ 3 Management Alpine.
- **Mạng nội bộ:** Cấu hình bridge network `speakup-network` với container naming rõ ràng để các service giao tiếp qua Docker DNS nội bộ (`postgres:5432`, `redis:6379`, `rabbitmq:5672`).
- **Data Persistence:** Tạo 3 named volumes (`speakup_postgres_data`, `speakup_redis_data`, `speakup_rabbitmq_data`) đảm bảo không mất dữ liệu khi restart container.
- **NestJS Multi-stage Dockerfile:**
  - *Stage 1 (builder):* `node:20-alpine`, copy mã nguồn, biên dịch TypeScript (`nest build`), dọn dẹp devDependencies (`npm prune --omit=dev`).
  - *Stage 2 (runner):* Chạy bằng non-root user (`appuser:appgroup`), chỉ chứa runtime dependencies và thư mục `dist` (kích thước nén chỉ ~219MB).
- **Service Healthchecks & Dependencies:** `api` thiết lập `depends_on` với điều kiện `service_healthy` cho cả 3 container Postgres, Redis, RabbitMQ.

---

## 2. Redis Caching & Rate Limiting Architecture (2026-10-05)

### Quyết định kỹ thuật:
- **Global RedisModule:** Đóng gói `ioredis` thành `RedisService` dùng chung toàn ứng dụng (`@Global()`). Hỗ trợ tự động kết nối, tự động chuyển đổi JSON serialize/deserialize, và các lệnh atomic (`incr`, `expire`, `ttl`).
- **Cache-Aside Pattern:**
  - `GET /api/v1/lessons` áp dụng quy trình: Check Redis Cache -> Cache Hit (trả về ngay, response time < 10ms) -> Cache Miss (query DB/mô phỏng, nạp vào Redis kèm TTL 60s -> trả về).
  - Tích hợp endpoint `DELETE /api/v1/lessons/cache` phục vụ **Cache Invalidation** khi dữ liệu bài học bị thay đổi.
- **Rate Limiting Guard:**
  - Tự xây dựng `RateLimitGuard` và decorator `@RateLimit({ limit, ttlSeconds })`.
  - Sử dụng cơ chế Redis atomic `INCR` và `EXPIRE` theo IP người gọi (`ratelimit:{ip}:{path}`).
  - Trả về mã lỗi chuẩn RESTful `HTTP 429 Too Many Requests` và các headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
