# 4. HƯỚNG DẪN CODE VÀ QUẢN LÝ SOURCE

Tài liệu này giải thích sâu hơn về cách code được tổ chức và những lưu ý khi bạn muốn mở rộng hệ thống trong tương lai.

## 4.1 Cấu hình Biến môi trường (.env.local)
Hệ thống kết nối với Database thông qua thư viện `@supabase/ssr` (phiên bản bảo mật Server-Side của Supabase cho Next.js).
Bạn cần có các biến môi trường sau trong file `.env.local` ở thư mục gốc:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key (Dành cho việc bypass RLS ở môi trường Admin, tuỳ chọn)
```

## 4.2 Lấy Dữ liệu ở Server Components (SSR)
Đây là thế mạnh lớn nhất của Next.js App Router. Dữ liệu sẽ được gọi ngay trên Server thay vì tải xuống máy khách rồi mới gọi API, giúp trang tải cực nhanh.

**File tham khảo**: `src/app/dashboard/page.tsx`
**Cú pháp chuẩn**:
```typescript
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient(); // Cần chữ 'await' ở Next.js 15 vì cookies() là Promise
  
  // Lấy dữ liệu an toàn trên Server
  const { data } = await supabase.from('du_an').select('*');

  return <div>{data[0].ten_du_an}</div>
}
```

## 4.3 Tương tác Form và State ở Client Components
Nếu một trang cần tương tác (Click nút mở Modal, gõ phím để Tìm kiếm, hoặc xử lý biểu mẫu Submit), thì file đó bắt buộc phải có `"use client";` ở dòng trên cùng.

**File tham khảo**: `src/app/dashboard/admin/page.tsx`
**Cú pháp chuẩn**:
```typescript
"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminClient() {
  const [data, setData] = useState([]);
  const supabase = createClient(); // Bản client không dùng await
  
  const handleInsert = async () => {
    await supabase.from('tieu_chi_ask').insert([...]);
  }
}
```

## 4.4 Các thư viện cốt lõi (Dependencies)
Nếu bạn cài đặt hệ thống sang một máy mới, hãy lưu ý các thư viện quan trọng này trong `package.json`:
- `next`, `react`, `react-dom`: Nền tảng lõi.
- `@supabase/supabase-js`, `@supabase/ssr`: Thư viện kết nối Database, xử lý xác thực (Auth) và thao tác Cookie.
- `tailwindcss`, `postcss`: Hệ thống CSS Utility Class.
- `lucide-react`: Bộ Icon SVG sắc nét dùng cho các nút bấm và Sidebar.
- `recharts`: Dùng để vẽ đồ thị Radar Chart (Biểu đồ mạng nhện Năng lực).

## 4.5 Lưu ý khi Xuất File Excel (Export CSV)
Tính năng Export Báo cáo trong hệ thống được code thuần bằng Javascript (Web APIs) theo chuẩn `text/csv;charset=utf-8` + ký tự `\uFEFF` (Byte Order Mark - BOM) để tránh lỗi font tiếng Việt khi mở bằng Microsoft Excel.
Bạn sẽ không cần chạy `npm install` các thư viện xử lý file cồng kềnh (như xlsx) giúp hệ thống nhẹ và dễ deploy hơn.
