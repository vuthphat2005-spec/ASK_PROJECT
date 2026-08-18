"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Settings, Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "criteria">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  
  // User Form
  const [userEmail, setUserEmail] = useState("");
  const [userHoTen, setUserHoTen] = useState("");
  const [userRole, setUserRole] = useState("ChuyenVien");
  const [userPassword, setUserPassword] = useState("");

  // Criteria Form
  const [critName, setCritName] = useState("");
  const [critGroup, setCritGroup] = useState("Attitude");
  const [critDesc, setCritDesc] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, criteriaResponse] = await Promise.all([
        supabase.from("nhan_su").select("*").order("created_at", { ascending: false }),
        supabase.from("tieu_chi_ask").select("*").order("nhom")
      ]);
      
      if (usersResponse.data) setUsers(usersResponse.data);
      if (criteriaResponse.data) setCriteria(criteriaResponse.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân sự này? (Hành động này sẽ xóa khỏi bảng nhan_su)")) return;
    const { error } = await supabase.from("nhan_su").delete().eq("id", id);
    if (error) alert("Lỗi: " + error.message);
    else fetchData();
  };

  const handleDeleteCriteria = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tiêu chí này?")) return;
    const { error } = await supabase.from("tieu_chi_ask").delete().eq("id", id);
    if (error) alert("Lỗi: " + error.message);
    else fetchData();
  };

  const handleAddCriteria = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Quản trị Hệ thống</h1>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
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
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
        ) : activeTab === "users" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh sách Nhân sự</h2>
              {/* Nút Thêm User tạm thời disable vì phải dùng admin auth API hoặc trigger để tạo auth user */}
              <button disabled title="Đăng ký tài khoản ở trang Đăng nhập" className="flex items-center gap-2 bg-white/10 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                <Plus className="w-4 h-4" />
                Thêm Nhân sự
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-3 px-4 font-medium">Họ và tên</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium">Vai trò</th>
                    <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
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
                      <td className="py-3 px-4 flex justify-end gap-2">
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tiêu chí Đánh giá</h2>
              <button onClick={() => setShowCriteriaModal(true)} className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Thêm Tiêu chí
              </button>
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
                  {criteria.map((item) => (
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
                        <button onClick={() => handleDeleteCriteria(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl relative">
            <button onClick={() => setShowCriteriaModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Thêm Tiêu chí Đánh giá</h3>
            <form onSubmit={handleAddCriteria} className="space-y-4">
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
