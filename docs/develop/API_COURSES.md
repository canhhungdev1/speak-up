# API Specification: Courses Module

Tài liệu này đặc tả các API liên quan đến việc quản lý và truy xuất Khóa học (Course).
Tất cả các Endpoint dưới đây đều yêu cầu xác thực JWT (truyền qua header `Authorization: Bearer <token>`).

## 1. Tạo Khóa học mới (Create Course)
- **Endpoint**: `POST /courses`
- **Mô tả**: Tạo một bản ghi khóa học mới vào cơ sở dữ liệu.
- **Request Body** (JSON):
```json
{
  "title": "String (Required) - Tên khóa học",
  "description": "String (Optional) - Mô tả ngắn gọn",
  "level": "String (Required) - Trình độ (Beginner, Intermediate, Advanced)",
  "coverImageUrl": "String (Optional) - URL ảnh bìa"
}
```

- **Response (201 Created)**:
```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "level": "...",
  "coverImageUrl": "...",
  "createdAt": "datetime"
}
```

## 2. Lấy danh sách Khóa học (Get All Courses)
- **Endpoint**: `GET /courses`
- **Mô tả**: Lấy toàn bộ danh sách khóa học để hiển thị trên trang Explore. Tương lai có thể thêm phân trang (Pagination).
- **Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "level": "...",
    "coverImageUrl": "...",
    "createdAt": "datetime"
  }
]
```

## 3. Lấy chi tiết Khóa học (Get Course by ID)
- **Endpoint**: `GET /courses/:id`
- **Mô tả**: Lấy thông tin chi tiết một khóa học, bao gồm cả các chương (Lesson Sets) và bài học (Lessons) lồng bên trong. Dùng cho trang Course Detail.
- **Response (200 OK)**:
```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "level": "...",
  "coverImageUrl": "...",
  "createdAt": "datetime",
  "lessonSets": [
    {
      "id": "uuid",
      "title": "Tên chương (ví dụ: Chapter 1: Greetings)",
      "orderIndex": 1,
      "lessons": [
        {
          "id": "uuid",
          "title": "Tên bài học",
          "type": "MAIN_AUDIO",
          "audioUrl": "...",
          "transcriptJson": [...]
        }
      ]
    }
  ]
}
```
