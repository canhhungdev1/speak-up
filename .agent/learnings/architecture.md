# Architecture Decisions & System Design

> Lưu trữ các quyết định về kiến trúc hệ thống, giải pháp kỹ thuật và lý do lựa chọn (Trade-offs).
> AI sẽ tự động append nội dung vào đây sau các session làm việc.

---

### [Kiến trúc] Chọn cấu trúc Monorepo với Nx
- **Ngày**: 2026-08-08
- **Task**: Khởi tạo cấu trúc dự án SpeakUp (Angular, NestJS, Flutter)
- **Chi tiết**: Sử dụng **Nx Workspace** chứa Angular (Web) và NestJS (API) để tái sử dụng DTOs/Interfaces qua `libs`. Ứng dụng Flutter (Mobile) đặt độc lập trong thư mục `mobile` để không can thiệp sâu vào toolchain của Nx nhưng vẫn đồng bộ Repo.
- **Files liên quan**: `nx.json`, `apps/api`, `apps/web`, `mobile/`
