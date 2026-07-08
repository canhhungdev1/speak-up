# SpeakUp Documentation

Thư mục này dùng để lưu trữ toàn bộ tài liệu thiết kế, phân tích tính năng và kiến trúc của dự án SpeakUp.

## Cấu trúc thư mục

- **/00-business-analysis**: Phân tích nghiệp vụ, yêu cầu khách hàng.
- **/01-architecture**: Kiến trúc tổng thể của hệ thống, Coding Convention.
- **/02-system-design**: Thiết kế hệ thống, Database Schema.
- **/03-features**: Chứa tài liệu phân tích cho từng tính năng cụ thể (Ví dụ: `auth.md`, `dashboard.md`, `audio-player.md`).
- **/04-deployment**: Tài liệu hướng dẫn triển khai (Deployment).
- **/templates**: Chứa các file mẫu (templates) để chuẩn hoá việc viết tài liệu.

## Hướng dẫn viết tài liệu tính năng mới

Khi bắt đầu một tính năng mới, hãy copy file `templates/feature-spec-template.md`, đổi tên thành `[ten-tinh-nang].md` và lưu vào thư mục `03-features/`.

Tài liệu nên bao gồm các biểu đồ (Mermaid diagrams) để trực quan hoá luồng dữ liệu (Sequence Diagram) hoặc cấu trúc cơ sở dữ liệu (ER Diagram).
