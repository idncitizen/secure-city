import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Smart Secure City — Praktikum Keamanan Perangkat Lunak",
  description:
    "Game simulasi kota cerdas 3D dengan 10 gedung, 3 tingkatan tantangan (pemula, menengah, mahir), batas salah 3x per gedung, dan validasi server-side untuk perkuliahan Keamanan Perangkat Lunak.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
