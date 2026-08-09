# 💻 Hướng dẫn Khởi chạy & Phát triển Dự án SpeakUp

Tài liệu này hướng dẫn chi tiết từ A-Z cách cài đặt môi trường, cấu hình và khởi chạy toàn bộ các thành phần của hệ thống **SpeakUp** (Backend NestJS, Web Angular, Mobile Flutter).

---

## 📋 1. Yêu cầu Hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

- **Node.js**: `>= 20.x` (Khuyên dùng v22 LTS)
- **npm**: `>= 10.x`
- **Git**: Khởi tạo và quản lý phiên bản
- **Flutter SDK**: `>= 3.x` *(Dành riêng cho việc phát triển ứng dụng di động `mobile/`)*
- **Docker & Docker Compose**: *(Tùy chọn cho PostgreSQL Database)*

---

## 🚀 2. Các bước Cài đặt Ban đầu

### Bước 2.1: Clone Repository
```bash
git clone <repository-url>
cd speak-up
```

### Bước 2.2: Cài đặt Dependencies cho Monorepo
```bash
npm install --legacy-peer-deps
```

### Bước 2.3: Cấu hình File Môi trường (`.env`)
Tạo file `.env` tại thư mục gốc dự án (nếu chưa có) và bổ sung nội dung sau:

```env
# Server Configuration
PORT=3000

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID="334154088956-iv10ov32isau8o2c0mbt85qt3cf6dgkm.apps.googleusercontent.com"

# JWT Authentication Secrets
JWT_SECRET="speakup_super_secret_jwt_key_2026"
JWT_EXPIRES_IN="7d"

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/speakup_db?schema=public"
```

### Bước 2.4: Khởi tạo Prisma ORM Client
```bash
npm run prisma:generate
```

---

## ⚡ 3. Hướng dẫn Khởi chạy Dự án

### 🔹 Cách 1: Chạy đồng thời cả Backend API & Web App (Nhanh nhất)
Chạy lệnh sau tại thư mục gốc để mở đồng thời cả 2 dịch vụ:

```bash
npm run start:all
```

---

### 🔹 Cách 2: Chạy độc lập từng ứng dụng

#### 1. Khởi chạy Backend API (NestJS)
```bash
npm run start:api
```
- **Địa chỉ API:** `http://localhost:3000/api/v1`
- **Auth Endpoint:** `POST http://localhost:3000/api/v1/auth/google`

#### 2. Khởi chạy Web App (Angular)
```bash
npm run start:web
```
- **Địa chỉ Web App:** `http://localhost:4200`
- Trình duyệt sẽ hiển thị trang Đăng nhập SpeakUp tích hợp nút **"Sign in with Google"**.

#### 3. Khởi chạy Mobile App (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🛠️ 4. Công cụ Quản lý Database & Utility Scripts

| Lệnh Script | Mô tả công dụng |
| :--- | :--- |
| `npm run start:all` | Khởi chạy đồng thời NestJS API & Angular Web App |
| `npm run start:api` | Khởi chạy duy nhất Backend API (Port 3000) |
| `npm run start:web` | Khởi chạy duy nhất Web App (Port 4200) |
| `npm run prisma:studio` | Mở giao diện Web quản lý Database trực quan (Port 5555) |
| `npm run prisma:generate` | Tạo lại TypeScript Types cho Prisma Client |

---

## 🔍 5. Địa chỉ Truy cập Nhanh (Quick Links)

| Dịch vụ | URL Local | Mô tả |
| :--- | :--- | :--- |
| 🌐 **Web App** | [http://localhost:4200](http://localhost:4200) | Giao diện luyện nói & Đăng nhập Google |
| 🛠️ **Backend API** | [http://localhost:3000/api/v1](http://localhost:3000/api/v1) | RESTful API Server |
| 🗄️ **Prisma Studio** | [http://localhost:5555](http://localhost:5555) | Giao diện xem/sửa CSDL trực tiếp |

---

## ❓ 6. Xử lý Sự cố Thường gặp (Troubleshooting)

### Q1: Lỗi `ERESOLVE could not resolve peer dependency` khi `npm install`
- **Khắc phục:** Sử dụng cờ `--legacy-peer-deps`:
  ```bash
  npm install --legacy-peer-deps
  ```

### Q2: Cổng `3000` hoặc `4200` bị chiếm dụng (Port in use)
- **Khắc phục:** Đóng tiến trình đang chiếm cổng hoặc đổi cổng `PORT` trong file `.env`.

### Q3: Nút "Sign in with Google" không hiển thị hoặc báo lỗi Origin
- **Khắc phục:** Đảm bảo bạn đang truy cập qua `http://localhost:4200` (Origin đã đăng ký trong Google Cloud Console).
