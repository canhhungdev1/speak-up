# Hướng dẫn tạo Google OAuth Client ID

Để hệ thống Đăng nhập bằng Google hoạt động được, bạn cần đăng ký dự án của mình với Google để lấy một mã định danh gọi là **Client ID**. Dưới đây là các bước chi tiết:

## Bước 1: Truy cập Google Cloud Console
1. Mở trình duyệt và truy cập vào trang: [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google (Gmail) của bạn.
3. Ở góc trên cùng bên trái (cạnh logo Google Cloud), bấm vào nút **"Select a project"** (Chọn dự án) -> Chọn **"New Project"** (Dự án mới).
4. Đặt tên dự án (VD: `SpeakUp App`) và bấm **Create** (Tạo). Chờ một lát để Google khởi tạo.

## Bước 2: Cấu hình Màn hình đồng ý OAuth (OAuth consent screen)
1. Ở thanh menu bên trái, tìm mục **"APIs & Services"** (API & Dịch vụ) -> Chọn **"OAuth consent screen"** (Màn hình đồng ý OAuth).
2. Chọn **User Type** là **External** (Bên ngoài) và bấm **Create**.
3. Điền các thông tin bắt buộc:
   - **App name**: `SpeakUp`
   - **User support email**: Chọn email của bạn.
   - **Developer contact information**: Nhập email của bạn.
4. Kéo xuống dưới cùng và bấm **Save and Continue** (Lưu và tiếp tục). Các bước tiếp theo (Scopes, Test users) bạn có thể bấm **Save and Continue** để bỏ qua.

## Bước 3: Tạo Credentials (Mã xác thực)
1. Ở menu bên trái, bấm vào mục **"Credentials"** (Thông tin xác thực).
2. Bấm vào nút **"+ CREATE CREDENTIALS"** (Tạo thông tin xác thực) ở phía trên cùng -> Chọn **"OAuth client ID"**.
3. Trong ô **Application type** (Loại ứng dụng), chọn **"Web application"** (Ứng dụng web).
4. Đặt tên (VD: `SpeakUp Web Client`).
5. **ĐIỂM QUAN TRỌNG NHẤT:** Ở mục **"Authorized JavaScript origins"** (Nguồn gốc JavaScript được uỷ quyền), bạn bấm **+ ADD URI** và điền:
   - `http://localhost:4200`
   *(Vì Angular chạy ở cổng 4200, đây là cấu hình bắt buộc để Google không chặn Frontend của chúng ta)*
6. Bấm **Create** (Tạo).

## Bước 4: Lấy Client ID
1. Sau khi bấm Tạo, một bảng thông báo sẽ hiện lên chứa mã **Client ID** (Có dạng một chuỗi dài kết thúc bằng `.apps.googleusercontent.com`).
2. Hãy Copy đoạn mã Client ID này. (Bạn không cần copy Client Secret).

## Bước 5: Cấu hình vào Project SpeakUp
Bây giờ hãy dán mã Client ID bạn vừa copy vào 2 vị trí sau trong dự án:

1. **Frontend (Môi trường Local)** - `source/frontend/src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  googleClientId: 'DÁN_MÃ_CLIENT_ID_VÀO_ĐÂY'
};
```

2. **Backend (Bảo mật)** - `source/backend/.env`:
Thêm dòng này vào cuối file `.env`:
```env
GOOGLE_CLIENT_ID="DÁN_MÃ_CLIENT_ID_VÀO_ĐÂY"
```
