# Phân tích Usecase (Luồng chức năng người dùng)

Sau khi đã nắm rõ triết lý hệ thống, chúng ta cần xác định rõ các Tác nhân (Actors) sẽ tham gia vào hệ thống và họ có thể làm được những hành động gì.

## 1. Các Tác nhân (Actors)
1. **Guest (Khách vãng lai):** Người dùng chưa đăng nhập.
2. **User (Học viên):** Người dùng đã đăng ký và đăng nhập.
3. **Admin (Quản trị viên):** Người có quyền cao nhất, quản lý nội dung.

## 2. Danh sách Usecase theo Actor

### 2.1. Usecase của Guest
- **UC-G01:** Đăng ký tài khoản (Sign up bằng Email/Password hoặc Google).
- **UC-G02:** Đăng nhập (Login).
- **UC-G03:** Quên mật khẩu (Reset password qua email).
- **UC-G04:** Xem danh sách giới thiệu khóa học (Landing page) nhưng không thể vào chi tiết bài nghe.

### 2.2. Usecase của User (Học viên)
- **UC-U01 - Quản lý hồ sơ:** Đổi mật khẩu, cập nhật thông tin cá nhân (Tên, Ảnh đại diện).
- **UC-U02 - Xem danh sách khóa học:** Xem các khóa học và các Module (Lesson Sets) bên trong.
- **UC-U03 - Học qua Audio Player:**
  - Phát/Tạm dừng Audio.
  - Tua lùi/Tua tới 5 giây.
  - Thay đổi tốc độ phát (0.75x, 1x, 1.25x).
- **UC-U04 - Tương tác Transcript:**
  - Xem lời thoại chạy đồng bộ theo Audio.
  - Nhấp vào một câu thoại bất kỳ để trình phát nhảy tới đoạn Audio tương ứng.
- **UC-U05 - Cập nhật tiến độ học tập (Progress):**
  - Hệ thống tự động ghi nhận tổng thời gian nghe của mỗi bài học.
  - Ghi nhận ngày học (Check-in) để tính "Streak" (Chuỗi ngày học liên tục).
- **UC-U06 - Mở khóa bài học (Unlock System):**
  - Xem điều kiện mở khóa bài học kế tiếp (Ví dụ: Phải hoàn thành đủ 7 ngày nghe ở bài hiện tại).

### 2.3. Usecase của Admin (Quản trị viên CMS)
- **UC-A01 - Quản lý Khóa học (Courses):** Thêm, Sửa, Xóa khóa học.
- **UC-A02 - Quản lý Bộ bài học (Lesson Sets):** Tạo các Module học (Ví dụ: A Kiss, Day of the Dead).
- **UC-A03 - Quản lý Bài học chi tiết (Lessons):**
  - Tạo các bài: Main, Vocab, Mini-Story, POV.
  - Upload file Audio lên hệ thống (Supabase Storage).
- **UC-A04 - Quản lý Transcript Sync:** Cập nhật nội dung chữ (Text) và mốc thời gian (Timestamp) để làm Interactive Transcript.
- **UC-A05 - Quản lý người dùng:** Xem danh sách User, cấm (Ban) hoặc cấp quyền Admin cho người khác.

---

*Ghi chú: Usecase này sẽ làm cơ sở trực tiếp để chúng ta thiết kế Sơ đồ Cơ sở dữ liệu (ERD) và xây dựng REST API trong bước tiếp theo.*
