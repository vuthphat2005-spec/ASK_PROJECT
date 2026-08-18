# TÀI LIỆU VẬN HÀNH VÀ KIẾN TRÚC HỆ THỐNG TEAMCOLLAB (MASTER DOCUMENT)

Tài liệu này là bản tổng hợp hoàn chỉnh (Master) dành cho cả Quản trị viên (Admin), Lập trình viên (Developer) và Quản lý Dự án khi tiếp nhận, vận hành hoặc nâng cấp hệ thống TeamCollab.

---

## PHẦN 1: TỔNG QUAN KIẾN TRÚC HỆ THỐNG
TeamCollab là nền tảng quản trị năng lực nhân sự theo mô hình A.S.K (Attitude - Skill - Knowledge). 

### 1.1 Công nghệ lõi
- **Frontend**: Next.js 15 (App Router). Tối ưu SEO và Server-Side Rendering (SSR).
- **Styling**: Tailwind CSS + Lucide Icons. Thiết kế Glassmorphism và Dark Mode cao cấp.
- **Backend & Database**: Supabase (PostgreSQL). Đảm nhận Authentication (Xác thực) và Database thời gian thực.
- **Biểu đồ**: Thư viện `recharts` để vẽ Radar Chart.

### 1.2 Cấu trúc mã nguồn (Source Code)
Luồng dữ liệu được chia tách chặt chẽ giữa Client và Server theo chuẩn Next.js 15:
- Thư mục `src/app/auth/`: Chứa giao diện Đăng nhập và Khôi phục mật khẩu.
- Thư mục `src/app/dashboard/`: Nơi chứa toàn bộ tính năng chính. Bị khoá bởi `src/middleware.ts` (chỉ cho phép user đã login).
- Trong thư mục `/dashboard`, có các phân hệ con:
  - `admin/`: Nơi cấu hình hệ thống (Quản lý User, Tiêu chí, Trọng số).
  - `team/`: Bảng xếp hạng Năng lực Đội ngũ dành cho Quản lý.
  - `mbo/`, `evaluate/`, `projects/`: Các module vận hành hàng ngày.

---

## PHẦN 2: THUẬT TOÁN ĐÁNH GIÁ NĂNG LỰC ĐỘNG (DYNAMIC A.S.K ALGORITHM)

Hệ thống chấm điểm Năng lực Cá nhân dựa trên 3 trụ cột và có khả năng tuỳ biến trọng số linh hoạt.

### 2.1 Cấu phần Dữ liệu
1. **K (Knowledge - Kiến thức)**:
   - Dữ liệu lấy từ bảng `muc_tieu_mbo`.
   - Bằng **Trung bình cộng** điểm `diem_nghiem_thu` của tất cả các công việc MBO mà nhân sự đó hoàn thành.
2. **A (Attitude - Thái độ)** và **S (Skill - Kỹ năng)**:
   - Dữ liệu lấy từ bảng `danh_gia_cheo` (360 độ Peer Review).
   - Hệ thống quét điểm Sao (quy ra thang 100) mà đồng nghiệp đánh giá nhân sự.
   - Các điểm thuộc nhóm `Attitude` tính trung bình cho A, nhóm `Skill` tính trung bình cho S.

### 2.2 Cấu hình Trọng số (Dynamic Weights)
Từ Phase 10, Admin/Quản lý có thể điều chỉnh mức độ quan trọng của từng yếu tố thông qua bảng `cau_hinh_he_thong`.
- Khi truy cập `/dashboard/admin` -> tab **Cấu hình Trọng số (K-A-S)**, Quản lý dùng thanh trượt để thay đổi %.
- Ví dụ: Đặt K = 50%, A = 25%, S = 25%.
- Công thức tính Tổng điểm Năng lực ở Dashboard và Team Dashboard sẽ là:
  `Tổng điểm = (K * Weight_K + A * Weight_A + S * Weight_S) / 100`

---

## PHẦN 3: CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
Hệ thống sử dụng PostgreSQL (Supabase) với 6 bảng cốt lõi:

1. **`nhan_su`**: Chứa thông tin nhân viên (Liên kết 1-1 với `auth.users`). Phân quyền dựa trên cột `vai_tro` (Admin, QuanLy, ChuyenVien).
2. **`du_an`**: Nơi lưu chiến dịch. MBO phải được giao thuộc về một Dự án.
3. **`tieu_chi_ask`**: Bộ từ điển các câu hỏi Đánh giá. Thuộc nhóm Attitude hoặc Skill.
4. **`muc_tieu_mbo`**: Đại diện cho các Task. Quản lý tạo MBO, gán cho nhân viên. Nhân viên cập nhật `% tiến độ`. Quản lý chốt `diểm nghiệm thu`.
5. **`danh_gia_cheo`**: Lưu lịch sử chấm điểm giữa người với người.
6. **`cau_hinh_he_thong`**: Lưu trữ dạng Key-Value (ví dụ: `weight_k = 50`).

---

## PHẦN 4: HƯỚNG DẪN DÀNH CHO LẬP TRÌNH VIÊN (DEVELOPER GUIDE)

### 4.1 Quy tắc Lấy dữ liệu (Data Fetching)
- **Trên Server Components (SSR)**: Ví dụ `dashboard/page.tsx`
  Cần phải `await createClient()` vì Next.js 15 ép buộc xử lý Cookie bất đồng bộ.
- **Trên Client Components**: Ví dụ `dashboard/admin/page.tsx`
  Dùng `"use client"`. Gọi `createClient()` không cần `await`.

### 4.2 Tính năng Xuất báo cáo (CSV Export)
Hệ thống sử dụng Javascript thuần (Web APIs) để gom dữ liệu table, chèn `\uFEFF` (BOM) và tạo file `.csv`. Điều này giúp hệ thống nhẹ, không phụ thuộc thư viện `xlsx`, và hỗ trợ font tiếng Việt hoàn hảo trên Excel.

### 4.3 Cách Reset Mock Data
Nếu muốn dọn dẹp hệ thống để demo lại:
1. Mở Supabase SQL Editor.
2. Chạy lệnh DELETE FROM cho các bảng `danh_gia_cheo`, `muc_tieu_mbo`, `phan_cong_du_an`, `du_an`, `tieu_chi_ask`. (Giữ nguyên `nhan_su` để giữ tài khoản đăng nhập).
3. Insert lại dữ liệu mẫu.

---

## PHẦN 5: HƯỚNG DẪN DÀNH CHO NGƯỜI DÙNG CẤP CAO (USER MANUAL)

### 5.1 Phân quyền (RBAC)
- **Chuyên viên (ChuyenVien)**: Chỉ xem được Radar Chart của mình, MBO của mình, đánh giá người khác, và Kho Tài nguyên. Không thể xem lương/điểm của đội nhóm.
- **Quản lý (QuanLy)**: Xem được **Năng lực Đội ngũ** (Xếp hạng tất cả nhân viên), xem toàn bộ MBO của dự án. Xem được danh sách nhân sự nhưng **không có quyền** thêm/sửa/xóa quyền quản trị của nhân sự khác.
- **Admin**: Quyền lực tối cao. Thêm/Sửa/Xóa Nhân sự, đổi vai trò cho bất cứ ai. Thay đổi Trọng số K-A-S lõi của hệ thống.

### 5.2 Chu trình vận hành (Life Cycle)
1. Đầu kỳ: Admin thiết lập **Tiêu chí ASK**. Quản lý tạo **Dự án** và giao **MBO**.
2. Trong kỳ: Chuyên viên lên hệ thống kéo thanh trượt **Tiến độ (%)** MBO. Quản lý theo dõi giám sát.
3. Cuối kỳ: Quản lý nghiệm thu **Điểm MBO (K)**. Đồng nghiệp thực hiện **Đánh giá chéo (A, S)**.
4. Tổng kết: Hệ thống tự động vẽ biểu đồ mạng nhện trên trang chủ của Chuyên viên, và sắp xếp vinh danh trên bảng xếp hạng của Quản lý.

---
*(Tài liệu được khởi tạo và cấu trúc tự động bởi Hệ thống)*
