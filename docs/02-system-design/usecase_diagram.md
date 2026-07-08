# Sơ đồ Usecase (Usecase Diagram)

Dựa trên các yêu cầu từ file phân tích nghiệp vụ, dưới đây là sơ đồ Usecase cho hệ thống website học tiếng Anh Effortless English.

## 1. Biểu đồ Usecase (Sử dụng Mermaid)

```mermaid
flowchart LR
    %% Định nghĩa Actors
    Guest([Khách])
    Learner([Người học])
    Admin([Quản trị viên])

    %% Kế thừa Actor
    Learner -.->|Kế thừa| Guest

    %% Subgraph: Quản lý Tài khoản
    subgraph Account_System [Hệ thống Tài khoản]
        direction TB
        UC1(Đăng nhập / Đăng ký bằng Google)
    end
    Guest --> UC1

    %% Subgraph: Trải nghiệm học tập (Dành cho Người học)
    subgraph Learning_System [Trải nghiệm Học tập]
        direction TB
        UC4(Xem danh sách Khóa học & Bộ bài học)
        UC5(Phát & Tương tác Audio)
        UC6(Tương tác với Transcript)
        UC7(Xem thống kê & Tiến độ)
        UC8(Thảo luận / Bình luận)
        
        %% Chi tiết các tính năng bên trong (Include/Extend)
        UC5_1(Chỉnh tốc độ phát)
        UC5_2(Tua tiến/lùi thời gian)
        UC5_3(Tiếp tục từ vị trí đang nghe)
        UC6_1(Click vào câu để chuyển Audio đến mốc đó)
        UC7_1(Cập nhật chuỗi Streak)
        UC7_2(Mở khóa Bộ bài học mới)
        
        UC5 -.->|include| UC5_1
        UC5 -.->|include| UC5_2
        UC5 -.->|include| UC5_3
        UC6 -.->|include| UC6_1
        UC7 -.->|include| UC7_1
        UC7 -.->|include| UC7_2
    end
    
    Learner --> UC4
    Learner --> UC5
    Learner --> UC6
    Learner --> UC7
    Learner --> UC8

    %% Subgraph: Hệ thống Quản trị (Dành cho Admin)
    subgraph Admin_System [Hệ thống Quản trị]
        direction TB
        UC9(Quản lý Khóa học & Bộ bài học)
        UC10(Quản lý Media & Upload)
        UC11(Đồng bộ mốc thời gian Transcript)
        UC12(Quản lý Người dùng & Bình luận)
    end
    
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
```

## 2. Chi tiết các Usecase Chính

### 2.1. Phía Người học (Learner)
*   **Phát & Tương tác Audio:** Đây là usecase cốt lõi. Người dùng sẽ sử dụng audio player chuyên dụng với khả năng tùy chỉnh tốc độ, tua audio để phản xạ nhanh trong các bài Mini-Story, và hệ thống tự lưu mốc thời gian để họ nghe tiếp khi quay lại.
*   **Tương tác với Transcript:** Người dùng đọc văn bản chạy đồng bộ với audio và có thể chủ động bấm vào đoạn văn bản chưa nghe rõ để audio lùi đúng về câu đó.
*   **Xem thống kê & Tiến độ:** Người dùng theo dõi Streak học liên tục, số giờ nghe, đồng thời hệ thống tự động kiểm tra điều kiện (nghe 7 ngày/set) trước khi cho phép họ mở khóa bài mới.
*   **Thảo luận / Bình luận:** Người dùng có thể để lại bình luận dưới mỗi bài học, tương tác và đặt câu hỏi để kết nối với cộng đồng người học khác.

### 2.2. Phía Quản trị viên (Admin)
*   **Quản lý Khóa học & Bộ bài học:** Tạo các course như Original, Power English, sau đó tạo các Lesson Set (bài học) bên trong.
*   **Quản lý Media & Upload:** Tải âm thanh (mp3) lên hệ thống lưu trữ (Supabase Storage).
*   **Đồng bộ mốc thời gian Transcript:** Công cụ riêng giúp Admin ghép mốc thời gian (timestamp) vào văn bản một cách dễ dàng, giúp tính năng Interactive Transcript hoạt động.
*   **Quản lý Người dùng & Bình luận:** Theo dõi, phân quyền tài khoản người dùng và kiểm duyệt các bình luận trong hệ thống.
