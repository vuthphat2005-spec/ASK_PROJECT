"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { HardDrive, UploadCloud, Copy, CheckCircle2, Image as ImageIcon, Video, File as FileIcon } from "lucide-react";

export default function MediaStoragePage() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{name: string, url: string, type: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Xác định loại file
      let fileType = "unknown";
      if (file.type.startsWith("image/")) fileType = "image";
      else if (file.type.startsWith("video/")) fileType = "video";

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      setFiles(prev => [{name: file.name, url: publicUrl, type: fileType}, ...prev]);
    } catch (error: any) {
      alert("Lỗi khi upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <HardDrive className="w-8 h-8 text-primary" />
          Quản lý Tài nguyên (Media)
        </h1>
        <p className="text-muted-foreground">
          Tải lên hình ảnh và video để sử dụng trong hệ thống. Hệ thống hỗ trợ lấy Link trực tiếp (Public URL).
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
        <UploadCloud className="w-16 h-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Tải tệp tin lên</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Hỗ trợ định dạng hình ảnh (JPG, PNG, WEBP) và video (MP4, WebM). Các tệp tải lên sẽ được hiển thị ngay bên dưới.
        </p>
        <label className="glass-button cursor-pointer">
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            <span>Chọn tệp từ máy tính</span>
          )}
          <input 
            type="file" 
            accept="image/*,video/mp4,video/webm" 
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden" 
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Tệp vừa tải lên</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-xl flex items-center gap-4 group">
                <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center shrink-0">
                  {file.type === "image" ? (
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                  ) : file.type === "video" ? (
                    <Video className="w-6 h-6 text-purple-400" />
                  ) : (
                    <FileIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 truncate">{file.url}</p>
                </div>
                <button
                  onClick={() => handleCopy(file.url, idx)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  title="Copy URL"
                >
                  {copiedIndex === idx ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
