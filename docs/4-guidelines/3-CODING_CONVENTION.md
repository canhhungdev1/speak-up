# Coding Conventions & Guidelines

## 1. Quy tắc chung (General Guidelines)
- **Ngôn ngữ:** Sử dụng Tiếng Anh cho toàn bộ mã nguồn (Tên biến, hàm, class, comments, commit messages).
- **Format Code:** Sử dụng Prettier và ESLint. Thụt lề (Indentation) 2 spaces.
- **Naming Conventions:**
  - `camelCase` cho biến, hàm (VD: `getUserProfile`, `lessonTitle`).
  - `PascalCase` cho Class, Interface, Type, Component (VD: `LessonPlayerComponent`, `UserProfile`).
  - `UPPER_SNAKE_CASE` cho Hằng số (VD: `MAX_UPLOAD_SIZE`).
  - `kebab-case` cho tên file (VD: `lesson-player.component.ts`).

## 2. Angular (Frontend) Guidelines
- Sử dụng **Standalone Components** thay cho `NgModule`.
- Template (HTML), Style (SCSS) và Logic (TS) nên tách riêng thành 3 file nếu nội dung phức tạp.
- Tránh viết logic phức tạp trong HTML Template (không gọi function trong binding `{{ func() }}`, dùng Pipe hoặc tính toán sẵn trong TS).
- Hủy đăng ký (Unsubscribe) các RxJS Observables trong `ngOnDestroy` hoặc sử dụng `takeUntilDestroyed()`.

## 3. NestJS (Backend) Guidelines
- Sử dụng Dependency Injection một cách triệt để.
- Luôn kiểm tra dữ liệu đầu vào bằng `class-validator` và DTOs (Data Transfer Objects).
- Controller chỉ chịu trách nhiệm nhận request và trả response, tuyệt đối không viết Business Logic trong Controller. (Chuyển logic sang Service).
- Xử lý lỗi tập trung bằng Global Exception Filter.

## 4. Git & Khởi tạo Branch
- **Nhánh chính:** `main` (Production), `develop` (Staging).
- **Quy tắc tạo nhánh (Branching):**
  - `feature/<tên-chức-năng>` (VD: `feature/audio-player`)
  - `bugfix/<tên-lỗi>` (VD: `bugfix/fix-sidebar-overlay`)
- **Commit Messages:** Tuân thủ Conventional Commits:
  - `feat: add dark mode toggle`
  - `fix: resolve double scrollbar issue`
  - `docs: update API specifications`
  - `refactor: clean up lesson player component`
