"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Handle Supabase Auth Hash (when user clicks link in email)
  useEffect(() => {
    // Supabase automatically handles the hash in URL and sets the session
    // We just need to check if there's a session to allow updating password
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Không tìm thấy phiên làm việc hợp lệ. Link có thể đã hết hạn.");
      }
    };
    checkSession();
  }, [supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess("Cập nhật mật khẩu thành công! Chuyển hướng sau 3 giây...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">
            Đặt lại Mật khẩu
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
          
          <div className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-lg text-sm text-left">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm text-left">
                {success}
              </div>
            )}
            
            <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu mới"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Xác nhận Mật khẩu</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full glass-button group justify-center py-3 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Lưu Mật khẩu mới</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
