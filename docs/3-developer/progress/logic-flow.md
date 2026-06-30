# Progress Tracking Logic Flow

## 1. Giới thiệu
Module này là trái tim của hệ thống Gamification. Nó theo dõi việc học viên nghe bài đến đâu (last_position), đánh dấu hoàn thành bài học, tính toán chuỗi ngày học liên tục (Streak) và vẽ biểu đồ mục tiêu tuần.

## 2. Luồng xử lý Đồng bộ Tiến độ (Sync Flow)
1. **Frontend (Lesson Player):** Cứ mỗi 10 giây (hoặc khi bấm Pause/Tắt trình duyệt), Frontend sẽ bắn API `POST /progress/sync`.
2. **NestJS Backend:**
   - Verify JWT Token để lấy `user_id`.
   - Tìm kiếm record trong bảng `user_progress` với `user_id` và `lesson_id`.
   - Nếu tồn tại: Cập nhật `last_position = :val` và `updated_at = NOW()`.
   - Nếu chưa tồn tại: Tạo mới record với `status = 'in_progress'`.
3. **Logic Hoàn thành (Completion Logic):**
   - Nếu `is_completed = true` (Frontend tự động truyền lên khi Audio kết thúc), Backend chuyển `status = 'completed'`.

## 3. Luồng xử lý Streak (Chuỗi ngày học)
- Backend kiểm tra bảng `user_progress` để tìm những ngày có phát sinh cập nhật (updated_at).
- Tính chuỗi liên tiếp (Ví dụ: 3 ngày gần nhất đều có tương tác -> Streak = 3).
- Nếu hụt một ngày, Streak bị reset về 0.

## 4. Các lưu ý (Edge Cases)
- Tránh spam API: Frontend phải dùng kỹ thuật `Debounce` (chỉ gọi API sau khi user dừng thao tác tua) hoặc `Throttling` (gọi định kỳ mỗi 10s) thay vì gọi liên tục mỗi 1 giây.
- Xử lý mất mạng (Offline mode): Có thể lưu tạm `last_position` xuống `localStorage` của trình duyệt, có mạng mới bắn API đồng bộ lên lại.
