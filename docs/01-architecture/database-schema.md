# 🗄️ Thiết kế Cơ sở Dữ liệu (Database Schema)

Dự án SpeakUp sử dụng **PostgreSQL** kết hợp với **Prisma ORM** để quản lý cơ sở dữ liệu.

## 1. Biểu đồ Thực thể ERD (Prisma Schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Provider {
  LOCAL
  GOOGLE
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  googleId  String?  @unique
  provider  Provider @default(LOCAL)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## 2. Danh sách Bảng & Đánh chỉ mục (Indexes)
- Bảng **`users`**:
  - `email`: `UNIQUE INDEX` — Tra cứu nhanh khi login bằng email / Google.
  - `googleId`: `UNIQUE INDEX` — Tra cứu ID Google OAuth2.
