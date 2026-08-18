"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users, LogOut, HardDrive, Menu, X, BarChart } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Báo cáo Năng lực" },
  { href: "/dashboard/team", icon: BarChart, label: "Năng lực Đội ngũ" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Quản lý Dự án" },
  { href: "/dashboard/mbo", icon: CheckSquare, label: "Công việc (MBO)" },
  { href: "/dashboard/evaluate", icon: Users, label: "Đánh giá 360°" },
  { href: "/dashboard/storage", icon: HardDrive, label: "Kho Tài nguyên" },
  { href: "/dashboard/profile", icon: Users, label: "Hồ sơ cá nhân" },
  { href: "/dashboard/admin", icon: Settings, label: "Quản trị Hệ thống" },
  { href: "/dashboard/admin/guide", icon: Settings, label: "Cẩm nang Hệ thống" },
];

export default function Sidebar({ role, realRole, user }: { role: string, realRole?: string, user?: any }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 border-b border-white/10 glass-panel z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary text-xs">
              {user?.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : "TC"}
            </div>
          )}
          <span className="font-bold text-white tracking-tight">TeamCollab</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-gray-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 flex-shrink-0 border-r border-white/10 glass-panel flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                {user?.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : "TC"}
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white">TeamCollab</h2>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>
          
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {realRole === "Admin" && (
          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 block">
              Góc nhìn (Impersonate)
            </label>
            <select
              value={role}
              onChange={(e) => {
                const selected = e.target.value;
                if (selected === "Admin") {
                  document.cookie = "impersonated_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                } else {
                  document.cookie = `impersonated_role=${selected}; path=/; max-age=86400`;
                }
                window.location.reload();
              }}
              className="w-full bg-[#111] border border-white/20 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="Admin">Admin</option>
              <option value="QuanLy">QuanLy</option>
              <option value="ChuyenVien">ChuyenVien</option>
            </select>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            // Lọc hiển thị theo quyền
            if (item.href === "/dashboard/admin" && role !== "Admin" && role !== "QuanLy") return null;
            if (item.href === "/dashboard/team" && role !== "Admin" && role !== "QuanLy") return null;
            if (item.href === "/dashboard/admin/guide" && role !== "Admin") return null;
            if (item.href === "/dashboard/projects" && role !== "Admin" && role !== "QuanLy") return null;

            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close on mobile click
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? "bg-primary/20 text-white font-medium border border-primary/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
