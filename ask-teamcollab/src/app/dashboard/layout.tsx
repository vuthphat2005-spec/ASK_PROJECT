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
    .select("vai_tro, ho_ten, avatar_url")
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} realRole={realRole} user={user} />
      
      <main className="flex-1 overflow-y-auto z-10 p-4 pt-20 md:p-8">
        {children}
      </main>
    </div>
  );
}
