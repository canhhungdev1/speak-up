# Auth Logic Flow

## 1. Giới thiệu
Module Auth trong NestJS không trực tiếp làm nhiệm vụ cấp phát mật khẩu. Việc xác thực (Authentication) do **Supabase Auth** đảm nhiệm. Module này chỉ làm nhiệm vụ đồng bộ dữ liệu User về Database nội bộ (PostgreSQL).

## 2. Luồng xử lý (Login Sync Flow)
1. **Frontend:** Gửi Request kèm `Bearer Token` (JWT từ Supabase).
2. **NestJS Guard (`JwtAuthGuard`):** 
   - Giải mã JWT. Nếu hợp lệ, trích xuất `auth_provider_id` (sub).
3. **NestJS Controller (`/auth/login`):**
   - Gọi `AuthService.syncUser(auth_provider_id)`.
4. **AuthService:**
   - Dò trong bảng `users` xem đã có user nào mang `auth_provider_id` này chưa.
   - Nếu chưa có: Tạo mới một record (Lần đầu đăng nhập).
   - Nếu có rồi: Trả về thông tin User hiện tại.

## 3. Các lưu ý (Edge Cases)
- Cần cache kết quả verify Token (nếu có thể) để giảm tải việc gọi lên Supabase liên tục.
- Token hết hạn sẽ bị Reject ngay từ Guard với HTTP Status `401 Unauthorized`.
