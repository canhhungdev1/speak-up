# Hướng dẫn Kiến trúc & Thiết kế Hệ thống SpeakUp

Tài liệu này ghi lại các nguyên tắc thiết kế kiến trúc hệ thống và các thực hành tốt nhất (Best Practices) được áp dụng thống nhất trong toàn bộ dự án SpeakUp (cả Backend NestJS, Frontend Angular và Database).

---

## 1. Thiết kế phía Backend (NestJS)

### 1.1. Cấu hình Tiền tố API (API Prefix) & Phân chia Phiên bản (Versioning)
Để đảm bảo tất cả các API đều có chung định dạng đường dẫn chuyên nghiệp (ví dụ: `/api/v1/courses`), chúng ta **không** khai báo thủ công tiền tố trong từng Controller. Thay vào đó, thiết lập tập trung tại file [main.ts](file:///e:/Workspace/MyProject/speak-up/source/backend/src/main.ts):

*   **Định cấu hình trong `main.ts`:**
    ```typescript
    // Thiết lập tiền tố chung cho tất cả các API
    app.setGlobalPrefix('api');

    // Tự động chia phiên bản API (Ví dụ: /api/v1/...)
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    ```
*   **Cách viết Controller:** Tất cả các controller chỉ cần định nghĩa ngắn gọn tên tài nguyên:
    ```typescript
    @Controller('courses')
    export class CoursesController { ... }
    ```
    NestJS sẽ tự động định tuyến URL thành `/api/v1/courses`.

### 1.2. Thao tác Cơ sở dữ liệu: Prisma Migrations
*   **Quy tắc:** Tuyệt đối không dùng `prisma db push` trên môi trường Production.
*   **Thực thi:** Trong quá trình phát triển (Local Development), khi có thay đổi trong `schema.prisma`, chạy lệnh:
    ```bash
    npx prisma migrate dev --name <mo_ta_thay_doi>
    ```
    Lệnh này sẽ sinh ra file SQL trong thư mục `prisma/migrations/` giúp lưu vết lịch sử cấu trúc DB. Khi deploy lên server, hệ thống sẽ chạy `npx prisma migrate deploy` để cập nhật cấu trúc một cách an toàn mà không làm mất dữ liệu.

### 1.3. Quản lý cấu hình & Biến môi trường
*   **Sử dụng:** `@nestjs/config` kết hợp với thư viện validation (như `joi` hoặc `class-validator`) để kiểm tra file `.env` ngay khi khởi động.
*   **Bảo mật:** Luôn có file `.env.example` chứa các cấu hình mẫu để dev mới clone dự án về có thể cấu hình được ngay.

---

## 2. Thiết kế phía Frontend (Angular)

### 2.1. Quản lý Xác thực & Gửi Token: HTTP Interceptor
Không đính kèm token thủ công trong từng HTTP Request ở các file Service khác nhau (Anti-pattern).
*   **Thực thi:** Sử dụng **Angular HTTP Interceptor** (Functional Interceptor) để tự động hóa:
    ```typescript
    import { HttpInterceptorFn } from '@angular/common/http';

    export const authInterceptor: HttpInterceptorFn = (req, next) => {
      const token = localStorage.getItem('accessToken');
      
      // Tự động đính kèm Token vào Authorization Header nếu tồn tại
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      return next(req);
    };
    ```
*   Đăng ký interceptor này tại file [app.config.ts](file:///e:/Workspace/MyProject/speak-up/source/frontend/src/app/app.config.ts) bằng `withInterceptors([authInterceptor])`.

### 2.2. Tổ chức Thư mục: Feature-based Architecture
Để dự án dễ dàng mở rộng khi số lượng màn hình tăng lên, cấu trúc mã nguồn được tổ chức theo **Tính năng (Feature-based)** thay vì gom chung theo loại file:
```
src/app/
├── features/
│   ├── auth/ (Đăng nhập, đăng ký)
│   ├── courses/ (Danh sách khóa học, chi tiết khóa học)
│   └── player/ (Trình phát nhạc & Lời thoại transcript)
│       ├── components/
│       ├── services/
│       └── models/
```
*   Mỗi thư mục tính năng sẽ tự quản lý components, services và models phục vụ riêng cho tính năng đó.

### 2.3. Quản lý Trạng thái Trình phát Audio: Reactive State Service
*   **Nguyên tắc:** Giao diện Audio Player và Transcript chạy chữ karaoke đòi hỏi đồng bộ trạng thái cực kỳ chặt chẽ.
*   **Thực thi:** Xây dựng một Service dùng chung (ví dụ: `AudioStateService`) đóng vai trò quản lý State của đối tượng `Audio` HTML5 bằng cách sử dụng các Stream **RxJS** (`BehaviorSubject` hoặc `Subject`). 
*   Các Component (Player, Transcript) sẽ `subscribe` vào các stream này (`isPlaying$`, `currentTime$`, `duration$`) để tự động cập nhật UI một cách mượt mà và bất đồng bộ.

---

## 3. Quy trình Triển khai Tính năng mới

Khi phát triển một tính năng mới trong tương lai, lập trình viên cần tuân thủ:
1.  **Tài liệu trước (Documentation First):** Đọc kỹ [feature-spec-template.md](file:///e:/Workspace/MyProject/speak-up/docs/templates/feature-spec-template.md), tạo tài liệu phân tích nghiệp vụ tại `docs/03-features/[ten-tinh-nang].md` trước khi viết code.
2.  **Thiết kế DB:** Cập nhật `schema.prisma` và chạy `npx prisma migrate dev` để tạo migration file.
3.  **Tạo API:** Viết Controller (đảm bảo đúng quy chuẩn RESTful) và Service xử lý nghiệp vụ.
4.  **Tạo Frontend UI:** Tạo component dạng Standalone nằm trong thư mục `features/` tương ứng, sử dụng Interceptor để gọi API.
