"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckSquare, Plus, X, Save, Download, ListTodo } from "lucide-react";

export default function MBOTasksPage() {
  const [activeTab, setActiveTab] = useState<"my_tasks" | "all_tasks">("my_tasks");
  const [myMboList, setMyMboList] = useState<any[]>([]);
  const [allMboList, setAllMboList] = useState<any[]>([]);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMbo, setSelectedMbo] = useState<any>(null);
  const [newProgress, setNewProgress] = useState(0);

  const [showAssignModal, setShowAssignModal] = useState(false);
  // Assign Form
  const [assignProjectId, setAssignProjectId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignContent, setAssignContent] = useState("");
  const [assignWeight, setAssignWeight] = useState(10);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: user } = await supabase.from("nhan_su").select("*").eq("email", session.user.email).single();
    if (user) setCurrentUser(user);

    // Lấy MBO của user này
    const { data: myMbos } = await supabase
      .from("muc_tieu_mbo")
      .select(`*, du_an ( ten_du_an, trang_thai )`)
      .eq("nhan_su_id", user?.id || "");
    if (myMbos) setMyMboList(myMbos);

    // Nếu là Admin hoặc QuanLy, lấy list dự án, nhân sự và TẤT CẢ MBO
    if (user && (user.vai_tro === "Admin" || user.vai_tro === "QuanLy")) {
      const [pRes, uRes, allMboRes] = await Promise.all([
        supabase.from("du_an").select("id, ten_du_an").eq("trang_thai", "DangChay"),
        supabase.from("nhan_su").select("id, ho_ten").eq("trang_thai", "HoatDong"),
        supabase.from("muc_tieu_mbo").select(`*, du_an ( ten_du_an, trang_thai ), nhan_su ( ho_ten )`)
      ]);
      if (pRes.data) setProjects(pRes.data);
      if (uRes.data) setUsers(uRes.data);
      if (allMboRes.data) setAllMboList(allMboRes.data);
    }

    setLoading(false);
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMbo) return;
    
    const { error } = await supabase
      .from("muc_tieu_mbo")
      .update({ tien_do: newProgress })
      .eq("id", selectedMbo.id);
      
    if (error) alert("Lỗi: " + error.message);
    else {
      setShowUpdateModal(false);
      fetchData();
    }
  };

  const handleAssignMbo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("muc_tieu_mbo").insert([{
      du_an_id: assignProjectId,
      nhan_su_id: assignUserId,
      noi_dung: assignContent,
      trong_so: assignWeight,
      tien_do: 0
    }]);

    if (error) alert("Lỗi: " + error.message);
    else {
      setShowAssignModal(false);
      setAssignContent("");
      fetchData();
    }
  };

  const exportToCSV = () => {
    const listToExport = activeTab === "my_tasks" ? myMboList : allMboList;
    if (listToExport.length === 0) return alert("Không có dữ liệu để xuất");
    
    const headers = activeTab === "my_tasks" 
      ? "Tên dự án,Mục tiêu,Trọng số (%),Tiến độ (%)"
      : "Nhân sự,Tên dự án,Mục tiêu,Trọng số (%),Tiến độ (%)";

    const rows = listToExport.map(m => {
      if (activeTab === "my_tasks") {
        return `"${m.du_an?.ten_du_an}","${m.noi_dung}",${m.trong_so},${m.tien_do}`;
      } else {
        return `"${m.nhan_su?.ho_ten}","${m.du_an?.ten_du_an}","${m.noi_dung}",${m.trong_so},${m.tien_do}`;
      }
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mbo_danh_sach.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isManager = currentUser?.vai_tro === "Admin" || currentUser?.vai_tro === "QuanLy";
  const displayList = activeTab === "my_tasks" ? myMboList : allMboList;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Công việc (MBO)</h1>
            <p className="text-muted-foreground">Cập nhật tiến độ hoàn thành các mục tiêu được giao</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" /> Xuất CSV
          </button>
          {isManager && (
            <button onClick={() => setShowAssignModal(true)} className="glass-button flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Giao mục tiêu MBO
            </button>
          )}
        </div>
      </div>

      {isManager && (
        <div className="flex gap-4 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("my_tasks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "my_tasks" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            Việc của tôi
          </button>
          <button
            onClick={() => setActiveTab("all_tasks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "all_tasks" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ListTodo className="w-5 h-5" />
            Quản lý toàn bộ MBO
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-8 text-center text-gray-400">Đang tải dữ liệu...</div>
        ) : displayList.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-gray-400 rounded-2xl">
            Chưa có mục tiêu MBO nào được hiển thị.
          </div>
        ) : (
          displayList.map((mbo) => (
            <div key={mbo.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded text-gray-300">
                  {mbo.du_an?.ten_du_an}
                </span>
                <span className="text-xs text-gray-400">Trọng số: <strong className="text-white">{mbo.trong_so}%</strong></span>
              </div>
              
              {activeTab === "all_tasks" && (
                <div className="text-xs text-primary font-medium">Nhân sự: {mbo.nhan_su?.ho_ten}</div>
              )}
              
              <h3 className="font-semibold text-lg line-clamp-2 text-white">{mbo.noi_dung}</h3>
              
              <div className="mt-auto pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tiến độ hiện tại</span>
                  <span className="font-bold text-primary">{mbo.tien_do}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                    style={{ width: `${mbo.tien_do}%` }}
                  />
                </div>
                {mbo.du_an?.trang_thai === 'DangChay' && (activeTab === "my_tasks" || isManager) && (
                  <button 
                    onClick={() => {
                      setSelectedMbo(mbo);
                      setNewProgress(mbo.tien_do);
                      setShowUpdateModal(true);
                    }}
                    className="w-full mt-4 glass-button text-sm py-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    Cập nhật tiến độ
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Cập nhật Tiến độ */}
      {showUpdateModal && selectedMbo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowUpdateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-white">Cập nhật Tiến độ</h3>
            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{selectedMbo.noi_dung}</p>
            
            <form onSubmit={handleUpdateProgress} className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Tiến độ hoàn thành</label>
                  <span className="text-primary font-bold">{newProgress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="5"
                  value={newProgress} 
                  onChange={(e) => setNewProgress(parseInt(e.target.value))} 
                  className="w-full accent-primary" 
                />
              </div>
              <button type="submit" className="w-full glass-button flex items-center justify-center gap-2 py-2.5 mt-4">
                <Save className="w-4 h-4" /> Lưu Tiến độ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Giao việc MBO */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white">Giao Mục tiêu (MBO)</h3>
            
            <form onSubmit={handleAssignMbo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Dự án</label>
                <select required value={assignProjectId} onChange={(e) => setAssignProjectId(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="" disabled>-- Chọn dự án --</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.ten_du_an}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nhân sự thực hiện</label>
                <select required value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="" disabled>-- Chọn nhân sự --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.ho_ten}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nội dung công việc</label>
                <textarea required value={assignContent} onChange={(e) => setAssignContent(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="Mô tả mục tiêu..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Trọng số MBO (%)</label>
                <input required type="number" min="1" max="100" value={assignWeight} onChange={(e) => setAssignWeight(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
              </div>
              <button type="submit" className="w-full glass-button justify-center py-2.5 mt-4">Giao việc</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
