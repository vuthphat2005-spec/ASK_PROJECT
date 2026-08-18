import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "@/components/sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  // Lấy thông tin user từ bảng nhan_su
  const { data: user } = await supabase
    .from("nhan_su")
    .select("vai_tro, ho_ten, avatar_url, trang_thai")
    .eq("email", session.user.email)
    .single();

  const realRole = user?.vai_tro || "ChuyenVien";
  let role = realRole;
  
  if (realRole === "Admin") {
    const cookieStore = await cookies();
    const impRole = cookieStore.get("impersonated_role")?.value;
    if (impRole) {
      role = impRole;
    }
  }

  if (user?.trang_thai === "ChoDuyet" || user?.trang_thai === "DaNghi") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {user.trang_thai === "ChoDuyet" ? "Tài khoản Đang chờ duyệt" : "Tài khoản Bị khóa"}
          </h2>
          <p className="text-gray-400 mb-6">
            {user.trang_thai === "ChoDuyet" 
              ? "Tài khoản của bạn đã được ghi nhận. Vui lòng đợi Admin kiểm duyệt và cấp quyền truy cập vào hệ thống." 
              : "Tài khoản của bạn hiện đang bị vô hiệu hóa. Vui lòng liên hệ Admin để biết thêm chi tiết."}
          </p>
          <a href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors">
            Quay lại Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} realRole={realRole} user={user} />
      
      <main className="flex-1 overflow-y-auto z-10 p-4 pt-20 md:p-8">
        {children}
      </main>
    </div>
  );
}
