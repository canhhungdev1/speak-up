# 🔑 Hướng dẫn Chi tiết: Khởi tạo & Tích hợp Google OAuth 2.0 cho SpeakUp

> **Dự án:** SpeakUp - Effortless English Platform  
> **Nhánh Git:** `feature/google-oauth`  
> **Công nghệ:** Google Identity Services SDK (`gsi/client`) + Direct OAuth 2.0  

---

## 📌 1. Tổng quan Kiến trúc

Ứng dụng **SpeakUp** tích hợp Google OAuth 2.0 trực tiếp nhằm mang lại trải nghiệm Đăng nhập 1-Click an toàn, nhanh chóng cho học viên mà không cần thông qua bất kỳ máy chủ trung gian nào.

```
[ Học viên ] ──(Click 'Sign in with Google')──> [ Google Identity SDK ]
                                                         │
                                               (Xác thực & Trả ID Token)
                                                         ▼
[ Student Dashboard ] <──(Decode User Profile)─── [ AuthService (Signals) ]
```

---

## 🛠️ 2. Hướng dẫn Từng bước Tạo Google OAuth 2.0 Client ID

Để ứng dụng có thể hiển thị màn hình chọn tài khoản `@gmail.com` chính chủ từ Google, bạn cần tạo một **Google Client ID** trên trang quản trị Google Cloud Console theo 5 bước đơn giản dưới đây:

### 🔹 Bước 2.1: Truy cập Google Cloud Console
1. Đăng nhập tài khoản Google của bạn và truy cập: 👉 **[https://console.cloud.google.com/](https://console.cloud.google.com/)**
2. Nhấn vào nút chọn Dự án trên thanh công cụ góc trên bên trái $\rightarrow$ Nhấn **NEW PROJECT** (Dự án mới).
3. Đặt tên dự án: `SpeakUp English App` $\rightarrow$ Nhấn **CREATE**.

---

### 🔹 Bước 2.2: Cấu hình Màn hình Cấp quyền OAuth (OAuth Consent Screen)
1. Trên menu bên trái, chọn **APIs & Services** $\rightarrow$ **OAuth consent screen**.
2. Tại mục **User Type**, chọn **External** (Bắt buộc cho người dùng bên ngoài) $\rightarrow$ Nhấn **CREATE**.
3. Điền các thông tin cơ bản:
   * **App name:** `SpeakUp English`
   * **User support email:** Chọn email của bạn.
   * **Developer contact information:** Nhập email của bạn.
4. Nhấn **SAVE AND CONTINUE** bỏ qua bước *Scopes* và *Test users* $\rightarrow$ Nhấn **BACK TO DASHBOARD**.

---

### 🔹 Bước 2.3: Tạo OAuth 2.0 Client ID (Credentials)
1. Trên menu bên trái, chọn **APIs & Services** $\rightarrow$ **Credentials**.
2. Nhấn vào nút **+ CREATE CREDENTIALS** ở góc trên $\rightarrow$ Chọn **OAuth client ID**.
3. Cấu hình các thông số:
   * **Application type (Loại ứng dụng):** Chọn **Web application**.
   * **Name:** `SpeakUp Web Client`.
   * **Authorized JavaScript origins (Nguồn gốc JavaScript được phép):**
     Nhấn *+ ADD URI* và thêm 2 địa chỉ sau:
     * `http://localhost:8888`
     * `http://localhost:4200`
   * **Authorized redirect URIs (Địa chỉ chuyển hướng):**
     Nhấn *+ ADD URI* và thêm:
     * `http://localhost:8888/login`
     * `http://localhost:4200/login`
4. Nhấn **CREATE**.

---

### 🔹 Bước 2.4: Sao chép Client ID
Sau khi nhấn Create, một cửa sổ popup hiển thị mã **Client ID** của bạn (dạng: `xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`).
Hãy sao chép (Copy) chuỗi mã này!

---

## 💻 3. Hướng dẫn Dán Client ID vào Mã nguồn Dự án SpeakUp

Mở file cấu hình môi trường của Frontend tại địa chỉ:
* **[apps/web/src/environments/environment.ts](file:///d:/HocTap/SPEAK-UP/speak-up/apps/web/src/environments/environment.ts)**
* **[apps/web/src/environments/environment.development.ts](file:///d:/HocTap/SPEAK-UP/speak-up/apps/web/src/environments/environment.development.ts)**

Thay thế chuỗi `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` bằng mã Client ID thật của bạn:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  // Dán mã Client ID thật của bạn vào đây:
  googleClientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'
};
```

---

## 🚀 4. Chạy & Kiểm thử Tính năng

1. Mở terminal tại dự án `apps/web` và khởi chạy server:
   ```bash
   cd apps/web
   npm start
   ```

2. Mở trình duyệt truy cập: **`http://localhost:8888/login`**
3. Nhấn vào nút **"Tiếp tục sử dụng dịch vụ bằng Google"** để đăng nhập trực tiếp bằng tài khoản `@gmail.com` của bạn!
