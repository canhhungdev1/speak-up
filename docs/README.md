# SpeakUp Documentation

Thư mục này dùng để lưu trữ toàn bộ tài liệu thiết kế, phân tích tính năng và kiến trúc của dự án SpeakUp.

## Cấu trúc thư mục

- **/02-features**: Chứa tài liệu phân tích cho từng tính năng cụ thể (Ví dụ: `auth.md`, `dashboard.md`, `audio-player.md`). Khi bắt tay vào làm một tính năng mới, hãy tạo một file markdown ở đây.
- **/architecture**: Chứa tài liệu mô tả kiến trúc tổng thể của hệ thống, thiết kế cơ sở dữ liệu chung (Database Schema).
- **/templates**: Chứa các file mẫu (templates) để chuẩn hoá việc viết tài liệu.

## Hướng dẫn viết tài liệu tính năng mới

Khi bắt đầu một tính năng mới, hãy copy file `templates/feature-spec-template.md`, đổi tên thành `[ten-tinh-nang].md` và lưu vào thư mục `02-features/`.

Tài liệu nên bao gồm các biểu đồ (Mermaid diagrams) để trực quan hoá luồng dữ liệu (Sequence Diagram) hoặc cấu trúc cơ sở dữ liệu (ER Diagram).
