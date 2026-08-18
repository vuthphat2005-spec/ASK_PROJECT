"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FolderKanban, Plus, X } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [tenDuAn, setTenDuAn] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("du_an").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("du_an").insert([{
      ten_du_an: tenDuAn,
      ngay_bat_dau: ngayBatDau,
      ngay_ket_thuc: ngayKetThuc,
      trang_thai: "DangChay"
    }]);

    if (error) {
      alert("Lỗi khi tạo dự án: " + error.message);
    } else {
      setShowModal(false);
      setTenDuAn("");
      setNgayBatDau("");
      setNgayKetThuc("");
      fetchProjects();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <FolderKanban className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Quản lý Dự án</h1>
            <p className="text-muted-foreground">Khởi tạo và phân công dự án mới</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo dự án mới
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
        ) : (
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
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Chưa có dự án nào được tạo.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{p.ten_du_an}</td>
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
        )}
      </div>

      {/* Modal Tạo Dự án */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white">Tạo Dự án Mới</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên dự án</label>
                <input required value={tenDuAn} onChange={(e) => setTenDuAn(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="Ví dụ: Nâng cấp Hệ thống..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Ngày bắt đầu</label>
                  <input required value={ngayBatDau} onChange={(e) => setNgayBatDau(e.target.value)} type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Ngày kết thúc</label>
                  <input required value={ngayKetThuc} onChange={(e) => setNgayKetThuc(e.target.value)} type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
              <button type="submit" className="w-full glass-button justify-center py-2.5 mt-4">Tạo Dự án</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
