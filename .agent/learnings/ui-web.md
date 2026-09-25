# UI Web & Angular Learnings

## 1. Angular ViewEncapsulation & Dark Mode (`body.dark`)
- **Vấn đề**: Trong Angular, mặc định ViewEncapsulation là `Emulated`. Nếu viết selector `.dark .navbar` bên trong `@Component.styles`, Angular sẽ biên dịch thành `.dark[_ngcontent-xxx] .navbar[_ngcontent-xxx]`. Do thẻ `<body>` nằm ngoài DOM tree của Component nên selector không bao giờ ăn style.
- **Giải pháp**: 
  1. Chuyển các style liên quan đến `.dark` hoặc các component dùng chung ra file `styles.css` (Global CSS).
  2. Hoặc cấu hình `encapsulation: ViewEncapsulation.None` trên component đó.

## 2. Khắc phục lỗi clipped descenders (Phần chân chữ 'p', 'g', 'y' bị che khi dùng Gradient Text)
- **Vấn đề**: Khi dùng `-webkit-background-clip: text` kết hợp `display: inline-block` và `line-height` hẹp, khung bounding box của hình ảnh nền sẽ xén mất phần đuôi chữ kéo xuống dưới (descenders).
- **Giải pháp**:
  ```css
  .text-gradient {
    background: linear-gradient(...);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    padding-bottom: 0.15em;
    margin-bottom: -0.15em;
  }
  ```
  `padding-bottom` sẽ mở rộng vùng canvas bên dưới font chữ, và `margin-bottom` âm bù lại khoảng trống để không làm lệch bố cục dòng tiếp theo.

## 3. Hiệu ứng 3D Mouse Parallax Tilt cho Card
- Tận dụng `(mousemove)` và `(mouseleave)` để tính toán góc nghiêng `rotateX` và `rotateY` dựa theo tọa độ trỏ chuột so với tâm của Card:
  ```typescript
  const rotateX = -(y / (rect.height / 2)) * maxDeg;
  const rotateY = (x / (rect.width / 2)) * maxDeg;
  ```
- Kết hợp với `perspective(1200px)` và `transform-style: preserve-3d` mang lại trải nghiệm tương tác 3D sống động.
