# Danh sách Tasks / Issues cho GitHub Project

Dưới đây là danh sách các task được phân chia theo từng **Epic** (Nhóm tính năng lớn) và **Tags/Labels** khuyên dùng để bạn dễ dàng tạo các thẻ (Cards) trên GitHub Project / GitHub Issues.

---

## Epic 1: Project Setup & Architecture (Khởi tạo hệ thống)
*Labels: `setup`, `architecture`*

- **[Task 1.1] Khởi tạo Frontend (Angular) và Backend (NestJS)**
  - Tình trạng: Done (Đã hoàn thành)
- **[Task 1.2] Cấu hình môi trường (Gitignore, ESLint, Prettier)**
  - Tình trạng: Done (Đã hoàn thành)
- **[Task 1.3] Thiết lập kết nối TypeORM và Supabase (Backend)**
  - Mô tả: Kết nối NestJS với Supabase qua chuỗi Postgres URL để chạy Code First và cấu hình SDK.
  - Tình trạng: In Progress (Đang thực hiện)

---

## Epic 2: Database & Backend Core (Lõi Backend)
*Labels: `backend`, `database`, `api`*

- **[Task 2.1] Xây dựng các TypeORM Entities**
  - Mô tả: Code các class `Course`, `LessonSet`, `Lesson`, `Transcript`, `UserProgress`, `Profile`. Cho phép TypeORM tự động gen bảng trên Supabase.
- **[Task 2.2] Thiết lập Hệ thống Xác thực (Authentication Guards)**
  - Mô tả: Viết JWT Guard trên NestJS, kết nối với Supabase Auth để bảo vệ các API.
- **[Task 2.3] API Quản lý Khoá học (CRUD)**
  - Mô tả: Các API Get/Post/Put/Delete cho Admin quản lý khóa học và người dùng xem danh sách.
- **[Task 2.4] API Tracking Tiến độ học tập (Progress)**
  - Mô tả: API lưu mốc thời gian đang nghe dở của Audio và ghi nhận số ngày học (Streak).

---

## Epic 3: Frontend - Giao diện chung & Auth
*Labels: `frontend`, `ui`, `auth`*

- **[Task 3.1] Xây dựng Design System (UI Kit)**
  - Mô tả: Định nghĩa màu sắc, typography, và các component dùng chung (Button, Input, Card).
- **[Task 3.2] Xây dựng Layout tổng thể**
  - Mô tả: Code phần Sidebar, Header, và khung bố cục chính cho cả trang Admin và trang Học viên.
- **[Task 3.3] Trang Đăng nhập & Đăng ký**
  - Mô tả: Giao diện form login/register kết nối với Supabase Auth.

---

## Epic 4: Frontend - Các tính năng Effortless English (Quan trọng nhất)
*Labels: `frontend`, `feature`, `core`*

- **[Task 4.1] Trang Danh sách Khoá học & Bài học**
  - Mô tả: Hiển thị các khóa học và các bộ bài học (Lesson Sets). Xử lý logic khóa (Lock) các bài học chưa đủ điều kiện mở.
- **[Task 4.2] Xây dựng Audio Player Tùy chỉnh**
  - Mô tả: Giao diện phát nhạc với các tính năng đặc thù: Tua nhanh lùi 5s, Chỉnh tốc độ phát (0.75x, 1x, 1.25x).
- **[Task 4.3] Tích hợp Interactive Transcript (Lời thoại đồng bộ)**
  - Mô tả: Highlight dòng text đang được đọc bởi Audio. Click vào 1 dòng text để Audio nhảy đến đúng mốc thời gian đó.
- **[Task 4.4] Bảng Thống kê & Gamification (Dashboard)**
  - Mô tả: Đếm chuỗi ngày học liên tục (Streak), đếm tổng giờ nghe và hiển thị huy hiệu (Badges).

---

## Epic 5: Admin CMS (Hệ quản trị)
*Labels: `admin`, `cms`*

- **[Task 5.1] Tích hợp Upload file lên Supabase Storage**
  - Mô tả: Giao diện cho Admin tải lên các file MP3 và lấy đường dẫn URL lưu vào database.
- **[Task 5.2] Giao diện tạo và đồng bộ Transcript**
  - Mô tả: Màn hình giúp Admin nhập nội dung bài đọc và đánh dấu thời gian (start_time, end_time) cho từng câu dễ dàng.
