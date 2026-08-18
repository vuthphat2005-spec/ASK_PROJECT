"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users, LogOut, HardDrive } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Báo cáo Năng lực" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Quản lý Dự án" },
  { href: "/dashboard/mbo", icon: CheckSquare, label: "Công việc (MBO)" },
  { href: "/dashboard/evaluate", icon: Users, label: "Đánh giá 360°" },
  { href: "/dashboard/storage", icon: HardDrive, label: "Kho Tài nguyên" },
  { href: "/dashboard/profile", icon: Users, label: "Hồ sơ cá nhân" },
  { href: "/dashboard/admin", icon: Settings, label: "Cấu hình Hệ thống" },
  { href: "/dashboard/admin/guide", icon: Settings, label: "Cẩm nang Hệ thống" },
];

export default function Sidebar({ role, user }: { role: string, user?: any }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 glass-panel h-screen sticky top-0 flex flex-col z-20">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
        ) : (
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
            {user?.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : "TC"}
          </div>
        )}
        <div>
          <h2 className="font-bold text-lg tracking-tight">TeamCollab</h2>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Lọc hiển thị theo quyền
          if (item.href === "/dashboard/admin" && role !== "Admin") return null;
          if (item.href === "/dashboard/admin/guide" && role !== "Admin") return null;
          if (item.href === "/dashboard/projects" && role !== "Admin" && role !== "QuanLy") return null;

          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
