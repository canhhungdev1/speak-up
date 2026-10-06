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

---

## 3. RabbitMQ Event-Driven & Dead Letter Queue Architecture (2026-10-06)

### Quyết định kỹ thuật:
- **RabbitMQ Broker Integration:** Tích hợp thư viện `@golevelup/nestjs-rabbitmq` với RabbitMQ 3 Management. Tự động khởi tạo `Topic Exchange` (`speakup.exchange`) và `Dead Letter Exchange` (`speakup.dlx`).
- **Asynchronous Producer-Consumer Pattern:**
  - `POST /api/v1/waitlist` đóng vai trò Producer: lưu database trong ~2ms, publish event `waitlist.registered` vào Exchange, và phản hồi `201 Created` ngay lập tức cho client (< 30ms).
  - `WaitlistEmailConsumer` đăng ký queue `speakup_waitlist_email_queue`, xử lý tác vụ gửi email chào mừng và tài liệu Effortless English ngầm (mô phỏng 1.5s) mà không chặn luồng HTTP.
- **Dead Letter Queue (DLQ) Resilience:**
  - Cấu hình queue options: `deadLetterExchange: 'speakup.dlx'`, `deadLetterRoutingKey: 'dlx.waitlist.email'`.
  - Khi consumer từ chối message (`new Nack(false)` do lỗi máy chủ gửi mail), RabbitMQ tự động đẩy message sang `speakup_waitlist_email_dlq`.
  - `WaitlistDlqConsumer` tiếp nhận message lỗi để phân tích và lên lịch retry, đảm bảo tính chịu lỗi (Fault tolerance) và không bao giờ mất mát dữ liệu.

---

## 4. NGINX Reverse Proxy, API Gateway & SPA Routing Architecture (2026-10-06)

### Quyết định kỹ thuật:
- **Cổng vào hệ thống tập trung (Single Entry Point):**
  - Sử dụng NGINX Alpine làm reverse proxy và web server đứng đầu hệ thống tại cổng `8080` (tránh xung đột cổng 80 của Windows IIS/HTTP.sys).
- **Định tuyến URL (Routing Strategy):**
  - `location /api/`: Tự động chuyển tiếp (reverse proxy) toàn bộ HTTP request sang container `http://api:3000`. Che giấu cổng nội bộ của backend và triệt tiêu 100% lỗi CORS giữa frontend và backend.
  - `location /`: Phục vụ các file tĩnh của Angular SPA với cơ chế fallback `try_files $uri $uri/ /index.html;`, ngăn ngừa hoàn toàn lỗi `404 Not Found` khi người dùng F5 tải lại các route con (`/dashboard`, `/lessons`...).
- **Tối ưu hóa hiệu năng & Băng thông (Web Optimization):**
  - Kích hoạt nén Gzip (`gzip on`, `gzip_types ...`) cho JSON, HTML, CSS, JavaScript, giúp giảm tới 70% dung lượng truyền tải.
  - Cấu hình Cache-Control dài hạn (`max-age=31536000, immutable`) cho các tài nguyên tĩnh đã băm tên file (assets hashing).
- **Multi-Stage Dockerfile cho Frontend (`apps/web`):**
  - *Stage 1 (Builder):* `node:20-alpine`, `npm ci`, biên dịch production bundle qua `ng build` ra thư mục `dist/web/browser`.
  - *Stage 2 (Runner):* `nginx:alpine` siêu nhẹ (~25MB), copy mã nguồn tĩnh đã build và file cấu hình `nginx.conf`.

---

## 5. PostgreSQL, Prisma ORM & Event-Driven Welcome Flow Architecture (2026-10-06)

### Quyết định kỹ thuật:
- **Prisma ORM & PostgreSQL Mapping:**
  - Sử dụng **Prisma 6** làm ORM chính kết nối cơ sở dữ liệu PostgreSQL 16 container.
  - Tuân thủ quy tắc quy ước đặt tên (Naming Conventions):
    - Database level: Tên bảng và tên cột lưu bằng `snake_case` (`users`, `avatar_url`, `created_at`, `updated_at`) thông qua `@map` và `@@map`.
    - Application level: Thuộc tính trong TypeScript và Prisma Client dùng `camelCase` (`avatarUrl`, `createdAt`, `updatedAt`).
- **3-Tier Architecture & Data Transfer Objects (DTO):**
  - **Controller:** Tiếp nhận HTTP Request `POST /api/v1/auth/google`, validate qua `GoogleLoginDto` (sử dụng `class-validator`), ủy thác cho Service.
  - **Service:** Chứa nghiệp vụ phân nhánh (New User vs Existing User), giao tiếp DB qua `PrismaService` và dispatch RabbitMQ event.
  - **Data Protection:** Ánh xạ Model DB sang `UserProfileDto`, ngăn chặn rò rỉ các trường nhạy cảm ra ngoài API response.
- **Event-Driven Welcome Email Flow:**
  - **Người dùng mới (First-time Login):** Lưu thông tin vào DB $\rightarrow$ Bắn sự kiện `user.welcome` vào RabbitMQ Exchange `speakup.exchange` $\rightarrow$ `UserEmailConsumer` tiêu thụ message từ queue `speakup_user_welcome_queue` và gửi email chào mừng bất đồng bộ.
  - **Người dùng cũ (Returning User):** Truy vấn DB thấy tài khoản đã tồn tại $\rightarrow$ Trả về `200 OK` đăng nhập ngay lập tức, hoàn toàn không kích hoạt lại RabbitMQ event gửi mail.
- **Global Exception Filter:**
  - Tích hợp `AllExceptionsFilter` bao quát toàn bộ lỗi runtime và HTTP exception, trả về format JSON đồng nhất (`statusCode`, `timestamp`, `path`, `error`).


