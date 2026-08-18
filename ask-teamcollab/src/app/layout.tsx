import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "TeamCollab - Nền tảng Đánh giá & Quản trị Nhân sự 360°",
  description: "Hệ thống quản lý năng lực, đánh giá MBO, thái độ và kỹ năng (ASK) toàn diện cho doanh nghiệp.",
  keywords: ["MBO", "Đánh giá 360", "Quản lý năng lực", "Nhân sự", "ASK"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
