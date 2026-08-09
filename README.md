# 🎙️ SpeakUp — Platform Luyện nói & Đánh giá phát âm

**SpeakUp** là nền tảng hỗ trợ người dùng luyện phát âm và giao tiếp với sự trợ giúp của AI. Hệ thống được phát triển theo mô hình **Monorepo** với kiến trúc đa nền tảng (Backend, Web, Mobile).

---

## 🏗️ Cấu trúc Workspace

- 🛠️ **Backend API (`api/`):** Xây dựng bằng **NestJS**, xử lý Business logic, RESTful API và tích hợp AI.
- 🌐 **Web App (`web/`):** Xây dựng bằng **Angular**, giao diện tương tác trên trình duyệt.
- 📱 **Mobile App (`mobile/`):** Xây dựng bằng **Flutter**, ứng dụng di động cho iOS & Android.
- 🧪 **E2E Testing (`api-e2e/`, `web-e2e/`):** Bộ test tự động toàn trình cho API và Web.

---

## 📚 Tài liệu dự án (Documentation)

Toàn bộ tài liệu thiết kế hệ thống, kiến trúc, API guidelines và hướng dẫn phát triển được lưu trữ tại thư mục [`docs/`](./docs/README.md).

- 🏛️ [Tài liệu Kiến trúc Hệ thống](./docs/01-architecture/overview.md)
- 📊 [Sơ đồ Hệ thống (Mermaid Diagram)](./docs/01-architecture/system-diagram.md)
- 🔌 [Quy chuẩn RESTful API](./docs/02-api/api-guidelines.md)
- 💻 [Hướng dẫn Setup Môi trường Dev](./docs/04-development/environment-setup.md)

---

## 🚀 Quick Start

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Khởi chạy Ứng dụng
```bash
# Backend NestJS API (http://localhost:3000)
npx nx serve api

# Web Angular App (http://localhost:4200)
npx nx serve web

# Mobile Flutter App
cd mobile && flutter run
```
