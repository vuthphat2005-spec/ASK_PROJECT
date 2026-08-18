"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Lock, Save, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [hoTen, setHoTen] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: userData } = await supabase
        .from("nhan_su")
        .select("*")
        .eq("email", session.user.email)
        .single();
        
      if (userData) {
        setUser(userData);
        setHoTen(userData.ho_ten);
        setAvatarUrl(userData.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      setMessage(null);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Vui lòng chọn một file ảnh.");
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update database
      const { error: updateError } = await supabase
        .from('nhan_su')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Lỗi khi upload ảnh!" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    try {
      // Cập nhật tên trong bảng nhan_su
      if (hoTen !== user.ho_ten) {
        await supabase.from("nhan_su").update({ ho_ten: hoTen }).eq("id", user.id);
      }
      
      // Cập nhật mật khẩu trong Supabase Auth nếu có nhập
      if (newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setNewPassword(""); // Xóa field sau khi đổi thành công
      }
      
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra khi cập nhật." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Hồ sơ Cá nhân
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin tài khoản và bảo mật
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        {loading ? (
          <div className="text-center py-4 text-gray-400">Đang tải thông tin...</div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {message && (
              <div className={`p-4 rounded-lg text-sm border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Ảnh Đại diện</h3>
              
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-primary/50" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Đổi ảnh đại diện
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Thông tin Cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email (Không thể đổi)</label>
                  <input 
                    type="email" 
                    value={user?.email || ""} 
                    disabled
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Vai trò</label>
                  <input 
                    type="text" 
                    value={user?.vai_tro || ""} 
                    disabled
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Họ và Tên</label>
                <input 
                  type="text" 
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Bảo mật
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
