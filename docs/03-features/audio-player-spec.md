# Nâng cấp Trình phát Nhạc (Audio Player Component)

## 1. Mô tả chung (Overview)
- **Mục tiêu:** Nâng cấp toàn diện giao diện và trải nghiệm người dùng (UI/UX) của `AudioPlayerComponent` ở dưới cùng màn hình trở nên sang trọng, hiện đại (Premium Aesthetics), phản ứng sinh động (Responsive & Alive) và bổ sung các tương tác tiện ích.
- **Phạm vi (Scope):**
  - Refactor giao diện HTML và SCSS của `AudioPlayerComponent` tại `/src/app/shared/components/audio-player`.
  - Giữ nguyên logic cốt lõi của `AudioService` để tránh làm ảnh hưởng đến luồng phát nhạc và đồng bộ lời thoại.
  - Bổ sung hiệu ứng đĩa nhạc xoay / sóng nhạc động, nút Play gradient phát sáng, thanh chỉnh âm lượng trực quan và hiệu ứng trượt thanh tiến trình hiện đại.
- **Đối tượng (Actors):** Học viên học luyện nghe trên SpeakUp.

## 2. Thiết kế Giao diện nâng cấp (UI Design Detail)

### A. Thiết kế Kính mờ (Glassmorphism & Glow)
*   **Background:** Sử dụng nền kính mờ `rgba` kết hợp `backdrop-filter: blur(20px)` và viền mỏng mờ ảo phía trên.
*   **Shadow:** Đổ bóng lớn mượt mà hướng lên trên `box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15)` tạo cảm giác trình phát nổi (floating) tách biệt khỏi nội dung trang học.

### B. Biểu diễn động trạng thái Phát (Interactive Visualizers)
*   **Đĩa nhạc quay (Vinyl Rotation):** Thêm một thumbnail hình tròn nhỏ chứa icon đĩa nhạc ở góc trái. Khi nhạc phát (`state.isPlaying = true`), đĩa nhạc sẽ quay tròn vô tận nhẹ nhàng (`spin` animation). Khi tạm dừng, đĩa nhạc dừng quay.
*   **Sóng nhạc động (Live Waveform):** Thêm biểu tượng các vạch sóng nhạc chuyển động nhấp nhô theo nhịp khi bài học đang được phát để tăng tính tương tác thị giác.

### C. Bộ điều khiển trung tâm (Control Center)
*   **Nút Play/Pause lớn:** Chuyển thành nút tròn có màu nền gradient (từ xanh dương sáng đến đậm), khi hover sẽ tỏa ra vầng sáng phát quang (glow shadow).
*   **Nút tua:** Các nút tua nhanh 5s trước/sau sử dụng các icon SVG mảnh hiện đại, có vòng tròn nền xuất hiện mượt mà khi hover.

### D. Thanh âm lượng & Lựa chọn tốc độ (Volume & Speed)
*   **Volume Slider:** Thêm một thanh chỉnh âm lượng nằm cạnh nút tốc độ. Admin/Học viên có thể kéo thả để tăng/giảm âm lượng trực tiếp trên trình phát.
*   **Speed Selector:** Nút chọn tốc độ phát sẽ hiển thị popover menu với hiệu ứng bung mở (scale + fade-in) mượt mà.

---

## 3. Checklist (Definition of Done)
- [ ] Phân tích thiết kế giao diện Audio Player mới
- [ ] Cập nhật mã nguồn HTML `audio-player.component.html`
- [ ] Cập nhật phong cách SCSS `audio-player.component.scss` (Chất liệu kính mờ, sóng nhạc động, đĩa nhạc quay, volume slider)
- [ ] Cập nhật logic TS `audio-player.component.ts` (Thêm khả năng kiểm soát Volume thông qua AudioService)
- [ ] Chạy build xác nhận không có lỗi cú pháp và kiểm thử thực tế
