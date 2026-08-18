import { createClient } from "@/utils/supabase/server";
import RadarChartComponent from "./radar-chart";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Get user info
  const { data: user } = await supabase
    .from("nhan_su")
    .select("*")
    .eq("email", session?.user?.email)
    .single();

  // Mock data for the radar chart for now
  // Real implementation would query MBO and DanhGia_Cheo tables
  const mockRadarData = [
    { subject: 'MBO (Knowledge)', A: 85, fullMark: 100 },
    { subject: 'Attitude', A: 90, fullMark: 100 },
    { subject: 'Skill', A: 75, fullMark: 100 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Báo cáo Năng lực Cá nhân</h1>
        <p className="text-muted-foreground">
          Biểu đồ Radar tổng hợp năng lực ASK (Attitude - Skill - Knowledge)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 glass-panel rounded-2xl p-6 relative min-h-[400px]">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Biểu đồ Năng lực
          </h2>
          <div className="w-full h-[350px]">
            <RadarChartComponent data={mockRadarData} />
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-white/90">Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Họ và tên</p>
                <p className="font-medium text-white text-lg">{user?.ho_ten || "Vũ Thành Phát"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Vai trò</p>
                <p className="font-medium text-white">{user?.vai_tro || "Quản Lý"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Trạng thái</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm mt-1 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  Hoạt động
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-transparent">
            <h2 className="text-lg font-semibold mb-2">Điểm tổng hợp</h2>
            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              83.5
            </div>
            <p className="text-sm text-gray-400 mt-2">
              (30% MBO + 35% Attitude + 35% Skill)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
