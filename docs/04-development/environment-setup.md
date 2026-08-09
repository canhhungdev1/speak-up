# 💻 Hướng dẫn Setup Môi trường Phát triển (Environment Setup)

Tài liệu này hướng dẫn cách cài đặt và khởi chạy dự án **SpeakUp** trên máy local.

## 1. Yêu cầu công cụ (Prerequisites)
- **Node.js**: `>= 20.x`
- **npm**: `>= 10.x`
- **Flutter SDK**: `>= 3.x` (Dành cho phát triển ứng dụng di động)
- **Docker & Docker Compose**: (Dành cho việc chạy các services phụ trợ như DB)

## 2. Các bước cài đặt

### Bước 1: Clone Repository & Cài đặt Dependencies
```bash
git clone <repository-url>
cd speak-up

# Cài đặt dependencies cho Monorepo Node.js
npm install
```

### Bước 2: Chạy Backend API (NestJS)
```bash
# Chạy ở chế độ Development (Auto reload)
npx nx serve api
```
API server sẽ chạy tại `http://localhost:3000/api`

### Bước 3: Chạy Web App (Angular)
```bash
npx nx serve web
```
Web app sẽ mở tại `http://localhost:4200`

### Bước 4: Chạy Mobile App (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

## 3. Chạy E2E Tests
```bash
# Test API E2E
npx nx e2e api-e2e

# Test Web E2E
npx nx e2e web-e2e
```
