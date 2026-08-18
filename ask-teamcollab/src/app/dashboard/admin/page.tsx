"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Settings, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "criteria">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, criteriaResponse] = await Promise.all([
        supabase.from("nhan_su").select("*"),
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

  return (
    <div className="space-y-6">
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
          <UsersTab users={users} />
        ) : (
          <CriteriaTab criteria={criteria} />
        )}
      </div>
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Danh sách Nhân sự</h2>
        <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors">
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
              <th className="py-3 px-4 font-medium">Trạng thái</th>
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
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.trang_thai === 'HoatDong' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.trang_thai === 'HoatDong' ? 'Hoạt động' : 'Đã nghỉ'}
                  </span>
                </td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">Chưa có dữ liệu nhân sự</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CriteriaTab({ criteria }: { criteria: any[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tiêu chí Đánh giá</h2>
        <button className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors">
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
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {criteria.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">Chưa có dữ liệu tiêu chí</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
