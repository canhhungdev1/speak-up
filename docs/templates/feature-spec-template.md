# [Tên Tính Năng]

## 1. Mô tả chung (Overview)
- **Mục tiêu:** Tính năng này giải quyết vấn đề gì? Mang lại giá trị gì cho người dùng (Học viên)?
- **Phạm vi (Scope):** Những yêu cầu nào nằm trong tính năng này, những phần nào sẽ để dành cho phase sau.
- **Đối tượng (Actors):** Người dùng chưa đăng nhập, Học viên, Admin...

## 2. Luồng nghiệp vụ (User Flow)
Mô tả các bước tương tác của người dùng. Có thể sử dụng Mermaid Sequence Diagram để vẽ luồng dữ liệu.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Angular)
    participant Backend (NestJS)
    participant Database

    User->>Frontend (Angular): Thực hiện hành động
    Frontend (Angular)->>Backend (NestJS): Gửi request API
    Backend (NestJS)->>Database: Truy vấn/Lưu dữ liệu
    Database-->>Backend (NestJS): Trả kết quả
    Backend (NestJS)-->>Frontend (Angular): Trả Response JSON
    Frontend (Angular)-->>User: Cập nhật giao diện
```

## 3. Phân tích thiết kế (Technical Design)

### 3.1. Thiết kế Giao diện (Frontend)
- **Các Component cần xây dựng/chỉnh sửa:** (Ví dụ: `LoginComponent`, `AudioPlayerComponent`)
- **State Management:** (Dữ liệu nào cần lưu ở Service/Store)
- **Routing:** (URL của trang này là gì?)

### 3.2. Thiết kế API (Backend)
- **Các API Endpoints:**
  - `GET /api/v1/danh-sach`: Mô tả ngắn gọn
  - `POST /api/v1/tao-moi`: Mô tả ngắn gọn
- **Services / Modules cần thêm:**

## 4. Thiết kế Cơ sở dữ liệu (Database Schema)
Định nghĩa các bảng, các trường dữ liệu và mối quan hệ giữa chúng.

```mermaid
erDiagram
    USERS ||--o{ PROGRESS : tracks
    USERS {
        uuid id PK
        string email
        string password_hash
    }
    PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid lesson_id FK
        boolean is_completed
    }
```

## 5. Xử lý ngoại lệ (Edge Cases & Error Handling)
- **Trường hợp mất mạng / API lỗi:** Hệ thống hiện thông báo gì?
- **Trường hợp dữ liệu không hợp lệ:** Validate ở FE và BE ra sao?

## 6. Checklist (Definition of Done)
- [ ] Phân tích thiết kế xong
- [ ] Thiết kế Database
- [ ] Code Backend API & Test
- [ ] Code Frontend UI
- [ ] Ghép API vào Frontend
- [ ] Hoàn thành & Kiểm thử thành công
