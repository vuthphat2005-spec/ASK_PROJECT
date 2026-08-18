import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  // Lấy thông tin user từ bảng nhan_su
  const { data: user } = await supabase
    .from("nhan_su")
    .select("vai_tro")
    .eq("email", session.user.email)
    .single();

  const role = user?.vai_tro || "ChuyenVien";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Sidebar role={role} />
      
      <main className="flex-1 overflow-y-auto z-10 p-8">
        {children}
      </main>
    </div>
  );
}
