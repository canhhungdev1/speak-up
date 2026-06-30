# SpeakUp Project Roadmap 🚀

Bản đồ lộ trình phát triển hệ thống học tiếng Anh Effortless English.

---

## Phase 1: Foundation & UI (Đã hoàn thành ✅)
Xây dựng nền móng kiến trúc Frontend và thiết kế toàn bộ giao diện người dùng.

- [x] Thiết lập dự án Angular 17.
- [x] Thiết kế Hệ thống màu sắc (Design System) và biến SCSS.
- [x] Chức năng chuyển đổi Dark / Light Mode.
- [x] Xây dựng Landing Page chào mừng.
- [x] Xây dựng Giao diện Đăng nhập / Đăng ký (Split-screen).
- [x] Xây dựng App Layout (Sidebar & Topbar).
- [x] Xây dựng Dashboard (Biểu đồ Weekly Goal, Thẻ Continue Learning).
- [x] Xây dựng trang Explore (Danh sách khóa học).
- [x] Xây dựng trang Course Details (Chương trình học dạng Accordion).
- [x] Xây dựng **Lesson Player** (Trái tim ứng dụng):
  - [x] Sticky Audio Player bám đáy màn hình.
  - [x] Chế độ Main Audio (Có thể Ẩn/Hiện Transcript).
  - [x] Chế độ Vocabulary (Giao diện Flashcards hiện đại).
  - [x] Chế độ Mini-Story (Smart Highlight / Karaoke text tự động chạy theo Audio).

---

## Phase 2: Database & Backend Core (Đang thực hiện ⏳)
Xây dựng trái tim xử lý nghiệp vụ, API và cơ sở dữ liệu độc lập.

- [x] Cấu hình Local Database bằng Docker (PostgreSQL).
- [x] Khởi tạo dự án NestJS (Thư mục `/backend`).
- [x] Thiết lập Prisma ORM & Schema (`users`, `courses`, `lessons`, `progress`).
- [ ] Tích hợp Supabase Auth Guard vào NestJS để xác thực người dùng.
- [ ] Phát triển các Modules & API cốt lõi:
  - [ ] Auth Module (Đồng bộ User).
  - [ ] Courses Module (Lấy danh sách khóa học).
  - [ ] Progress Module (Lưu tiến độ Audio & Tính toán Streak).

---

## Phase 3: Integration & Real Data (Sắp tới 📅)
Kết nối Frontend và Backend để hệ thống chạy với dữ liệu thật.

- [ ] Xóa bỏ toàn bộ Mock Data trên Angular.
- [ ] Viết các Service gọi API bằng HttpClient trong Angular.
- [ ] Đẩy file Audio thật và Ảnh bìa khóa học lên Storage (Supabase/S3).
- [ ] Hoàn thiện luồng Đăng nhập (Frontend -> Supabase Auth -> Backend).

---

## Phase 4: Admin CMS & Analytics (Tương lai 🔮)
Hệ thống quản trị nội dung dành cho Admin.

- [ ] Giao diện Thêm/Sửa/Xóa Khóa học.
- [ ] Giao diện Upload file Audio và tự động trích xuất độ dài (Duration).
- [ ] Công cụ tạo file Transcript (Mapping thời gian với câu thoại) dễ dàng.
- [ ] Bảng điều khiển (Dashboard) xem thống kê lượng người dùng.

---

## Phase 5: Mở rộng (Tương lai xa 🚀)
- [ ] Chấm điểm phát âm bằng AI (Speech-to-Text).
- [ ] Phiên bản Mobile App (React Native / Flutter).
