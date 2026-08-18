"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { LogIn, Mail } from "lucide-react";

export default function LoginForm() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Chuyển hướng sau khi đăng nhập thành công
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại. Kiểm tra lại thông tin.");
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
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email công việc (@ou.edu.vn)"
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
          <span>{isLoading ? "Đang kết nối..." : "Đăng nhập Hệ thống"}</span>
        </button>
      </form>
      
      <div className="mt-6 text-xs text-muted-foreground/60 text-center">
        Chỉ cho phép tài khoản email thuộc tổ chức
      </div>
    </div>
  );
}
