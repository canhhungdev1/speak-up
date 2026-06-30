# QA & Test Cases

## 1. Mức độ Kiểm thử (Testing Levels)
- **Unit Testing (Frontend & Backend):** Viết test cho từng hàm logic lẻ (VD: Hàm format thời gian Audio, Hàm tính toán % hoàn thành khóa học). Công cụ: Jest / Jasmine.
- **Integration Testing:** Kiểm tra luồng gọi API từ Frontend xuống Backend và từ Backend xuống Database.
- **End-to-End (E2E) Testing:** Kiểm tra trên giao diện thực tế với góc độ người dùng (Login -> Chọn Khóa học -> Nghe Audio). Công cụ: Cypress hoặc Playwright.

## 2. Test Cases Tham khảo (Smoke Tests)

### TC01: Luồng Đăng nhập (Authentication)
- **Pre-condition:** Đang ở trang `/auth`.
- **Steps:** Nhập email và password hợp lệ -> Bấm Login.
- **Expected Result:** Chuyển hướng thành công sang `/app/dashboard`, hiển thị tên User trên Topbar. Token JWT được lưu vào localStorage.

### TC02: Responsive Sidebar trên Mobile
- **Pre-condition:** Thiết bị giả lập kích thước iPhone (width < 768px). Đang ở trang Dashboard.
- **Steps:** Bấm vào nút Hamburger (3 gạch) ở góc trái màn hình.
- **Expected Result:** Sidebar trượt ra từ bên trái. Lớp mờ (Overlay) xuất hiện bao phủ phần nội dung còn lại. Nút Hamburger ẩn đi, nút X xuất hiện bên trong Sidebar.

### TC03: Tính năng Audio Sync (Smart Highlight)
- **Pre-condition:** Đang ở màn hình `LessonPlayer`, chế độ `Mini-Story`.
- **Steps:** Bấm nút Play trên thanh Sticky Audio Player. Quan sát phần văn bản (Transcript).
- **Expected Result:** Nhạc phát bình thường. Câu văn tương ứng với thời gian của Audio sẽ được Highlight nổi bật (đổi màu chữ hoặc background). Khi tua (Seek) nhạc, dòng Highlight cũng nhảy theo đúng mốc thời gian.

### TC04: Fixed Topbar & Cuộn trang
- **Pre-condition:** Đang ở màn hình Lesson Player với văn bản rất dài. (Desktop)
- **Steps:** Cuộn chuột xuống cuối trang.
- **Expected Result:** Thanh Topbar và Sidebar không bị biến mất hay cuộn theo. Đoạn văn bản cuối cùng không bị che lấp bởi thanh Sticky Player dưới đáy màn hình.
