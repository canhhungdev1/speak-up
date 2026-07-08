# SpeakUp - Effortless English Platform

SpeakUp là một hệ thống ứng dụng Web (Fullstack) chuyên biệt dành cho việc học tiếng Anh theo phương pháp **Effortless English**. Hệ thống cung cấp trải nghiệm học tập hiện đại, tập trung vào việc luyện nghe sâu (Deep Learning) thông qua các Audio MP3 và hệ thống quản lý học tập (LMS).

## 🚀 Cấu trúc Công nghệ (Tech Stack)
Dự án được cấu trúc theo dạng Monorepo đơn giản:
- **Frontend:** Angular 18 (Standalone Components, SCSS, RxJS).
- **Backend:** NestJS, Prisma ORM.
- **Database:** PostgreSQL (Có thể dùng Supabase).
- **Authentication:** Google OAuth 2.0 (JWT Token).

---

## 🛠️ Yêu cầu môi trường (Prerequisites)
Đảm bảo bạn đã cài đặt các công cụ sau trên máy:
1. **Node.js** (Phiên bản >= 18.x). Lệnh kiểm tra: `node -v`
2. **Docker Desktop** (Để chạy nhanh Database PostgreSQL). Lệnh kiểm tra: `docker -v`
3. **Angular CLI** (Cài đặt toàn cục). Lệnh kiểm tra: `ng version`
   - *Nếu chưa có:* Chạy lệnh `npm install -g @angular/cli`
4. **NestJS CLI** (Tùy chọn, Cài đặt toàn cục).
   - *Nếu chưa có:* Chạy lệnh `npm install -g @nestjs/cli`

---

## 🏃 Hướng dẫn chạy dự án (How to run)

Để hệ thống hoạt động hoàn chỉnh, bạn cần khởi chạy lần lượt 3 Terminal riêng biệt theo đúng thứ tự: **Database -> Backend -> Frontend**.

### Bước 1: Khởi động Database (PostgreSQL)
Mở Terminal 1 tại thư mục gốc của dự án (`speak-up/`) và chạy lệnh:
```bash
docker-compose up -d
```
*Lệnh này sẽ tải image PostgreSQL và chạy ở background (cổng `5432`).*

### Bước 2: Khởi động Backend API (NestJS)
Mở Terminal 2 và di chuyển vào thư mục `source/backend/`:
```bash
cd source/backend
```

**Cài đặt thư viện và cấu hình biến môi trường:**
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo file .env từ file mẫu
copy .env.example .env 
# (Nhớ mở file .env lên và điền các thông tin bảo mật nếu cần)

# 3. Cập nhật schema Prisma vào Database (Tạo bảng)
npx prisma db push

# 3. (Tùy chọn) Chạy seed dữ liệu mẫu nếu có
# npx prisma db seed
```

**Chạy server Backend:**
```bash
npm run start:dev
```
*Backend sẽ khởi chạy và lắng nghe tại: `http://localhost:3000`*

### Bước 3: Khởi động Frontend (Angular)
Mở Terminal 3 và di chuyển vào thư mục `source/frontend/`:
```bash
cd source/frontend
```

**Cài đặt thư viện và chạy Web:**
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Chạy server Frontend
npm start
```
*Frontend sẽ tự động biên dịch và hiển thị tại: `http://localhost:4200`*

---

## 🔐 Đăng nhập & Phân quyền
- Sau khi vào `http://localhost:4200`, bạn hãy sử dụng tính năng **Đăng nhập bằng Google**.
- **Quyền Admin:** Hiện tại, để vào trang Quản trị (`/admin`), tài khoản của bạn cần có `role = 'ADMIN'`. Bạn có thể dùng phần mềm như *DBeaver* hoặc *Prisma Studio* (`npx prisma studio` ở thư mục backend) để vào bảng `users` và sửa cột `role` của tài khoản bạn vừa đăng nhập thành `ADMIN`.

## 📁 Cấu trúc Thư mục chính
```
speak-up/
├── docker-compose.yml     # File cấu hình chạy DB nhanh bằng Docker
├── docs/                  # Tài liệu thiết kế, ERD, Roadmap, Feature Specs
└── source/                # Toàn bộ mã nguồn dự án
    ├── backend/           # Mã nguồn NestJS API
    └── frontend/          # Mã nguồn Angular UI
```
