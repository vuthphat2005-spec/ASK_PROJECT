# 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG TEAMCOLLAB

## 1.1 Mục tiêu dự án
TeamCollab là một nền tảng quản trị năng lực nhân sự theo mô hình A.S.K (Attitude - Skill - Knowledge). Hệ thống cho phép doanh nghiệp đánh giá toàn diện nhân sự thông qua:
- **Knowledge (Kiến thức)**: Được đánh giá qua việc hoàn thành các Mục tiêu MBO thực tế.
- **Attitude (Thái độ) & Skill (Kỹ năng)**: Được đánh giá thông qua cơ chế Đánh giá chéo 360 độ (Peer review) dựa trên bộ tiêu chí do Admin cấu hình.

## 1.2 Công nghệ cốt lõi
Hệ thống được phát triển hoàn toàn trên nền tảng Web hiện đại (Modern Web Stack):
1. **Frontend Framework**: Next.js 15 (App Router).
   - Tối ưu SEO, tốc độ tải trang cực nhanh với Server-Side Rendering (SSR).
   - Hỗ trợ React Server Components (RSC) giúp bảo mật logic API trên Server.
2. **Styling**: Tailwind CSS + Lucide Icons.
   - Giao diện Darkmode/Glassmorphism cực kỳ hiện đại, mượt mà.
   - Responsive hoàn hảo trên Mobile, Tablet, Desktop.
3. **Backend & Database**: Supabase (PostgreSQL).
   - Cung cấp Authentication (Đăng nhập Email/Password).
   - Cung cấp Database thời gian thực (PostgreSQL) mạnh mẽ với Row Level Security.
   - Cung cấp Storage (Lưu trữ Avatar/File) với CDN siêu tốc.

## 1.3 Cấu trúc thư mục (Next.js App Router)
Mô hình App Router của Next.js phân chia thư mục rất rõ ràng theo đường dẫn (Route):

```text
src/
├── app/
│   ├── layout.tsx         # Root Layout (Chứa CSS, Font nền tảng)
│   ├── page.tsx           # Trang chủ giới thiệu (Landing Page)
│   ├── auth/              # Các trang Login, Reset Password
│   └── dashboard/         # Khu vực làm việc (Được bảo vệ bởi Middleware)
│       ├── layout.tsx     # Layout riêng của Dashboard (Chứa Sidebar & Header)
│       ├── page.tsx       # Báo cáo Năng lực Cá nhân (Radar Chart)
│       ├── admin/         # Phân quyền, Thêm/Sửa/Xóa Nhân sự, Tiêu chí
│       ├── team/          # Báo cáo Năng lực Đội ngũ (Dành cho Quản lý)
│       ├── projects/      # Quản trị Dự án
│       ├── mbo/           # Giao việc và Cập nhật Tiến độ
│       ├── evaluate/      # Đánh giá 360 độ và Nghiệm thu
│       └── storage/       # Kho tài nguyên
├── components/            # Các UI Component dùng chung (RadarChart, Sidebar)
├── utils/                 # Chứa cấu hình thư viện
│   └── supabase/          # Logic kết nối Supabase (Client & Server)
```

## 1.4 Luồng bảo mật (Security Flow)
1. Người dùng truy cập hệ thống.
2. `src/middleware.ts` sẽ chạy đầu tiên tại Edge Network để kiểm tra Cookie phiên đăng nhập.
3. Nếu người dùng chưa đăng nhập mà cố tình vào `/dashboard`, Middleware sẽ "đá" họ ra `/auth/login`.
4. Nếu đã đăng nhập, ở mỗi trang (vd: `sidebar.tsx` hoặc `admin/page.tsx`), hệ thống sẽ gọi Supabase để kiểm tra `vai_tro` (Role). Nếu Role là `ChuyenVien`, họ sẽ bị ẩn đi một số nút hoặc menu nhạy cảm.
