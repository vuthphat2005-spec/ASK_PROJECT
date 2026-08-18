import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamCollab - Nền tảng Đánh giá & Quản trị Nhân sự 360°",
  description: "Hệ thống quản lý năng lực, đánh giá MBO, thái độ và kỹ năng (ASK) toàn diện cho doanh nghiệp.",
  keywords: ["MBO", "Đánh giá 360", "Quản lý năng lực", "Nhân sự", "ASK"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
