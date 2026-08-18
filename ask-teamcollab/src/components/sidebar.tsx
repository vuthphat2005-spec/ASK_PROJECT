"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Báo cáo Năng lực" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Quản lý Dự án" },
  { href: "/dashboard/mbo", icon: CheckSquare, label: "Công việc (MBO)" },
  { href: "/dashboard/evaluate", icon: Users, label: "Đánh giá 360°" },
  { href: "/dashboard/admin", icon: Settings, label: "Cấu hình Hệ thống" },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 glass-panel h-screen sticky top-0 flex flex-col z-20">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">TeamCollab</h2>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
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
