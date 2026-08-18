"use client";

import { BookOpen, ShieldCheck, Target, Users } from "lucide-react";

export default function AdminGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Cẩm nang Vận hành Hệ thống
        </h1>
        <p className="text-muted-foreground mt-2">
          Tài liệu hướng dẫn dành riêng cho Quản trị viên (Admin) để vận hành quy trình Đánh giá & Quản trị Nhân sự 360° (ASK-TEAMCOLLAB).
        </p>
      </div>

      <div className="space-y-6">
        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            1. Cấu hình ban đầu (Setup)
          </h2>
          <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
            <p>
              Trước khi đưa hệ thống vào sử dụng, Admin cần thiết lập hai thành phần cốt lõi: <strong>Danh sách Nhân sự</strong> và <strong>Bộ Tiêu chí ASK</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Quản lý Nhân sự:</strong> Truy cập <code>Cấu hình Hệ thống &gt; Nhân sự</code> để tạo tài khoản cho người dùng mới. Lưu ý chọn đúng vai trò (<code>Admin</code>, <code>QuanLy</code>, <code>ChuyenVien</code>) vì điều này quyết định quyền hạn của họ trong hệ thống.
              </li>
              <li>
                <strong>Bộ Tiêu chí ASK:</strong> Truy cập <code>Cấu hình Hệ thống &gt; Tiêu chí Đánh giá</code>. Hệ thống chia làm 2 nhóm: <code>Attitude</code> (Thái độ) và <code>Skill</code> (Kỹ năng). Điểm <code>Knowledge</code> (Kiến thức) sẽ tự động được lấy từ tiến độ hoàn thành mục tiêu MBO.
              </li>
            </ul>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            2. Quy trình Giao việc & Đánh giá MBO (Knowledge)
          </h2>
          <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
            <p>
              Điểm K (Knowledge) trong mô hình ASK được đo lường thông qua mức độ hoàn thành công việc thực tế (MBO). Quy trình như sau:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Tạo Dự án:</strong> <code>QuanLy</code> hoặc <code>Admin</code> vào <code>Quản lý Dự án</code> để khởi tạo dự án và thêm thành viên.</li>
              <li><strong>Giao MBO:</strong> Quản lý tạo các mục tiêu (MBO) và gắn trọng số (%) cho từng nhân viên trong dự án.</li>
              <li><strong>Thực thi & Báo cáo:</strong> Nhân viên vào mục <code>Công việc (MBO)</code> để cập nhật phần trăm tiến độ hiện tại.</li>
              <li><strong>Nghiệm thu:</strong> Cuối kỳ, Quản lý vào mục <code>Đánh giá 360° &gt; Nghiệm thu MBO</code> để chấm điểm nghiệm thu thực tế (từ 1 đến 100). Điểm trung bình của tất cả MBO sẽ là điểm K của nhân viên đó.</li>
            </ol>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            3. Đánh giá 360 độ (Attitude & Skill)
          </h2>
          <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
            <p>
              Điểm A (Thái độ) và S (Kỹ năng) được thu thập thông qua quy trình đánh giá chéo giữa các thành viên.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vào cuối mỗi chu kỳ dự án, tất cả các thành viên (bất kể vai trò) truy cập mục <code>Đánh giá 360°</code>.</li>
              <li>Hệ thống sẽ liệt kê các đồng nghiệp cùng tham gia dự án. Người dùng chọn từng đồng nghiệp để đánh giá số Sao (1 đến 5 sao) dựa trên Bộ tiêu chí ASK đã được Admin thiết lập ở bước 1.</li>
              <li><strong>Công thức quy đổi:</strong> Điểm sao (1-5) sẽ được hệ thống tự động quy đổi sang thang điểm 100 (Ví dụ: 5 sao = 100 điểm, 4 sao = 80 điểm) để tổng hợp vào Radar Chart.</li>
            </ul>
          </div>
        </section>

        <section className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-2">Công thức Tính điểm Năng lực Tổng quát</h2>
          <p className="text-sm text-gray-300 mb-4">Radar Chart ở màn hình chính được tính toán dựa trên trọng số mặc định:</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-primary">30%</div>
              <div className="text-sm text-gray-400 mt-1">Knowledge (MBO)</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-purple-400">35%</div>
              <div className="text-sm text-gray-400 mt-1">Attitude (360°)</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-orange-400">35%</div>
              <div className="text-sm text-gray-400 mt-1">Skill (360°)</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
