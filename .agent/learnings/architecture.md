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
