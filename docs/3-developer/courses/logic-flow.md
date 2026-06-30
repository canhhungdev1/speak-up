# Courses Logic Flow

## 1. Giới thiệu
Module Courses quản lý việc lấy danh sách Khóa học (Courses), Nhóm bài học (Lesson Sets) và Chi tiết bài học (Lessons). Đây là phần nặng về Read (Lấy dữ liệu).

## 2. Luồng xử lý (Data Fetching Flow)
1. **Explore Page (Angular):** Gọi API `GET /courses`.
   - **Backend:** Lấy dữ liệu từ bảng `courses`. Có thể dùng Redis/Memcached sau này để Cache vì dữ liệu này rất ít khi thay đổi.
2. **Course Details Page:** Gọi API `GET /courses/:id/details`.
   - **Backend:** Join bảng `courses` với bảng `lesson_sets` và `lessons` để trả về cây cấu trúc phân tầng (Accordion).
3. **Lesson Player:** Gọi API `GET /lessons/:id`.
   - **Backend:** Lấy `audio_url` và mảng `transcript_json`. 
   - **Lưu ý quan trọng:** Không nên query toàn bộ `transcript_json` ở màn hình Details vì nó rất nặng. Chỉ query transcript khi user thực sự bấm vào bài học đó.

## 3. Các lưu ý (Edge Cases)
- Bài học có nhiều loại (`type` = audio, vocab, story, pov). Frontend cần dựa vào loại này để render giao diện phù hợp.
- Link Audio được trích xuất từ Storage, cần tính toán chi phí băng thông (Bandwidth) nếu dùng Storage trả phí.
