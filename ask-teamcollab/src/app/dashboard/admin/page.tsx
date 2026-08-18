"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Settings, Plus, Edit2, Trash2, X, Download, Search, Sliders } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "criteria" | "config">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("ChuyenVien");

  // Config State
  const [weightK, setWeightK] = useState(33.33);
  const [weightA, setWeightA] = useState(33.33);
  const [weightS, setWeightS] = useState(33.34);

  const supabase = createClient();

  // Modals state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [isEditCriteria, setIsEditCriteria] = useState(false);
  
  // User Form
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userRole, setUserRole] = useState("ChuyenVien");
  const [userStatus, setUserStatus] = useState("HoatDong");

  // Criteria Form
  const [critId, setCritId] = useState("");
  const [critName, setCritName] = useState("");
  const [critGroup, setCritGroup] = useState("Attitude");
  const [critDesc, setCritDesc] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: user } = await supabase.from("nhan_su").select("vai_tro").eq("email", session.user.email).single();
        if (user) setCurrentUserRole(user.vai_tro);
      }

      const [usersResponse, criteriaResponse, configResponse] = await Promise.all([
        supabase.from("nhan_su").select("*").order("created_at", { ascending: false }),
        supabase.from("tieu_chi_ask").select("*").order("nhom"),
        supabase.from("cau_hinh_he_thong").select("*")
      ]);
      
      if (usersResponse.data) setUsers(usersResponse.data);
      if (criteriaResponse.data) setCriteria(criteriaResponse.data);
      if (configResponse.data && configResponse.data.length > 0) {
        const k = configResponse.data.find(c => c.id === 'weight_k')?.gia_tri;
        const a = configResponse.data.find(c => c.id === 'weight_a')?.gia_tri;
        const s = configResponse.data.find(c => c.id === 'weight_s')?.gia_tri;
        if (k) setWeightK(parseFloat(k));
        if (a) setWeightA(parseFloat(a));
        if (s) setWeightS(parseFloat(s));
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này? (Sẽ xóa khỏi bảng nhan_su)")) return;
    const { error } = await supabase.from("nhan_su").delete().eq("id", id);
    if (error) alert("Lỗi: " + error.message);
    else fetchData();
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("nhan_su").update({
      vai_tro: userRole,
      trang_thai: userStatus
    }).eq("id", selectedUserId);

    if (error) alert("Lỗi: " + error.message);
    else {
      setShowEditUserModal(false);
      fetchData();
    }
  };

  const handleDeleteCriteria = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tiêu chí này?")) return;
    const { error } = await supabase.from("tieu_chi_ask").delete().eq("id", id);
    if (error) alert("Lỗi: " + error.message);
    else fetchData();
  };

  const handleSaveCriteria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditCriteria) {
      const { error } = await supabase.from("tieu_chi_ask").update({
        ten_tieu_chi: critName,
        nhom: critGroup,
        mo_ta: critDesc
      }).eq("id", critId);
      if (error) alert("Lỗi: " + error.message);
      else {
        setShowCriteriaModal(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("tieu_chi_ask").insert([{
        ten_tieu_chi: critName,
        nhom: critGroup,
        mo_ta: critDesc
      }]);
      if (error) alert("Lỗi: " + error.message);
      else {
        setShowCriteriaModal(false);
        fetchData();
      }
    }
  };

  const handleSaveConfig = async () => {
    if (Math.round(weightK + weightA + weightS) !== 100) {
      return alert("Tổng trọng số phải bằng 100%");
    }
    setLoading(true);
    const updates = [
      { id: 'weight_k', gia_tri: weightK.toString(), mo_ta: 'Trọng số cho Knowledge (%)' },
      { id: 'weight_a', gia_tri: weightA.toString(), mo_ta: 'Trọng số cho Attitude (%)' },
      { id: 'weight_s', gia_tri: weightS.toString(), mo_ta: 'Trọng số cho Skill (%)' }
    ];
    
    const { error } = await supabase.from("cau_hinh_he_thong").upsert(updates);
    setLoading(false);
    if (error) alert("Lỗi khi lưu cấu hình: " + error.message);
    else alert("Lưu cấu hình thành công! Các chỉ số Năng lực sẽ được tính lại dựa trên trọng số này.");
  };

  const openAddCriteria = () => {
    setIsEditCriteria(false);
    setCritName("");
    setCritGroup("Attitude");
    setCritDesc("");
    setShowCriteriaModal(true);
  };

  const openEditCriteria = (item: any) => {
    setIsEditCriteria(true);
    setCritId(item.id);
    setCritName(item.ten_tieu_chi);
    setCritGroup(item.nhom);
    setCritDesc(item.mo_ta);
    setShowCriteriaModal(true);
  };

  const openEditUser = (user: any) => {
    setSelectedUserId(user.id);
    setUserRole(user.vai_tro);
    setUserStatus(user.trang_thai);
    setShowEditUserModal(true);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return alert("Không có dữ liệu để xuất");
    
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => u.ho_ten.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCriteria = criteria.filter(c => c.ten_tieu_chi.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Quản trị Hệ thống</h1>
        <div className="flex items-center gap-4">
          {activeTab !== 'config' && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none"
                />
              </div>
              <button 
                onClick={() => exportToCSV(activeTab === 'users' ? filteredUsers : filteredCriteria, activeTab === 'users' ? 'nhan_su' : 'tieu_chi')} 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" /> Xuất CSV
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "users" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-5 h-5" />
          Quản lý Nhân sự
        </button>
        <button
          onClick={() => setActiveTab("criteria")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "criteria" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Settings className="w-5 h-5" />
          Tiêu chí Đánh giá (ASK)
        </button>
        {currentUserRole === "Admin" && (
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "config" ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sliders className="w-5 h-5" />
            Cấu hình Trọng số (K-A-S)
          </button>
        )}
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
        ) : activeTab === "users" ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-3 px-4 font-medium">Họ và tên</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium">Vai trò</th>
                    <th className="py-3 px-4 font-medium">Trạng thái</th>
                    <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">{user.ho_ten}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.vai_tro === 'Admin' ? 'bg-red-500/20 text-red-400' :
                          user.vai_tro === 'QuanLy' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {user.vai_tro}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.trang_thai === 'HoatDong' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.trang_thai === 'HoatDong' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex justify-end gap-2">
                        {currentUserRole === "Admin" && (
                          <>
                            <button onClick={() => openEditUser(user)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-400">Không tìm thấy dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "criteria" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tiêu chí Đánh giá</h2>
              {currentUserRole === "Admin" && (
                <button onClick={openAddCriteria} className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Thêm Tiêu chí
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-3 px-4 font-medium">Tên tiêu chí</th>
                    <th className="py-3 px-4 font-medium">Nhóm</th>
                    <th className="py-3 px-4 font-medium">Mô tả</th>
                    <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCriteria.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium">{item.ten_tieu_chi}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.nhom === 'Attitude' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {item.nhom}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm max-w-xs truncate" title={item.mo_ta}>{item.mo_ta}</td>
                      <td className="py-3 px-4 flex justify-end gap-2">
                        {currentUserRole === "Admin" && (
                          <>
                            <button onClick={() => openEditCriteria(item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCriteria(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredCriteria.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-gray-400">Không tìm thấy dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 py-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Tùy biến Thuật toán K-A-S</h2>
              <p className="text-gray-400">Điều chỉnh mức độ quan trọng của từng yếu tố Năng lực khi tính Tổng điểm. Tổng 3 yếu tố phải bằng 100%.</p>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-blue-500/20">
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-blue-400">Knowledge (Kiến thức / Hiệu suất MBO)</label>
                  <span className="font-bold text-white">{weightK}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="1"
                  value={weightK} onChange={(e) => setWeightK(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-purple-400">Attitude (Thái độ)</label>
                  <span className="font-bold text-white">{weightA}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="1"
                  value={weightA} onChange={(e) => setWeightA(Number(e.target.value))}
                  className="w-full accent-purple-500" 
                />
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-orange-500/20">
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-orange-400">Skill (Kỹ năng mềm)</label>
                  <span className="font-bold text-white">{weightS}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="1"
                  value={weightS} onChange={(e) => setWeightS(Number(e.target.value))}
                  className="w-full accent-orange-500" 
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/10">
                <span className="text-gray-400 font-medium">Tổng cộng:</span>
                <span className={`text-2xl font-bold ${Math.round(weightK + weightA + weightS) === 100 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.round(weightK + weightA + weightS)}%
                </span>
              </div>

              <button 
                onClick={handleSaveConfig}
                disabled={Math.round(weightK + weightA + weightS) !== 100}
                className="w-full py-3 glass-button font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Lưu Cấu hình Trọng số
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowEditUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white">Chỉnh sửa Nhân sự</h3>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Vai trò</label>
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="Admin">Admin (Quản trị viên)</option>
                  <option value="QuanLy">QuanLy (Quản lý dự án)</option>
                  <option value="ChuyenVien">ChuyenVien (Chuyên viên)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Trạng thái</label>
                <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="HoatDong">Hoạt động</option>
                  <option value="DaNghi">Khóa / Đã nghỉ</option>
                </select>
              </div>
              <button type="submit" className="w-full glass-button justify-center py-2.5 mt-4">Lưu thay đổi</button>
            </form>
          </div>
        </div>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowCriteriaModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white">{isEditCriteria ? "Sửa" : "Thêm"} Tiêu chí Đánh giá</h3>
            <form onSubmit={handleSaveCriteria} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên tiêu chí</label>
                <input required value={critName} onChange={(e) => setCritName(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nhóm (Attitude / Skill)</label>
                <select value={critGroup} onChange={(e) => setCritGroup(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="Attitude">Attitude (Thái độ)</option>
                  <option value="Skill">Skill (Kỹ năng)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mô tả chi tiết</label>
                <textarea required value={critDesc} onChange={(e) => setCritDesc(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
              </div>
              <button type="submit" className="w-full glass-button justify-center py-2.5 mt-4">Lưu Tiêu chí</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
