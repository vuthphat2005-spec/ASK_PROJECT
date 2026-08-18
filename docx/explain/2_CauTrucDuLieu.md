# 2. CẤU TRÚC CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Dự án sử dụng cơ sở dữ liệu quan hệ PostgreSQL trên Supabase. Dưới đây là các bảng chính và luồng liên kết dữ liệu (Entity-Relationship).

## 2.1 Bảng `nhan_su` (Staff / Users)
Lưu trữ thông tin cơ bản của tất cả người dùng trong hệ thống. Bảng này có quan hệ 1-1 với bảng `auth.users` nội bộ của Supabase thông qua trường Email/ID.

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `id` | uuid (PK) | Mã định danh duy nhất (Trùng với auth.users id) |
| `email` | varchar | Email đăng nhập |
| `ho_ten` | varchar | Tên đầy đủ hiển thị |
| `vai_tro` | varchar | Phân quyền (Admin / QuanLy / ChuyenVien) |
| `trang_thai` | varchar | Trạng thái (HoatDong / DaNghi) |
| `avatar_url` | varchar | Đường dẫn ảnh đại diện |

## 2.2 Bảng `du_an` (Projects)
Lưu trữ các chiến dịch hoặc dự án để từ đó cấp quản lý giao mục tiêu (MBO) cho nhân viên.

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `id` | uuid (PK) | Mã dự án |
| `ten_du_an` | varchar | Tên dự án |
| `ngay_bat_dau` | date | Thời gian kích hoạt |
| `trang_thai` | varchar | (DangChay / DaDong) |

## 2.3 Bảng `tieu_chi_ask` (Evaluation Criteria)
Kho chứa các câu hỏi / tiêu chí dùng để Đánh giá 360 độ (Attitude & Skill).

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `id` | uuid (PK) | Mã tiêu chí |
| `nhom` | varchar | Nhóm đánh giá: `Attitude` hoặc `Skill` |
| `ten_tieu_chi`| varchar | VD: Tinh thần trách nhiệm |
| `mo_ta` | text | Hướng dẫn cách chấm điểm chi tiết |

## 2.4 Bảng `muc_tieu_mbo` (MBO Targets - Đại diện cho K: Knowledge)
Lưu trữ các đầu việc (Tasks) được giao cho từng nhân viên. 
Bảng này chứa dữ liệu để tạo nên **Điểm Knowledge (K)**.

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `id` | uuid (PK) | Mã mục tiêu |
| `du_an_id` | uuid (FK) | Thuộc dự án nào |
| `nhan_su_id` | uuid (FK) | Ai là người thực hiện |
| `noi_dung` | text | Mô tả công việc cần làm |
| `trong_so` | int | Trọng số ảnh hưởng (1-100%) |
| `tien_do` | int | % hoàn thành do nhân viên tự báo cáo (0-100) |
| `diem_nghiem_thu`| int | Điểm thực tế do Quản lý chốt (0-100) - Là cấu phần của K. |

## 2.5 Bảng `danh_gia_cheo` (Peer Reviews - Đại diện cho A & S)
Lưu trữ lịch sử đánh giá của nhân viên này đối với nhân viên khác dựa trên các Tiêu chí ASK.

| Cột | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `id` | uuid (PK) | Mã lượt đánh giá |
| `nguoi_danh_gia_id`| uuid (FK)| Ai là người cho điểm |
| `nguoi_duoc_danh_gia_id`| uuid (FK)| Ai là người bị đánh giá |
| `tieu_chi_id` | uuid (FK)| Đánh giá dựa trên tiêu chí nào |
| `diem_danh_gia`| int | Điểm số được quy đổi từ Sao (1-5 sao -> 20-100 điểm) |
| `nhan_xet` | text | Lý do cho điểm (Không bắt buộc) |

---
**Tóm tắt luồng Quan hệ (Foreign Keys):**
- Một `nhan_su` có nhiều `muc_tieu_mbo`.
- Một `du_an` chứa nhiều `muc_tieu_mbo`.
- Một `danh_gia_cheo` sẽ nối `nguoi_danh_gia_id` và `nguoi_duoc_danh_gia_id` về lại bảng `nhan_su`, đồng thời lấy nội dung câu hỏi từ bảng `tieu_chi_ask`.
