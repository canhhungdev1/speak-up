# Roadmap Triển Khai Dự Án: Website Effortless English

Tài liệu này vạch ra lộ trình các bước tiếp theo để hiện thực hóa dự án từ bản thiết kế hệ thống (Business Analysis, Usecase, ERD) đến một sản phẩm hoàn chỉnh.

## Giai đoạn 1: Thiết lập Kiến trúc & Nền tảng (Foundation)
- **1.1. Khởi tạo mã nguồn Frontend (Angular):** Thiết lập Angular CLI trong thư mục `source/frontend`, cấu hình Routing, Service.
- **1.2. Khởi tạo mã nguồn Backend (NestJS):** Thiết lập NestJS CLI trong thư mục `source/backend`, cấu hình module kết nối Database.
- **1.3. Khởi tạo & Cấu hình Database:** Thiết lập kết nối PostgreSQL (sẵn sàng cho Supabase trên production) và chạy migration tạo các bảng theo ERD.
- **1.4. Tích hợp Xác thực (Authentication):** Cài đặt Google OAuth logic ở cả Angular (nhận Token) và NestJS (Xác thực và cấp JWT).
- **1.5. Thiết lập Storage:** Cấu hình module Supabase Storage trong NestJS API để quản lý upload file Audio (mp3).

## Giai đoạn 2: Phát triển Core Tính năng (Backend & Frontend)
- **2.1. Quản trị (Admin Panel):**
  - Xây dựng giao diện Admin (Angular) và REST API (NestJS) để CRUD Khóa học, Bộ bài học.
  - Viết công cụ upload MP3 và đồng bộ file Transcript (chèn Timestamp cho từng dòng).
- **2.2. Trình phát Audio (Audio Player):** 
  - Xây dựng component Audio Player trên Angular: Phát, dừng, tua tới/lui (5s, 10s), thay đổi tốc độ (0.75x, 1x, 1.25x...).
  - Gọi API NestJS để lưu và tự động khôi phục vị trí đang nghe dang dở (Resume position).
- **2.3. Lời thoại tương tác (Interactive Transcript):**
  - Hiển thị text đồng bộ với thời gian thực của Audio đang phát.
  - Xử lý sự kiện click vào câu văn bản để tua Audio tới đúng mốc thời gian đó.

## Giai đoạn 3: Logic Nghiệp vụ & Gamification (Business Logic)
- **3.1. Theo dõi Tiến độ (Deep Learning Logic):**
  - API xử lý logic điểm danh (Check-in) hàng ngày và tính toán Streak.
  - Thuật toán kiểm tra điều kiện mở khóa bài mới (phải đạt đủ 7 ngày nghe/set).
- **3.2. Hệ thống Thảo luận:** Xây dựng API và giao diện tính năng bình luận dưới mỗi bài học.
- **3.3. Tối ưu UX/UI & Mobile:** Đảm bảo giao diện UI đẹp, sống động, mượt mà và tích hợp MediaSession API để nghe khi tắt màn hình điện thoại (Mobile First).

## Giai đoạn 4: Kiểm thử & Triển khai (Testing & Deployment)
- **4.1. Kiểm thử toàn diện:** Test luồng đăng nhập, logic khóa/mở bài học 7 ngày, test Audio trên các trình duyệt/thiết bị di động.
- **4.2. Triển khai (Deploy):** Đẩy mã nguồn Frontend và Backend lên server Production và kết nối hoàn chỉnh với Supabase (Database & Storage).
