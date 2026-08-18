"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { LogIn, Mail } from "lucide-react";

export default function LoginForm() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
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
      
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full glass-button group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Mail className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
        )}
        <span>{isLoading ? "Đang kết nối..." : "Đăng nhập với Google Workspace"}</span>
      </button>
      
      <div className="mt-6 text-xs text-muted-foreground/60">
        Chỉ cho phép tài khoản email thuộc tổ chức (@ou.edu.vn)
      </div>
    </div>
  );
}
