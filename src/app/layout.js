import "./globals.css";

export const metadata = {
  title: "Smart Secure City — Keamanan Perangkat Lunak",
  description: "Simulasi kota cerdas 3D untuk pembelajaran Keamanan Perangkat Lunak",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
