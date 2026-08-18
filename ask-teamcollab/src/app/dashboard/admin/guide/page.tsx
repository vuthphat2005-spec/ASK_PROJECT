"use client";

import { BookOpen, ShieldCheck, Target, Users, Code, Server, Layout, Database } from "lucide-react";

export default function AdminGuidePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-4">
          <BookOpen className="w-10 h-10 text-primary" />
          Cẩm nang Hệ thống & Nhật ký Phát triển
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Tài liệu toàn diện về cách vận hành quy trình Đánh giá & Quản trị Nhân sự 360° (ASK-TEAMCOLLAB) 
          cùng với kiến trúc kỹ thuật đằng sau hệ thống.
        </p>
      </div>

      {/* Phần 1: Hướng dẫn Vận hành */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          Phần 1: Hướng dẫn Vận hành (Dành cho Admin & Quản lý)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
              1. Khởi tạo Dữ liệu
            </h3>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>Hệ thống bắt đầu từ việc thiết lập dữ liệu nền móng:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tạo tài khoản Nhân sự:</strong> Nhân viên tự đăng ký hoặc Admin cấp tài khoản. Mỗi user sẽ có 1 trong 3 vai trò: <code>Admin</code>, <code>QuanLy</code>, <code>ChuyenVien</code>.</li>
                <li><strong>Bộ Tiêu chí ASK:</strong> Vào mục Cấu hình hệ thống để định nghĩa các tiêu chí cho <strong>Attitude</strong> (Thái độ) và <strong>Skill</strong> (Kỹ năng).</li>
              </ul>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-green-400">
              2. Vòng lặp MBO (Knowledge)
            </h3>
            <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>Knowledge (Kiến thức) được đo bằng % hoàn thành công việc:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Quản lý:</strong> Tạo dự án và giao mục tiêu (MBO) cho nhân viên cùng trọng số cụ thể.</li>
                <li><strong>Nhân viên:</strong> Báo cáo tiến độ (%) công việc hàng ngày/tuần.</li>
                <li><strong>Nghiệm thu:</strong> Quản lý chấm điểm nghiệm thu thực tế (0-100đ). Đây chính là điểm K.</li>
              </ul>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-2xl md:col-span-2">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-purple-400">
              3. Đánh giá 360 Độ (Attitude & Skill) & Công thức Tổng hợp
            </h3>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>Cuối mỗi chu kỳ, tất cả thành viên trong dự án sẽ tiến hành <strong>Đánh giá chéo</strong> lẫn nhau dựa trên các tiêu chí A và S đã được Admin thiết lập. Điểm đánh giá (1-5 sao) sẽ tự động quy đổi ra thang 100.</p>
              
              <div className="bg-black/30 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-xl font-bold text-green-400">30%</div>
                  <div className="text-xs text-gray-400">KNOWLEDGE (MBO)</div>
                </div>
                <div className="text-2xl font-bold text-gray-600">+</div>
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-xl font-bold text-purple-400">35%</div>
                  <div className="text-xs text-gray-400">ATTITUDE (360°)</div>
                </div>
                <div className="text-2xl font-bold text-gray-600">+</div>
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-xl font-bold text-orange-400">35%</div>
                  <div className="text-xs text-gray-400">SKILL (360°)</div>
                </div>
                <div className="text-2xl font-bold text-gray-600">=</div>
                <div className="text-center flex-1 min-w-[120px] bg-primary/20 py-2 rounded-lg border border-primary/30">
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-xs text-primary">TOTAL SCORE</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Phần 2: Kiến trúc & Phát triển */}
      <div className="space-y-6 pt-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Code className="w-6 h-6 text-orange-400" />
          Phần 2: Quá trình Phát triển & Kiến trúc Kỹ thuật
        </h2>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl flex gap-6 flex-col md:flex-row">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
              <Layout className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">1. Framework Frontend (Next.js 14/15 App Router)</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Hệ thống được xây dựng hoàn toàn dựa trên <strong>Next.js App Router</strong> thế hệ mới. Toàn bộ logic giao tiếp với Database được đưa vào trong các <strong>Server Components</strong> để tối ưu tốc độ tải trang, nâng cao SEO và bảo mật tuyệt đối các khóa API.
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-5">
                <li>Sử dụng <code>React Server Components</code> để fetch dữ liệu từ Supabase không qua API phụ.</li>
                <li>Sử dụng <code>Client Components</code> (với <code>"use client"</code>) cho các Form tương tác, Sidebar và các Hook (useState, useEffect).</li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-6 flex-col md:flex-row">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">2. Backend as a Service (Supabase)</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Thay vì tự code Backend từ đầu, hệ thống sử dụng <strong>Supabase</strong> (Giải pháp thay thế Firebase mã nguồn mở dựa trên PostgreSQL).
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-5">
                <li><strong>Auth:</strong> Đăng nhập, Đăng ký, Quên mật khẩu qua Email hoàn toàn được Supabase lo liệu an toàn.</li>
                <li><strong>Database:</strong> Thiết kế chuẩn CSDL quan hệ (PostgreSQL) với 6 bảng chính. Sử dụng Trigger tự động và RLS (Row Level Security) cực kỳ chặt chẽ.</li>
                <li><strong>Storage:</strong> Cung cấp Bucket <code>avatars</code> và <code>media</code> để lưu trữ File, phân quyền chỉ cho phép người đăng nhập mới được upload.</li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-6 flex-col md:flex-row">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
              <Server className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">3. Triết lý Thiết kế (UI/UX)</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Giao diện được code từ số không sử dụng <strong>TailwindCSS v4</strong>. Yêu cầu đặt ra là phải trông cao cấp, chuyên nghiệp nhưng không lạm dụng hình ảnh AI rườm rà.
              </p>
              <ul className="text-sm text-gray-500 list-disc pl-5">
                <li><strong>Font chữ:</strong> Đồng nhất sử dụng <code>Montserrat</code> - font chữ đặc trưng của các hệ thống doanh nghiệp (Enterprise).</li>
                <li><strong>Glassmorphism:</strong> Sử dụng hiệu ứng kính mờ (<code>backdrop-blur</code>) kết hợp nền tối (Dark Mode) tạo chiều sâu.</li>
                <li><strong>Chart:</strong> Tích hợp Recharts để vẽ biểu đồ Năng lực (Radar Chart) một cách mượt mà và trực quan.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
