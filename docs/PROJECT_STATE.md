# Trạng Thái Dự Án (Project State)

> File này đóng vai trò là "Bộ Nhớ Dài Hạn" (Long-term Memory) cho AI. 
> **AI CẦN ĐỌC FILE NÀY MỖI LẦN BẮT ĐẦU PHIÊN LÀM VIỆC MỚI.**

## 1. Thông tin chung
- **Tên dự án:** SpeakUp - Effortless English Platform.
- **Tech Stack:** Angular 18 (Standalone), NestJS, PostgreSQL, Prisma.
- **Mục tiêu chính:** Luyện nghe tiếng Anh chuyên sâu (Audio MP3) và theo dõi tiến trình (Streak).

## 2. Tiến độ hiện tại (Roadmap Progress)

### ✅ Đã hoàn thành (Done)
- **Phase 1: Foundation**
  - Cấu trúc thư mục Monorepo (Frontend/Backend).
  - Kết nối PostgreSQL qua Prisma.
  - Xác thực người dùng (Google OAuth 2.0 + JWT).
  - Base Layout đồng nhất (Topbar, Sidebar động giữa Admin/Learner) + Dark Mode toàn cục.
  - Viết file `README.md` và các `.env.example`.

- **Phase 2.1: Admin Panel (Quản trị nội dung)**
  - Quản lý Khóa học (Course CRUD).
  - Quản lý Bộ bài học (Lesson Set) và Bài học MP3 (Lesson). Database Cascade Delete.

- **Phase 2.2: Learner Dashboard & Audio Player**
  - Xây dựng màn hình danh sách Khóa học cho Học viên (`/dashboard`).
  - Xây dựng Component Trình phát nhạc (Audio Player) sticky ở dưới cùng màn hình.

- **Phase 3: Integration & Advanced Features**
  - Tích hợp API thật cho màn hình Học viên (Lấy dữ liệu động từ Backend thay vì Mock Data).
  - Nâng cấp màn hình Quản lý Khóa học Admin: Cập nhật CSDL và giao diện Kéo thả (Drag & Drop bằng Angular CDK) để sắp xếp thứ tự khóa học.

### 🚧 Đang thực hiện (In Progress)
- **Phase 3.3: Learner Room (Phòng học chi tiết)**
  - Tích hợp Audio Player với các bài học cụ thể (MAIN, VOCAB, MINI_STORY).

### ❌ Chưa bắt đầu (To Do)
- Tool Admin upload & đồng bộ Transcript (chèn Timestamp).
- Hệ thống theo dõi điểm danh (Daily Check-in) & mở khóa chuỗi (Streak 7 ngày).
- Lời thoại tương tác (Interactive Transcript) ở Learner UI.

## 3. Kiến trúc CSDL Hiện Tại (Database Core)
- Bảng `User`: Lưu thông tin học viên và quyền (`LEARNER` / `ADMIN`).
- Bảng `Course` (1 - N) `LessonSet`.
- Bảng `LessonSet` (1 - N) `Lesson` (Loại: MAIN, VOCAB, MINI_STORY, POV).

## 4. Ghi chú quan trọng (Dev Notes)
- Dự án ưu tiên giao diện **Premium** (Dark Mode xịn sò, Micro-animations, Variable CSS chuẩn).
- Không dùng Bootstrap, hạn chế Tailwind (nếu không cần thiết), tự viết SCSS modules để quản lý linh hoạt.
- Angular dùng mô hình Standalone Component 100%. Routing được thiết lập lazy load.
- File cấu hình Backend nằm trong `source/backend/.env`.
