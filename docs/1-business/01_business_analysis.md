# Phân tích Yêu cầu Dự án: Website Học Tiếng Anh theo Effortless English

Dựa trên phương pháp học tiếng Anh Effortless English của thầy A.J. Hoge, hệ thống của chúng ta cần được thiết kế xoay quanh các nguyên tắc cốt lõi của phương pháp này. Dưới đây là bảng phân tích chi tiết những tính năng và chức năng cần thiết để xây dựng website học hiệu quả.

## 1. Triết lý cốt lõi cần áp dụng vào hệ thống
1. **Học bằng đôi tai, không phải bằng mắt:** Trọng tâm của hệ thống là trình phát Audio, text (transcript) chỉ mang tính hỗ trợ.
2. **Học sâu (Deep Learning):** Người học cần nghe đi nghe lại một bài học (1 set) trong vòng 7 - 14 ngày. Hệ thống cần có cơ chế nhắc nhở hoặc khóa bài học tiếp theo nếu người dùng chưa đạt đủ số lần/số ngày nghe.
3. **Học theo cụm từ (Phrases), không học từ vựng đơn lẻ:** Chức năng tra từ/giải nghĩa tập trung vào các cụm từ (Idioms/Phrasal verbs) bằng tiếng Anh.
4. **Phản xạ nhanh (Listen and Answer):** Tính năng thiết yếu cho Mini-Story, yêu cầu tốc độ thao tác audio linh hoạt (Pause/Play nhanh).

## 2. Cấu trúc Nội dung (Content Structure)

Dữ liệu của hệ thống sẽ được phân cấp như sau:

- **Khóa học (Course):** Ví dụ: *Original Effortless English*, *Power English*, *Real English*.
- **Bộ bài học (Lesson Set / Module):** Ví dụ: *A Kiss*, *Dragons*.
- **Các bài học thành phần (Lessons):** Trong mỗi Set, mặc định sẽ có các bài học sau:
  - **Main Audio / Article:** Bài đọc chính (Text + Audio).
  - **Vocabulary Lesson:** Audio giải thích từ vựng. Text sẽ highlight những cụm từ quan trọng kèm định nghĩa bằng tiếng Anh.
  - **Mini-Story:** Quan trọng nhất. Audio kể chuyện và đặt câu hỏi. Người dùng cần trả lời nhanh trong khoảng lặng của audio.
  - **Point of View (POV) Story:** Audio kể lại câu chuyện ở thì quá khứ, hiện tại, hoặc tương lai để học ngữ pháp tự nhiên.

## 3. Các Tính năng Chính (Key Features)

### 3.1. Dành cho Người học (End-User)
- **Hệ thống Audio Player chuyên dụng:**
  - Điều chỉnh tốc độ phát (0.75x, 1x, 1.25x, 1.5x) - rất quan trọng cho người mới.
  - Nút tua lùi/tiến 5s hoặc 10s.
  - Tự động lưu vị trí đang nghe dang dở (Resume playback).
- **Interactive Transcript (Lời thoại tương tác):**
  - Hiển thị Text đồng bộ với Audio (Karaoke/Spotify style).
  - Bấm vào một câu trong Text thì Audio tự động nhảy đến mốc thời gian đó.
- **Tiến độ & Học sâu (Progress & Deep Learning Tracking):**
  - Đếm số lần nghe và tổng thời gian nghe mỗi bài.
  - Yêu cầu check-in (đánh dấu đã học) tối thiểu 7 ngày cho một Lesson Set trước khi cho phép mở khóa (Unlock) Set tiếp theo.
  - Thống kê (Dashboard): Streak (chuỗi ngày học liên tục), tổng thời gian nghe trong tuần.

### 3.2. Dành cho Quản trị viên (Admin CMS)
- **Quản lý Khóa học & Bài học:** Thêm/Sửa/Xóa Course, Lesson Set.
- **Upload Media:** Tải lên các file Audio (mp3) và đồng bộ với Supabase Storage.
- **Tạo Transcript & Sync Time:** Tool cho phép admin đánh dấu mốc thời gian (timestamp) cho từng dòng text để làm Interactive Transcript.

### 3.3. Hệ thống Tài khoản & Tương tác
- Đăng ký / Đăng nhập / Quên mật khẩu.
- Diễn đàn hoặc phần Comment nhỏ dưới mỗi bài học để người dùng thảo luận (tuỳ chọn, vì phương pháp khuyến khích cộng đồng).

## 4. Đề xuất Hướng đi cho UI/UX
- **Giao diện Player làm trung tâm:** Khi vào bài học, giao diện nên tối giản hết mức, chia làm 2 phần: Player (cố định) và Transcript (cuộn).
- **Gamification nhẹ nhàng:** Giao diện nên có các Badge (Huy hiệu) hoặc vòng tròn tiến độ (Progress Ring) để khuyến khích người dùng hoàn thành mục tiêu 7 ngày nghe / 1 bài.
- **Mobile First:** Rất nhiều người dùng sẽ vừa học vừa đi lại/tập thể dục. Website cần phải hiển thị hoàn hảo trên giao diện điện thoại, hoặc Audio có thể phát dưới nền khi tắt màn hình điện thoại (thông qua MediaSession API của trình duyệt).

---

**Bước tiếp theo đề xuất:**
Từ bài phân tích này, chúng ta có thể chuyển sang vẽ:
1. **Usecase Diagram** (Biểu đồ luồng sử dụng).
2. **ERD (Entity-Relationship Diagram)** (Sơ đồ cơ sở dữ liệu) để ánh xạ lên Supabase.
