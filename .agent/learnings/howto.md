# How-to Guides & Step-by-Step Procedures

> Lưu trữ các quy trình từng bước (step-by-step) để thực hiện các tác vụ phổ biến hoặc cấu trúc lặp lại trong dự án.
> AI sẽ tự động append nội dung vào đây sau các session làm việc.

---

### [Quy trình] Khởi tạo dự án Nx cho Angular & NestJS
- **Ngày**: 2026-08-08
- **Task**: Tạo khung cấu trúc dự án mới
- **Chi tiết**:
  1. `npx -y create-nx-workspace [name] --preset=apps` để tạo không gian Nx trống.
  2. `npm install -D @nx/angular @nx/nest` cài đặt plugin.
  3. `nx g @nx/angular:app web` và `nx g @nx/nest:app api` để sinh mã nguồn.
  4. Ứng dụng mobile tạo riêng rẽ bằng lệnh `flutter create [tên-thư-mục]`.
- **Files liên quan**: N/A
