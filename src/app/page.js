"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, UserCheck } from "lucide-react";
import { ANIMAL_AVATARS } from "@/lib/avatars";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [classCode, setClassCode] = useState("");
  const [avatarId, setAvatarId] = useState("fox");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) setClassCode(codeFromUrl.toUpperCase());
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, nama, classCode, avatarId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal masuk sesi.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("ssc_session", JSON.stringify(data));
      router.push("/game");
    } catch {
      setError("Koneksi bermasalah.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart Secure City</h1>
            <p className="text-xs text-slate-400">Skor Maks 100 • 10 Gedung • Salah 3x Terlempar</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Pilih Avatar Hewan Profil
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ANIMAL_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatarId(av.id)}
                  title={av.name}
                  className={`p-2 rounded-xl text-2xl border transition flex flex-col items-center ${
                    avatarId === av.id
                      ? "bg-blue-600/30 border-blue-400 scale-105"
                      : "bg-slate-800 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <span>{av.emoji}</span>
                  <span className="text-[9px] text-slate-300 truncate w-full text-center mt-0.5">
                    {av.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">NIM Mahasiswa</label>
            <input
              type="text"
              required
              placeholder="Contoh: 230101001"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Nama mahasiswa"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kode Sesi Kuliah</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="SEC-XXXXXX"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold flex items-center justify-center gap-2"
          >
            <UserCheck className="w-5 h-5" />
            {loading ? "Memverifikasi..." : "Masuk ke Kota"}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
          <span>Akses 1x per gedung • Max salah 3x</span>
          <a href="/lecturer" className="text-blue-400 hover:underline">
            Panel Dosen →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-8">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
