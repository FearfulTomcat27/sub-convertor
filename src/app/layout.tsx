import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sub Convertor - VLESS 转 YAML",
  description: "将 VLESS 链接转换为 Clash YAML 配置文件",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}