"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckSquare, Users, Star, Download } from "lucide-react";

export default function EvaluatePage() {
  const [activeTab, setActiveTab] = useState<"mbo" | "peer">("peer");
  const [role, setRole] = useState<string>("ChuyenVien");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [mboList, setMboList] = useState<any[]>([]);
  const [peers, setPeers] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: user } = await supabase
        .from("nhan_su")
        .select("*")
        .eq("email", session.user.email)
        .single();
        
      if (user) {
        setRole(user.vai_tro);
        setCurrentUser(user);
        
        // If manager, fetch MBOs of their projects
        if (user.vai_tro === 'QuanLy' || user.vai_tro === 'Admin') {
          // This should fetch MBOs from projects managed by this user
          // For simplicity, we fetch all MBOs in this demo if they are manager
          const { data: mbos } = await supabase
            .from("muc_tieu_mbo")
            .select(`*, nhan_su (ho_ten), du_an (ten_du_an)`)
            .order("han_hoan_thanh", { ascending: true });
          if (mbos) setMboList(mbos);
        }
        
        // Fetch peers (people in same project, simplified to all active users except self for demo)
        const { data: allUsers } = await supabase
          .from("nhan_su")
          .select("*")
          .neq("id", user.id)
          .eq("trang_thai", "HoatDong");
        if (allUsers) setPeers(allUsers);
        
        // Fetch criteria
        const { data: askCriteria } = await supabase
          .from("tieu_chi_ask")
          .select("*")
          .eq("trang_thai", "Hien")
          .order("nhom");
        if (askCriteria) setCriteria(askCriteria);
      }
    } catch (error) {
      console.error("Error fetching evaluation data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Đánh giá & Nghiệm thu</h1>
          <p className="text-muted-foreground mt-1">Thực hiện đánh giá 360 độ và nghiệm thu tiến độ công việc</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("peer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "peer" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-5 h-5" />
          Đánh giá 360° (Attitude & Skill)
        </button>
        
        {(role === 'QuanLy' || role === 'Admin') && (
          <button
            onClick={() => setActiveTab("mbo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "mbo" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            Nghiệm thu MBO (Knowledge)
          </button>
        )}
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
        ) : activeTab === "peer" ? (
          <PeerReviewTab peers={peers} criteria={criteria} currentUser={currentUser} supabase={supabase} />
        ) : (
          <MboGradingTab mbos={mboList} supabase={supabase} onRefresh={fetchData} />
        )}
      </div>
    </div>
  );
}

function MboGradingTab({ mbos, supabase, onRefresh }: { mbos: any[], supabase: any, onRefresh: () => void }) {
  const handleGrade = async (mboId: string, grade: number) => {
    if (grade < 0 || grade > 100) return alert("Điểm phải từ 0-100");
    await supabase.from("muc_tieu_mbo").update({ diem_nghiem_thu: grade }).eq("id", mboId);
    onRefresh();
  };

  const exportToCSV = () => {
    if (mbos.length === 0) return alert("Không có dữ liệu để xuất");
    const headers = "Nhân sự,Dự án,Mục tiêu,Tiến độ báo cáo (%),Điểm nghiệm thu K";
    const rows = mbos.map(m => 
      `"${m.nhan_su?.ho_ten}","${m.du_an?.ten_du_an}","${m.noi_dung}",${m.tien_do},${m.diem_nghiem_thu || 0}`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nghiem_thu_mbo.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nghiệm thu tiến độ MBO</h2>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm">
          <Download className="w-4 h-4" /> Xuất CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-3 px-4 font-medium">Nhân sự</th>
              <th className="py-3 px-4 font-medium">Dự án</th>
              <th className="py-3 px-4 font-medium">Mục tiêu</th>
              <th className="py-3 px-4 font-medium text-center">Tiến độ báo cáo</th>
              <th className="py-3 px-4 font-medium text-right">Điểm nghiệm thu (K)</th>
            </tr>
          </thead>
          <tbody>
            {mbos.map((mbo) => (
              <tr key={mbo.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-medium">{mbo.nhan_su?.ho_ten}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{mbo.du_an?.ten_du_an}</td>
                <td className="py-3 px-4 text-sm max-w-xs truncate" title={mbo.noi_dung}>{mbo.noi_dung}</td>
                <td className="py-3 px-4 text-center">
                  <span className="font-bold text-primary">{mbo.tien_do}%</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <input 
                    type="number" 
                    className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-right text-white"
                    defaultValue={mbo.diem_nghiem_thu || ""}
                    placeholder="0-100"
                    onBlur={(e) => handleGrade(mbo.id, parseInt(e.target.value))}
                  />
                </td>
              </tr>
            ))}
            {mbos.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">Chưa có mục tiêu nào cần nghiệm thu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PeerReviewTab({ peers, criteria, currentUser, supabase }: { peers: any[], criteria: any[], currentUser: any, supabase: any }) {
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPeer) return;

    // Build insert payload
    const inserts = Object.entries(ratings).map(([tieuChiId, score]) => ({
      nguoi_danh_gia_id: currentUser.id,
      nguoi_duoc_danh_gia_id: selectedPeer,
      tieu_chi_id: tieuChiId,
      diem_danh_gia: score * 20, // 5 sao = 100 điểm
      nhan_xet: comments[tieuChiId] || ""
    }));

    if (inserts.length === 0) {
      alert("Vui lòng đánh giá ít nhất 1 tiêu chí.");
      return;
    }

    const { error } = await supabase.from("danh_gia_cheo").insert(inserts);
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Đã lưu đánh giá thành công!");
      setSelectedPeer(null);
      setRatings({});
      setComments({});
    }
  };

  const handleStarClick = (tieuChiId: string, star: number) => {
    setRatings(prev => ({ ...prev, [tieuChiId]: star }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Đánh giá đồng nghiệp (Attitude & Skill)</h2>
      
      {!selectedPeer ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peers.map(peer => (
            <div 
              key={peer.id} 
              className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all group"
              onClick={() => setSelectedPeer(peer.id)}
            >
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                {peer.ho_ten.charAt(0)}
              </div>
              <h3 className="font-semibold text-lg">{peer.ho_ten}</h3>
              <p className="text-sm text-gray-400">{peer.vai_tro}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
          <button 
            onClick={() => { setSelectedPeer(null); setRatings({}); setComments({}); }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            Đóng
          </button>
          <h3 className="font-semibold text-xl mb-6">
            Đánh giá: {peers.find(p => p.id === selectedPeer)?.ho_ten}
          </h3>
          
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            {criteria.map(item => {
              const currentStar = ratings[item.id] || 0;
              return (
                <div key={item.id} className="space-y-2 bg-black/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-white">
                      {item.ten_tieu_chi} 
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${item.nhom === 'Attitude' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {item.nhom}
                      </span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          onClick={() => handleStarClick(item.id, star)}
                          className={`w-6 h-6 cursor-pointer transition-colors ${star <= currentStar ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 hover:text-yellow-400/50'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{item.mo_ta}</p>
                  <input 
                    type="text" 
                    placeholder="Nhận xét (không bắt buộc)..." 
                    value={comments[item.id] || ""}
                    onChange={(e) => setComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              );
            })}
            
            <div className="pt-4">
              <button type="submit" className="glass-button w-full justify-center py-3">
                Hoàn tất đánh giá
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
