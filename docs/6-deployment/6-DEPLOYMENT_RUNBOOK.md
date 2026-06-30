# Deployment Runbook (Hướng dẫn Triển khai)

Tài liệu hướng dẫn quy trình CI/CD và cách thức đưa dự án SpeakUp lên môi trường Production.

## 1. Môi trường (Environments)
- **Local (Phát triển):** Chạy trên máy cá nhân (`localhost:4200` và `localhost:3000`). Database dùng bản local docker hoặc Supabase Dev Project.
- **Staging (Kiểm thử):** Server thật, dùng để QA test. Kết nối với Supabase Staging Database.
- **Production (Thực tế):** Server dành cho User cuối.

## 2. CI/CD Pipeline (GitHub Actions)
Chúng ta sẽ sử dụng GitHub Actions để tự động hóa:
1. **On Push (nhánh `main` & `develop`):** 
   - Chạy Lint (ESLint).
   - Chạy Unit Tests (Jest).
2. **On Release (Tagging):**
   - Build Frontend ra thư mục `dist/`.
   - Build Backend ra thư mục `dist/`.
   - Push Docker Image lên Container Registry (nếu dùng Docker).
   - Deploy tự động lên Server.

## 3. Triển khai Frontend (Angular)
- Nền tảng khuyến nghị: **Vercel**, **Netlify**, hoặc **Firebase Hosting**.
- **Cấu hình:** 
  - Build command: `npm run build --prod`
  - Output directory: `dist/speak-up/browser`
  - Rewrites (cho SPA): Điều hướng tất cả request về `index.html`.

## 4. Triển khai Backend (NestJS)
- Nền tảng khuyến nghị: **Render.com**, **Railway**, **Fly.io** hoặc tự host trên VPS (DigitalOcean, AWS EC2).
- **Các bước deploy thủ công (nếu cần):**
  1. Clone code về Server.
  2. `npm install`
  3. Set biến môi trường (`.env`), bao gồm `SUPABASE_URL` và `SUPABASE_KEY`.
  4. `npm run build`
  5. Dùng PM2 để chạy nền: `pm2 start dist/main.js --name "speakup-api"`

## 5. Cấu hình Database (Supabase)
- Tạo một Project mới trên bảng điều khiển Supabase (Production).
- Chạy các File Migration (SQL Scripts) để khởi tạo cấu trúc bảng (`users`, `courses`, `lessons`...).
- Thiết lập RLS (Row Level Security) trên Supabase để bảo mật dữ liệu, đảm bảo User nào chỉ xem/cập nhật được Progress của User đó.
- Lấy `URL` và `ANON_KEY` điền vào `.env` của Frontend và Backend.
