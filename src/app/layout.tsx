import type { Metadata } from "next";
import "./globals.css";
import GlobalAudio from "../components/GlobalAudio";

export const metadata: Metadata = {
  title: "LUMOS — LCĐ - LCHSV Khoa Toán - Tin",
  description: "Cổng tuyển thành viên Liên chi đoàn - Liên chi hội sinh viên Khoa Toán - Tin • Đại học Bách khoa Hà Nội",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        {children}
        <GlobalAudio />
      </body>
    </html>
  );
}
