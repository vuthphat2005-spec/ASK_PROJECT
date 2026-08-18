"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { LogIn, Mail } from "lucide-react";

export default function LoginForm() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !hoTen)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // Auto insert into nhan_su table
        if (data.user) {
          await supabase.from("nhan_su").insert([{
            id: data.user.id,
            email: email,
            ho_ten: hoTen,
            vai_tro: "ChuyenVien"
          }]);
        }
        
        setError("Đăng ký thành công! Vui lòng kiểm tra email (nếu có yêu cầu xác thực) hoặc đăng nhập.");
        setMode("login");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-lg text-sm text-left">
          {error}
        </div>
      )}
      
      <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
        <button
          type="button"
          onClick={() => { setMode("login"); setError(null); }}
          className={`flex-1 pb-2 transition-colors border-b-2 ${
            mode === "login" ? "border-primary text-white font-semibold" : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(null); }}
          className={`flex-1 pb-2 transition-colors border-b-2 ${
            mode === "register" ? "border-primary text-white font-semibold" : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          Đăng ký
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Họ và tên"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        )}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email công việc"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full glass-button group justify-center py-3"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          )}
          <span>{isLoading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập Hệ thống" : "Tạo Tài khoản"}</span>
        </button>
      </form>
      
      <div className="mt-6 text-xs text-muted-foreground/60 text-center">
        {mode === "login" ? "Chưa có tài khoản? Chuyển sang Đăng ký." : "Đã có tài khoản? Chuyển sang Đăng nhập."}
      </div>
    </div>
  );
}
