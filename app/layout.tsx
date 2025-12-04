import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Yüzücü Performans Takip",
  description: "Yüzme kulüplerinin sporcularının yarış performanslarını takip etme uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
