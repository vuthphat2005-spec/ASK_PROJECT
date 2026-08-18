import { createClient } from "@/utils/supabase/server";

export default async function MBOTasksPage() {
  const supabase = createClient();
  
  // Lấy các mục tiêu MBO của nhân sự đang đăng nhập
  const { data: { session } } = await supabase.auth.getSession();
  const { data: user } = await supabase.from("nhan_su").select("id").eq("email", session?.user?.email).single();
  
  const { data: mboList } = await supabase
    .from("muc_tieu_mbo")
    .select(`*, du_an ( ten_du_an, trang_thai )`)
    .eq("nhan_su_id", user?.id || "");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Công việc của tôi (MBO)</h1>
        <p className="text-muted-foreground">Cập nhật tiến độ hoàn thành các mục tiêu được giao</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mboList?.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-gray-400 rounded-2xl">
            Bạn chưa có mục tiêu MBO nào được phân công.
          </div>
        ) : (
          mboList?.map((mbo) => (
            <div key={mbo.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded text-gray-300">
                  {mbo.du_an?.ten_du_an}
                </span>
                <span className="text-xs text-gray-400">Trọng số: <strong className="text-white">{mbo.trong_so}%</strong></span>
              </div>
              
              <h3 className="font-semibold text-lg line-clamp-2">{mbo.noi_dung}</h3>
              
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
                {mbo.du_an?.trang_thai === 'DangChay' && (
                  <button className="w-full mt-4 glass-button text-sm py-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    Cập nhật tiến độ
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
