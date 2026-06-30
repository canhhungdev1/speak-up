# Hướng dẫn Cài đặt & Cấu hình Supabase (Runbook)

Tài liệu này hướng dẫn chi tiết từng bước (Step-by-step) để một lập trình viên mới có thể tự tạo môi trường Supabase và kết nối nó vào dự án SpeakUp.

---

## 1. Khởi tạo Dự án trên Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard) và đăng nhập (có thể dùng Github).
2. Nhấn nút **New Project**.
3. Điền thông tin:
   - **Name:** `speak-up-dev` (hoặc tên tùy ý).
   - **Database Password:** Bấm nút *Generate a password* (Lưu ngay mật khẩu này lại vì nó chỉ hiện 1 lần).
   - **Region:** Chọn khu vực gần nhất (VD: `Singapore` hoặc `Tokyo` để tốc độ mạng nhanh nhất).
4. Nhấn **Create new project** và đợi khoảng 1-2 phút để hệ thống khởi tạo Database.

---

## 2. Lấy thông tin Cấu hình (Environment Variables)

Bạn cần lấy 3 thông số quan trọng để điền vào file `.env` của dự án.

### 2.1. Lấy `SUPABASE_URL` và `SUPABASE_KEY` (Dùng cho cả Frontend & Backend)
1. Tại màn hình Dashboard dự án của bạn, nhìn sang menu bên trái, cuộn xuống dưới cùng chọn ⚙️ **Project Settings**.
2. Chọn mục **API** ở thanh menu con bên trái.
3. Trong phần **Project URL**, copy đoạn URL -> Đây chính là `SUPABASE_URL`.
4. Trong phần **Project API keys**, copy đoạn mã của mục `anon` `public` -> Đây chính là `SUPABASE_KEY`.

### 2.2. Lấy `JWT_SECRET` (Chỉ dùng cho Backend NestJS)
*Lưu ý: Không bao giờ được để lộ mã này ra ngoài Frontend.*
1. Vẫn ở màn hình ⚙️ **Project Settings** -> **API**.
2. Cuộn xuống phần **JWT Settings**.
3. Bạn sẽ thấy ô **JWT Secret**. Bấm nút con mắt 👁️ để hiện mã, sau đó copy nó.
4. Cập nhật mã này vào file `.env` của Backend: `SUPABASE_JWT_SECRET="mã_bạn_vừa_copy"`

*(Lập trình viên backend nhớ cập nhật lại file `jwt.strategy.ts` để đọc biến `SUPABASE_JWT_SECRET` thay vì `SUPABASE_KEY` nhé).*

---

## 3. Cấu hình Môi trường Dev (Mẹo tăng tốc code)

Khi đang code (Môi trường Development), bạn sẽ phải tạo rất nhiều account ảo để test. Nếu để cấu hình mặc định, mỗi lần tạo account bạn lại phải vào Email bấm xác nhận, rất tốn thời gian. Hãy tắt nó đi:

1. Tại menu bên trái (ngoài cùng), bấm vào biểu tượng 👤 **Authentication**.
2. Tại menu con của Auth, cuộn xuống chọn ⚙️ **Providers**.
3. Bấm mở phần **Email**.
4. Tắt (Off) công tắc ở dòng: **Confirm email** (Yêu cầu xác nhận email đăng ký).
5. Tắt (Off) công tắc ở dòng: **Secure email change** (Yêu cầu xác nhận khi đổi email).
6. Nhấn **Save**.

🎉 **Xong! Lúc này, bất kỳ ai đăng ký tài khoản trên Frontend cũng sẽ được login thẳng vào app mà không cần check email.**

---

## 4. Tóm tắt cấu hình `.env` cuối cùng

**File `.env` của Backend (NestJS):**
```env
# URL kết nối Supabase
SUPABASE_URL="https://xxx.supabase.co"

# Key kết nối API (Anon Key)
SUPABASE_KEY="eyJhbG..."

# Chìa khóa bí mật để giải mã Token (Chỉ BE mới có)
SUPABASE_JWT_SECRET="tF8..."

# Cấu hình Local PostgreSQL (Docker)
DATABASE_URL="postgresql://speakup_admin:secretpassword@localhost:5432/speakup_db?schema=public"
```
