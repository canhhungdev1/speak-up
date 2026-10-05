# 🚀 SPEAK-UP — Effortless English Platform

> **Dự án cá nhân học tiếng Anh theo phương pháp Effortless English, tích hợp kiến trúc hiện đại: Docker, PostgreSQL, Redis, RabbitMQ, NestJS và Angular.**

---

## 🏛️ Công nghệ sử dụng (Tech Stack)

* **Backend (`apps/api`):** NestJS 11 (TypeScript), Kiến trúc phân tầng 3 lớp (Controller - Service - Repository).
* **Frontend (`apps/web`):** Angular (Signals, SCSS, Theme Engine Light/Dark).
* **Hạ tầng Container (Docker):**
  * **PostgreSQL 16 Alpine:** Cơ sở dữ liệu chính.
  * **Redis 7 Alpine:** Caching, Rate Limiting & Quản lý Streak/Leaderboard.
  * **RabbitMQ 3 Management Alpine:** Hàng đợi tin nhắn (Message Broker), xử lý tác vụ ngầm (Email & Audio Processing).

---

## 📋 Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:
1. **Docker Desktop** (bắt buộc, đang bật).
2. **Node.js >= 20.x** & **npm** (cần thiết khi chạy chế độ Hybrid Dev).
3. **Git**.

---

## ⚙️ Thiết lập ban đầu (Initial Setup)

Clone dự án và tạo file môi trường:

```powershell
# 1. Clone repository (nếu chưa có) và chuyển vào thư mục dự án
cd speak-up

# 2. Tạo file .env từ file mẫu .env.example
cp .env.example .env
```

---

## 🚀 Hướng dẫn khởi chạy dự án (Getting Started)

> 🧪 **Xem cẩm nang tự kiểm tra và nghiệm thu chi tiết từng bước:** [docs/guides/verification-guide.md](docs/guides/verification-guide.md)

Dự án hỗ trợ **2 chế độ khởi chạy** tùy theo nhu cầu của bạn:

### 🌟 Cách 1: Chế độ phát triển lai — Hybrid Dev Mode *(Khuyên dùng khi đang code)*

> **Lợi ích:** Hạ tầng (DB, Redis, RabbitMQ) chạy ổn định trong Docker; mã nguồn API và Web chạy trên máy thật để có **Hot-Reload siêu tốc (< 0.5s)** và debug trực tiếp bằng VS Code.

#### Bước 1: Khởi động cụm hạ tầng Docker
Ở thư mục gốc dự án:
```powershell
docker compose up -d postgres redis rabbitmq
```
*(Kiểm tra 3 container đã chạy ổn định bằng lệnh `docker compose ps`)*

#### Bước 2: Chạy Backend NestJS (Terminal 1)
```powershell
cd apps/api
npm install     # Chỉ cần chạy lần đầu
npm run start:dev
```
👉 Backend sẵn sàng tại: **`http://localhost:3000`**

#### Bước 3: Chạy Frontend Angular (Terminal 2)
```powershell
cd apps/web
npm install     # Chỉ cần chạy lần đầu
npm start
```
👉 Frontend sẵn sàng tại: **`http://localhost:8888`**

---

### 📦 Cách 2: Chế độ đóng gói toàn diện — Full Docker Mode *(Dùng để test production / bàn giao)*

> **Lợi ích:** Đóng gói toàn bộ cả Backend API và Hạ tầng vào trong Docker Container. Không cần cài Node.js trên máy host.

Khởi động toàn bộ các dịch vụ bằng 1 lệnh duy nhất:
```powershell
docker compose up -d --build
```

Để theo dõi log của backend:
```powershell
docker compose logs -f api
```

---

## 🌐 Danh mục Cổng truy cập & Tài khoản mặc định

| Dịch vụ | Cổng truy cập (Host) | URL / Địa chỉ | Tài khoản mặc định |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | `8888` | `http://localhost:8888` | - |
| **Backend REST API** | `3000` | `http://localhost:3000` | - |
| **RabbitMQ Web Dashboard** | `15672` | `http://localhost:15672` | User: `admin`<br/>Pass: `admin123` |
| **RabbitMQ AMQP** | `5672` | `localhost:5672` | User: `admin`<br/>Pass: `admin123` |
| **Redis Server** | `6379` | `localhost:6379` | Pass: `speakup_redis_secret` |
| **PostgreSQL Database** | `5432` | `localhost:5432` | User: `postgres`<br/>Pass: `postgres`<br/>DB: `speakup_db` |

---

## 🛠️ Các lệnh Docker thường dùng (Cheat Sheet)

```powershell
# 1. Xem trạng thái các container đang chạy
docker compose ps

# 2. Xem log của một container cụ thể (ví dụ: redis, rabbitmq, api)
docker compose logs -f redis
docker compose logs -f rabbitmq
docker compose logs -f api

# 3. Ping kiểm tra Redis trong container
docker exec -it speakup-redis redis-cli -a speakup_redis_secret ping

# 4. Tạm dừng các container (không xóa container)
docker compose stop

# 5. Khởi động lại sau khi đã stop
docker compose start

# 6. Tắt và xóa container (dữ liệu trong Volumes vẫn được giữ an toàn 100%)
docker compose down

# 7. Tắt và xóa luôn toàn bộ dữ liệu database/volumes (Cẩn trọng!)
docker compose down -v
```

---

## 📁 Cấu trúc Monorepo

```text
speak-up/
├── apps/
│   ├── api/                    # NestJS Backend (REST API, Redis, RabbitMQ, DB)
│   │   ├── Dockerfile          # Multi-stage production Dockerfile
│   │   └── src/
│   └── web/                    # Angular Frontend (Web App & Audio Karaoke)
│       └── src/
├── docs/                       # Tài liệu thiết kế & đặc tả kiến trúc
├── .env.example                # Mẫu cấu hình môi trường
├── .env                        # Biến môi trường cục bộ (không commit)
├── docker-compose.yml          # Điều phối Docker Postgres, Redis, RabbitMQ, API
└── README.md                   # Hướng dẫn dự án (File này)
```
