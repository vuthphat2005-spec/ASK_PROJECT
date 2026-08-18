import { createClient } from "@/utils/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("du_an").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Dự án</h1>
          <p className="text-muted-foreground">Khởi tạo và phân công dự án mới</p>
        </div>
        <button className="glass-button">
          + Tạo dự án mới
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-white/90">Tên dự án</th>
              <th className="p-4 font-semibold text-white/90">Thời gian</th>
              <th className="p-4 font-semibold text-white/90">Trạng thái</th>
              <th className="p-4 font-semibold text-white/90 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Chưa có dự án nào được tạo.
                </td>
              </tr>
            ) : (
              projects?.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{p.ten_du_an}</td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(p.ngay_bat_dau).toLocaleDateString("vi-VN")} - {new Date(p.ngay_ket_thuc).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                      p.trang_thai === 'DangChay' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {p.trang_thai === 'DangChay' ? 'Đang chạy' : 'Đã đóng'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
