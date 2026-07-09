# Interactive Learning Room (Phase 2.3)

## 1. Mô tả chung (Overview)
- **Mục tiêu:** Xây dựng màn hình "Phòng Học" (Learning Room) chuyên biệt cho từng loại bài học. 
- **Đặc tả UI/UX:**
  - `MAIN`: Hiển thị bài đọc văn bản dài, cỡ chữ lớn, tối giản.
  - `VOCAB`: Hiển thị danh sách từ vựng (Từ mới - Nghĩa).
  - `MINI_STORY`: Hiển thị từng dòng kịch bản. Dòng nào đang được phát Audio sẽ được tô màu nổi bật (Highlight). Học viên có thể bấm vào một dòng bất kỳ để tua audio đến ngay giây đó.
- **Đối tượng (Actors):** Học viên (Learner).

## 2. Luồng nghiệp vụ (User Flow)
1. Từ màn hình Chi tiết khóa học (`/dashboard/courses/:id`), học viên bấm vào 1 bài học (VD: Mini Story).
2. Hệ thống Router điều hướng sang `/dashboard/learn/:lessonId`.
3. Component khởi tạo:
   - Gọi AudioService play bài học đó.
   - Fetch dữ liệu `Transcript` của bài học.
   - Dựa vào `lesson.type`, render ra 1 trong 3 Component (Main, Vocab, Interactive).
4. (Đối với Interactive) Khi Audio phát, lắng nghe biến `currentTime`. Nếu `currentTime` lọt vào khoảng `[startTime, endTime]` của một dòng Transcript, đánh dấu biến `active = true` cho dòng đó (UI tự động bôi màu xanh).

## 3. Cấu trúc Component (Frontend)
- `LearnerLessonDetailComponent` (Smart Component): Quản lý Routing, lấy dữ liệu, chứa nút "Quay lại Khóa học".
- `MainLessonViewComponent` (Dumb Component): Nhận `@Input() transcripts`, render dạng thẻ `<p>`.
- `VocabLessonViewComponent` (Dumb Component): Nhận `@Input() transcripts`, render dạng lưới danh sách.
- `InteractiveTranscriptComponent` (Dumb/Interactive): Nhận `@Input() transcripts` và `@Input() currentTime`. Sử dụng `*ngFor` để render từng dòng. Có class `.active` cho dòng hiện tại. Bắn `@Output() seekTime` khi người dùng bấm vào một dòng.

## 4. Xử lý ngoại lệ (Edge Cases)
- Bài học không có transcript: Hiển thị thông báo "Bài học này chưa có phụ đề".
- Audio Player: Thanh Player ở dưới đáy vẫn phải hoạt động bình thường và đồng bộ thời gian hoàn hảo với màn hình Learning Room.
