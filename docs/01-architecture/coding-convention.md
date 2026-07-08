# Coding Convention - SpeakUp Project

Để đảm bảo tính nhất quán, dễ đọc và dễ bảo trì cho dự án, toàn bộ thành viên tham gia phát triển dự án SpeakUp cần tuân thủ nghiêm ngặt các quy tắc đặt tên (Coding Convention) dưới đây.

Vì dự án sử dụng TypeScript ở cả Frontend (Angular) và Backend (NestJS), quy chuẩn cốt lõi của chúng ta là **Camel Case**.

## 1. Quy tắc chung (General Rules)

| Loại (Type) | Chuẩn áp dụng (Case) | Ví dụ (Example) |
| --- | --- | --- |
| Biến (Variables) | `camelCase` | `accessToken`, `userProfile`, `isLoggedIn` |
| Hàm / Phương thức (Functions / Methods) | `camelCase` | `getUserData()`, `calculateScore()` |
| Lớp / Component (Classes) | `PascalCase` | `AuthService`, `DashboardHomeComponent` |
| Interface / Type | `PascalCase` | `UserProfile`, `CourseDetail` |
| Hằng số (Constants) | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Tên File (File Names) | `kebab-case` | `auth.service.ts`, `dashboard-home.component.html` |
| Thư mục (Directories) | `kebab-case` | `shared-components`, `user-profile` |

## 2. Quy tắc giao tiếp API (Frontend ↔ Backend)

Để tránh việc phải mapping dữ liệu lộn xộn giữa Frontend và Backend, **toàn bộ JSON Request và Response đều phải sử dụng `camelCase`**.
- Tuyệt đối KHÔNG sử dụng `snake_case` (ví dụ: `access_token`, `first_name`) trong JSON trả về, kể cả khi đó là chuẩn của bên thứ 3 (như OAuth2). Cần convert sang `camelCase` ngay tại tầng Service của Backend trước khi trả về.

**Đúng (Correct):**
```json
{
  "accessToken": "eyJhbGciOi...",
  "userProfile": {
    "fullName": "Nguyen Van A",
    "avatarUrl": "https://..."
  }
}
```

**Sai (Incorrect - Không được dùng):**
```json
{
  "access_token": "eyJhbGciOi...",
  "user_profile": {
    "full_name": "Nguyen Van A",
    "avatar_url": "https://..."
  }
}
```

## 3. Quy tắc Cơ sở dữ liệu (Database - Prisma)

Schema trong Prisma cũng tuân thủ `camelCase` để tương thích 100% với mã nguồn TypeScript.
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  googleId     String?  @unique
  fullName     String?
  avatarUrl    String?
}
```
*(Lưu ý: Nếu database PostgreSQL bên dưới bắt buộc phải dùng snake_case do quy định của DBA, Prisma hỗ trợ map thông qua `@map("full_name")`, nhưng trong code TypeScript vẫn thao tác qua `fullName`)*.

## 4. Local Storage & Session Storage

Các key lưu trữ cục bộ trên trình duyệt cũng phải tuân theo `camelCase`.
- `localStorage.setItem('accessToken', '...')` (Không dùng `access_token`).
- `localStorage.setItem('themeMode', 'dark')`
