# 🏛️ Tổng quan Kiến trúc Hệ thống SpeakUp

## 1. Tổng quan Monorepo
Dự án **SpeakUp** được tổ chức theo mô hình **Monorepo** kết hợp với **Nx Workspace**, bao gồm các thành phần:

| Thành phần | Công nghệ | Đường dẫn | Mô tả |
| :--- | :--- | :--- | :--- |
| **API Backend** | NestJS | [`api/`](../../api) | Cung cấp RESTful API, quản lý Auth, Database và tích hợp Speech AI |
| **Web App** | Angular | [`web/`](../../web) | Giao diện web cho người dùng & quản trị |
| **Mobile App** | Flutter | [`mobile/`](../../mobile) | Ứng dụng di động iOS/Android |
| **API E2E Tests** | Playwright / Jest | [`api-e2e/`](../../api-e2e) | Test tự động toàn trình cho API |
| **Web E2E Tests** | Playwright / Cypress | [`web-e2e/`](../../web-e2e) | Test tự động toàn trình cho Web |

## 2. Nguyên tắc Kiến trúc Backend (3-Tier Architecture)
- **Controller Layer:** Tiếp nhận HTTP Request, Validate DTO, trả về HTTP Response.
- **Service Layer:** Chứa toàn bộ Business Logic, xử lý giao dịch.
- **Repository / DAO Layer:** Giao tiếp Cơ sở dữ liệu.

## 3. Quản lý trạng thái & UI Mobile/Web
- **Web (Angular):** Sử dụng RxJS / Signals để quản lý State và Reactive Forms.
- **Mobile (Flutter):** Sử dụng BLoC / Provider quản lý State theo quy tắc 3-State (Loading, Error, Empty/Data).
