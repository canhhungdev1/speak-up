# 🔌 API Design Guidelines & Standards

Tài liệu này quy định chuẩn thiết kế RESTful API áp dụng cho NestJS Backend (`api/`).

## 1. HTTP Methods & Endpoints Format
- Endpoints sử dụng danh từ số nhiều, chữ thường, cách nhau bằng dấu gạch ngang (`kebab-case`).
- Bắt buộc prefix phiên bản: `/api/v1/...`

| Method | Endpoint ví dụ | Mục đích |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Lấy danh sách tài nguyên |
| `GET` | `/api/v1/users/:id` | Lấy chi tiết 1 tài nguyên |
| `POST` | `/api/v1/users` | Tạo mới tài nguyên |
| `PUT / PATCH` | `/api/v1/users/:id` | Cập nhật tài nguyên |
| `DELETE` | `/api/v1/users/:id` | Xóa tài nguyên |

## 2. HTTP Status Codes chuẩn
- **200 OK:** Yêu cầu xử lý thành công.
- **201 Created:** Tạo mới tài nguyên thành công.
- **400 Bad Request:** Lỗi validation dữ liệu đầu vào.
- **401 Unauthorized:** Chưa xác thực hoặc Token hết hạn.
- **403 Forbidden:** Không có quyền truy cập.
- **404 Not Found:** Không tìm thấy tài nguyên.
- **500 Internal Server Error:** Lỗi hệ thống ngoài dự kiến.

## 3. Response Structure chuẩn
Mọi API response (thành công hoặc lỗi) cần sử dụng cấu trúc chuẩn thống nhất:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thao tác thành công",
  "data": { ... },
  "timestamp": "2026-08-09T14:45:00.000Z"
}
```

Trường hợp lỗi (`success: false`):
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng"
    }
  ],
  "timestamp": "2026-08-09T14:45:00.000Z"
}
```
