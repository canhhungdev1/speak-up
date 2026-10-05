# 🧪 Cẩm Nang Kiểm Tra & Nghiệm Thu Hệ Thống (Verification Guide)

> **Mục đích:** Tài liệu hướng dẫn chi tiết cách tự kiểm tra, xác thực từng câu lệnh và phát hiện lỗi trong quá trình thực hành cài đặt và vận hành hệ thống **SPEAK-UP**.

---

## 🎯 Danh mục Kiểm tra Nhanh (Quick Checklist)

- [ ] **Docker Desktop:** Đang bật và hoạt động.
- [ ] **Hạ tầng Docker (`docker compose ps`):** Cả 3 container Postgres, Redis, RabbitMQ đều báo `Up (healthy)`.
- [ ] **Redis Test:** Lệnh `ping` trả về `PONG`.
- [ ] **PostgreSQL Test:** Báo `accepting connections`.
- [ ] **RabbitMQ Dashboard:** Đăng nhập thành công tại `http://localhost:15672`.
- [ ] **Backend NestJS:** Gọi `http://localhost:3000/` trả về `Hello World!`.
- [ ] **Frontend Angular:** Truy cập `http://localhost:8888/` hiển thị Landing Page đầy đủ.

---

## 1. Kiểm tra Hạ tầng Docker (Postgres, Redis, RabbitMQ)

Sau khi bạn chạy lệnh khởi động:
```powershell
docker compose up -d postgres redis rabbitmq
```

### 1.1. Kiểm tra sức khỏe toàn bộ Container
* **Lệnh chạy:**
  ```powershell
  docker compose ps
  ```
* **Kết quả ĐÚNG:**
  Cột `STATUS` phải hiển thị chữ **`Up`** kèm theo **`(healthy)`**:
  ```text
  NAME               STATUS                   PORTS
  speakup-postgres   Up (healthy)             0.0.0.0:5432->5432/tcp
  speakup-redis      Up (healthy)             0.0.0.0:6379->6379/tcp
  speakup-rabbitmq   Up (healthy)             0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
  ```
* ⚠️ **Dấu hiệu LỖI:**
  - Cột `STATUS` hiện `Exited (1)` hoặc `Restarting (...)`.
  - **Cách xử lý:** Chạy `docker compose logs [tên-service]` để xem nguyên nhân chi tiết.

---

### 1.2. Kiểm tra chi tiết Redis
* **Lệnh chạy:**
  ```powershell
  docker exec -it speakup-redis redis-cli -a speakup_redis_secret ping
  ```
* **Kết quả ĐÚNG:**
  ```text
  Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
  PONG
  ```
  *(Chữ `PONG` xuất hiện khẳng định Redis đang nhận lệnh và xác thực mật khẩu chuẩn xác).*

---

### 1.3. Kiểm tra chi tiết PostgreSQL
* **Lệnh chạy:**
  ```powershell
  docker exec -it speakup-postgres pg_isready -U postgres -d speakup_db
  ```
* **Kết quả ĐÚNG:**
  ```text
  /var/run/postgresql:5432 - accepting connections
  ```
  *(Dịch vụ cơ sở dữ liệu đã sẵn sàng nhận kết nối từ Backend).*

---

### 1.4. Kiểm tra giao diện quản trị RabbitMQ
* **Thao tác:**
  1. Mở trình duyệt (Chrome/Edge), truy cập: **`http://localhost:15672`**
  2. Nhập thông tin đăng nhập:
     - **Username:** `admin`
     - **Password:** `admin123`
* **Kết quả ĐÚNG:**
  - Đăng nhập thành công vào trang **RabbitMQ Management Dashboard**.
  - Có các thẻ: *Overview*, *Connections*, *Channels*, *Exchanges*, *Queues*, *Admin*.
  - Biểu đồ đường màu xanh lá cây hoạt động bình thường.

---

## 2. Kiểm tra Backend NestJS (Chế độ Hybrid Dev)

Sau khi bạn di chuyển vào thư mục API và chạy lệnh:
```powershell
cd apps/api
npm run start:dev
```

### 2.1. Kiểm tra log khởi động trong Terminal
* **Kết quả ĐÚNG:** Terminal kết thúc bằng các dòng thông báo:
  ```text
  [Nest] ... LOG [RoutesResolver] AppController {/}: +...ms
  [Nest] ... LOG [RouterExplorer] Mapped {/, GET} route +...ms
  [Nest] ... LOG [NestApplication] Nest application successfully started +...ms
  ```

### 2.2. Kiểm tra phản hồi HTTP từ API
* **Lệnh chạy (Mở một Terminal khác):**
  ```powershell
  curl.exe http://localhost:3000/
  ```
  *(Hoặc mở tab trình duyệt gõ `http://localhost:3000`)*
* **Kết quả ĐÚNG:**
  ```text
  Hello World!
  ```

---

## 3. Kiểm tra Frontend Angular

Sau khi bạn di chuyển vào thư mục Web và chạy lệnh:
```powershell
cd apps/web
npm start
```

### 3.1. Kiểm tra log biên dịch trong Terminal
* **Kết quả ĐÚNG:**
  ```text
  Application bundle generation complete. [0.xxx seconds]
  ➜ Local:   http://localhost:8888/
  ```

### 3.2. Kiểm tra tương tác trên trình duyệt
* **Thao tác:** Mở trình duyệt vào **`http://localhost:8888`**
* **Các tính năng cần kiểm tra:**
  1. **Hiển thị Hero Section:** Logo "SpeakUp", tiêu đề bài giảng, các thẻ phương pháp Effortless English.
  2. **Theme Switcher:** Bấm vào nút icon Moon / Sun trên Header xem nền trang có chuyển đổi qua lại giữa Dark Mode và Light Mode không.
  3. **Audio Player Widget:** Bấm nút Play nghe thử file âm thanh mẫu và xem chữ Karaoke có tự đổi màu theo tiếng nói hay không.

---

## 4. Kiểm tra Chế độ Đóng gói Toàn diện (Full Docker Mode)

Khi bạn muốn kiểm tra xem toàn bộ Backend khi chạy trong Docker có kết nối được với Postgres, Redis, RabbitMQ hay không:

* **Lệnh khởi động:**
  ```powershell
  docker compose up -d --build
  ```
* **Lệnh kiểm tra container:**
  ```powershell
  docker compose ps
  ```
* **Kết quả ĐÚNG:**
  Xuất hiện cả 4 container đều ở trạng thái hoạt động:
  ```text
  NAME               STATUS
  speakup-api        Up
  speakup-postgres   Up (healthy)
  speakup-rabbitmq   Up (healthy)
  speakup-redis      Up (healthy)
  ```
* **Kiểm tra log của API bên trong Docker:**
  ```powershell
  docker compose logs -f api
  ```
  *(Thấy dòng: `[NestApplication] Nest application successfully started` là chuẩn xác).*

---

## 🚨 Bảng Xử Lý Sự Cố Thường Gặp (Troubleshooting)

| Vấn đề | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| `docker: error response from daemon...` | Docker Desktop chưa được bật hoặc đang khởi động dở. | Mở ứng dụng Docker Desktop trên Windows và đợi biểu tượng chuyển sang màu xanh lá cây. |
| `bind: address already in use (port 5432 / 6379 / 15672)` | Cổng đó đang bị một ứng dụng khác chiếm giữ trên Windows. | Chạy `netstat -ano \| findstr :5432` để tìm Process ID (PID) đang chiếm cổng và tắt nó, hoặc đổi cổng trong file `.env`. |
| `NOAUTH Authentication required` khi test Redis | Quên truyền tham số mật khẩu `-a speakup_redis_secret`. | Thêm cờ `-a speakup_redis_secret` vào lệnh `redis-cli`. |
| `curl: (7) Failed to connect to localhost port 3000` | NestJS chưa khởi động xong hoặc bị lỗi code. | Xem lại màn hình Terminal chạy `npm run start:dev` xem có báo lỗi đỏ nào không. |

---

*Tài liệu này được lưu trữ tại `docs/guides/verification-guide.md`. Khi thực hành, bạn có thể mở file này song song để đối chiếu từng bước.*
