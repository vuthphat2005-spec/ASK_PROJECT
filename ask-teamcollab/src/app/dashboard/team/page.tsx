"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BarChart, Search, Download, TrendingUp } from "lucide-react";

export default function TeamDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamData, setTeamData] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data: users } = await supabase.from("nhan_su").select("id, ho_ten, vai_tro, email, chuc_vu").eq("trang_thai", "HoatDong");
      
      // Fetch MBOs (Knowledge)
      const { data: mbos } = await supabase.from("muc_tieu_mbo").select("nhan_su_id, diem_nghiem_thu");
      
      // Fetch Reviews (Attitude & Skill)
      const { data: reviews } = await supabase.from("danh_gia_cheo").select(`
        nguoi_duoc_danh_gia_id, 
        diem_danh_gia,
        tieu_chi_ask ( nhom )
      `);

      // Fetch Weights
      const { data: config } = await supabase.from("cau_hinh_he_thong").select("*");
      let wK = 33.33, wA = 33.33, wS = 33.34;
      if (config && config.length > 0) {
        const k = config.find(c => c.id === 'weight_k')?.gia_tri;
        const a = config.find(c => c.id === 'weight_a')?.gia_tri;
        const s = config.find(c => c.id === 'weight_s')?.gia_tri;
        if (k) wK = parseFloat(k);
        if (a) wA = parseFloat(a);
        if (s) wS = parseFloat(s);
      }

      if (!users) return;

      const processedData = users.map(user => {
        // K Score (Trung bình MBO)
        const userMbos = mbos?.filter(m => m.nhan_su_id === user.id) || [];
        const kScore = userMbos.length > 0 
          ? userMbos.reduce((acc, curr) => acc + (curr.diem_nghiem_thu || 0), 0) / userMbos.length 
          : 0;

        // A Score (Trung bình Attitude)
        const userAttitude = reviews?.filter(r => r.nguoi_duoc_danh_gia_id === user.id && (r.tieu_chi_ask as any)?.nhom === 'Attitude') || [];
        const aScore = userAttitude.length > 0
          ? userAttitude.reduce((acc, curr) => acc + (curr.diem_danh_gia || 0), 0) / userAttitude.length
          : 0;

        // S Score (Trung bình Skill)
        const userSkill = reviews?.filter(r => r.nguoi_duoc_danh_gia_id === user.id && (r.tieu_chi_ask as any)?.nhom === 'Skill') || [];
        const sScore = userSkill.length > 0
          ? userSkill.reduce((acc, curr) => acc + (curr.diem_danh_gia || 0), 0) / userSkill.length
          : 0;

        const totalScore = (kScore * wK + aScore * wA + sScore * wS) / 100;

        return {
          ...user,
          k: Math.round(kScore),
          a: Math.round(aScore),
          s: Math.round(sScore),
          total: Math.round(totalScore)
        };
      });

      // Sắp xếp theo tổng điểm giảm dần
      processedData.sort((a, b) => b.total - a.total);
      setTeamData(processedData);

    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return alert("Không có dữ liệu để xuất");
    const headers = "Họ và tên,Email,Vai trò,Knowledge (K),Attitude (A),Skill (S),Tổng điểm";
    const rows = filteredData.map(u => 
      `"${u.ho_ten}","${u.email}","${u.vai_tro}",${u.k},${u.a},${u.s},${u.total}`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nang_luc_doi_ngu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = teamData.filter(u => u.ho_ten.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-primary/20 rounded-xl">
            <BarChart className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Năng lực Đội ngũ</h1>
            <p className="text-muted-foreground">Bảng xếp hạng tổng hợp điểm K-A-S của toàn bộ nhân sự</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân sự..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none w-full md:w-auto"
            />
          </div>
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap">
            <Download className="w-4 h-4" /> Xuất Báo cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-400">Tổng số Nhân sự</h3>
          <p className="text-3xl font-bold text-white mt-1">{teamData.length}</p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-primary mb-2">K-A-S</div>
          <h3 className="text-sm font-medium text-gray-400">Điểm trung bình hệ thống</h3>
          <p className="text-3xl font-bold text-white mt-1">
            {teamData.length > 0 ? Math.round(teamData.reduce((acc, curr) => acc + curr.total, 0) / teamData.length) : 0}
          </p>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-yellow-400 mb-2">Top 1</div>
          <h3 className="text-sm font-medium text-gray-400">Nhân sự xuất sắc nhất</h3>
          <p className="text-lg font-bold text-white mt-1 truncate w-full px-4">
            {teamData.length > 0 ? teamData[0].ho_ten : "---"}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Đang tổng hợp dữ liệu đánh giá...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold text-white/90">Hạng</th>
                  <th className="p-4 font-semibold text-white/90">Nhân sự</th>
                  <th className="p-4 font-semibold text-white/90 text-center">Knowledge (K)</th>
                  <th className="p-4 font-semibold text-white/90 text-center">Attitude (A)</th>
                  <th className="p-4 font-semibold text-white/90 text-center">Skill (S)</th>
                  <th className="p-4 font-semibold text-white/90 text-right">Tổng điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Không tìm thấy nhân sự nào.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((u, index) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                          index === 1 ? 'bg-gray-300/20 text-gray-300' : 
                          index === 2 ? 'bg-orange-600/20 text-orange-400' : 
                          'bg-white/5 text-gray-500'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">{u.ho_ten}</div>
                        <div className="text-xs text-gray-400">{u.chuc_vu || u.vai_tro}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-500/30 text-blue-400 font-bold">
                          {u.k}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-purple-500/30 text-purple-400 font-bold">
                          {u.a}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-orange-500/30 text-orange-400 font-bold">
                          {u.s}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                          {u.total}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
