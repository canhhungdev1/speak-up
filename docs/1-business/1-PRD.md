# Product Requirements Document (PRD)

## 1. Tổng quan Dự án (Project Overview)
**Tên dự án:** SpeakUp (Hệ thống học Effortless English)
- **Mô tả:** SpeakUp là nền tảng Web Application chuyên biệt để học tiếng Anh theo phương pháp Effortless English của thầy A.J. Hoge. Ứng dụng tập trung vào kỹ năng Nghe và Phản xạ thông qua các bộ bài học (Lesson Sets) bao gồm: Main Audio, Vocabulary, Mini-Story và Point of View (POV).
- **Mục tiêu kinh doanh:** Tạo ra một môi trường học tập có tính tương tác cao, giúp người dùng dễ dàng theo dõi tiến độ, duy trì thói quen học tập (Streak) và tương tác với bài nghe bằng tính năng Smart Highlight.

## 2. Đối tượng Người dùng (User Personas)
- **Học viên (Student):** Những người muốn cải thiện kỹ năng nghe nói tiếng Anh. Cần giao diện dễ sử dụng, trực quan, có thể học mọi lúc mọi nơi trên cả Mobile và Desktop.
- **Quản trị viên (Admin):** Người quản lý nội dung khóa học, cập nhật từ vựng, transcript và theo dõi dữ liệu người dùng.

## 3. Yêu cầu Chức năng (Functional Requirements)
### 3.1. Authentication & Authorization
- Đăng nhập/Đăng ký qua Email/Password và OAuth (Google).
- Quản lý Profile cá nhân (Avatar, Tên, Mục tiêu học tập).

### 3.2. Dashboard & Progress Tracking
- Thể hiện thống kê học tập: Số ngày học liên tiếp (Streak), số giờ đã học.
- Gợi ý bài học tiếp theo (Continue Learning).
- Biểu đồ mục tiêu trong tuần (Weekly Goal Chart).

### 3.3. Course & Lesson Management
- Trang Khám phá (Explore): Hiển thị toàn bộ khóa học theo dạng lưới (Grid).
- Trang Chi tiết Khóa học: Liệt kê các Lesson Sets dạng Accordion.

### 3.4. Learning Interface (Lesson Player)
- **Global Audio Player**: Thanh phát nhạc nổi (Sticky) bám đáy màn hình. Hỗ trợ Play, Pause, Seek, thay đổi Tốc độ (0.75x, 1x, 1.25x).
- **Chế độ Main Audio**: Hiển thị/Ẩn Transcript gốc.
- **Chế độ Vocabulary**: Hiển thị danh sách từ vựng dạng Flashcard.
- **Chế độ Mini-Story**: Tự động bôi sáng (Highlight) dòng text đang được đọc theo thời gian thực (Karaoke).

## 4. Yêu cầu Phi chức năng (Non-Functional Requirements)
- **Performance:** Thời gian tải trang ban đầu (FCP) dưới 1.5 giây. Chuyển trang mượt mà nhờ SPA (Single Page Application).
- **Responsive:** Hoạt động hoàn hảo trên Mobile, Tablet và Desktop. Áp dụng Mobile-first design.
- **Availability:** Hệ thống đảm bảo Uptime 99.9%.
- **Theme:** Hỗ trợ Dark Mode / Light Mode.

## 5. Các mốc Phát triển (Milestones)
- **Phase 1:** Hoàn thiện UI/UX (Frontend Angular) với Mock Data. (✅ Hoàn thành)
- **Phase 2:** Thiết kế DB (Supabase) và phát triển API (NestJS).
- **Phase 3:** Tích hợp API vào Frontend.
- **Phase 4:** Kiểm thử (Testing) và Triển khai (Deployment).
