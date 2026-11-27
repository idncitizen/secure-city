"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, LogIn, User, Hash, KeyRound, Sparkles, GraduationCap } from "lucide-react";

const ANIMAL_AVATARS = [
  { id: "fox", name: "Rubah", emoji: "🦊" },
  { id: "owl", name: "Burung Hantu", emoji: "🦉" },
  { id: "tiger", name: "Harimau", emoji: "🐯" },
  { id: "panda", name: "Panda", emoji: "🐼" },
  { id: "wolf", name: "Serigala", emoji: "🐺" },
  { id: "eagle", name: "Elang", emoji: "🦅" },
  { id: "octopus", name: "Gurita", emoji: "🐙" },
  { id: "bear", name: "Beruang", emoji: "🐻" },
  { id: "cat", name: "Kucing", emoji: "🐱" },
  { id: "frog", name: "Katak", emoji: "🐸" },
  { id: "lion", name: "Singa", emoji: "🦁" },
  { id: "dolphin", name: "Lumba-lumba", emoji: "🐬" }
];

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [classCode, setClassCode] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(ANIMAL_AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Otomatis isi kode sesi jika mahasiswa memindai QR Code (?code=SEC-XXXXXX)
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setClassCode(codeFromUrl.trim().toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanNim = nim.trim();
    const cleanNama = nama.trim();
    const cleanCode = classCode.trim().toUpperCase();

    if (!cleanNim || !cleanNama || !cleanCode) {
      setErrorMsg("Mohon lengkapi NIM, Nama Lengkap, dan Kode Sesi Perkuliahan.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: cleanNim,
          nama: cleanNama,
          classCode: cleanCode,
          avatarId: selectedAvatar.id,
          avatar: selectedAvatar
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Gagal masuk ke sesi. Periksa kembali kode sesi dari dosen.");
        setLoading(false);
        return;
      }

      // Gabungkan respons server dengan data profil & avatar agar terbaca utuh di /game
      const resolvedAvatar =
        ANIMAL_AVATARS.find((a) => a.id === (data.avatarId || selectedAvatar.id)) ||
        selectedAvatar;

      const studentPayload = {
        score: 0,
        completedBuildings: [],
        lockedBuildings: [],
        buildingMistakes: {},
        ...data,
        nim: data.nim || cleanNim,
        nama: data.nama || cleanNama,
        classCode: cleanCode,
        avatarId: resolvedAvatar.id,
        avatar: resolvedAvatar
      };

      sessionStorage.setItem("secure_city_student", JSON.stringify(studentPayload));
      localStorage.setItem("secure_city_student", JSON.stringify(studentPayload));
      if (data.sessionToken) {
        sessionStorage.setItem("sessionToken", data.sessionToken);
        localStorage.setItem("sessionToken", data.sessionToken);
      }

      router.push("/game");
    } catch {
      setErrorMsg("Terjadi gangguan jaringan saat menghubungkan ke server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50 flex items-center justify-center p-4 lg:p-8 text-slate-900">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-sky-200 bg-white shadow-2xl overflow-hidden">
        {/* Panel Kiri: Informasi Permainan */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-600 via-teal-600 to-emerald-600 p-7 lg:p-8 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Keamanan Perangkat Lunak
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-lg">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight leading-tight">
                  Smart Secure City
                </h1>
                <p className="text-xs text-sky-100 font-medium">
                  Simulasi Interaktif Pertahanan Kota Cerdas
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-3 text-xs text-sky-50 leading-relaxed">
              <div className="rounded-2xl bg-white/10 p-3.5 border border-white/15">
                <p className="font-bold text-white mb-1">Misi Anda di Kota:</p>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Gerakkan avatar menjelajahi 10 gedung vital perkotaan.</li>
                  <li>Jawab tantangan keamanan 1 per 1 dari level Pemula hingga Mahir.</li>
                  <li>Jawaban benar memberi +3 detik; salah mengurangi -3 detik.</li>
                  <li>Maksimal 3x kesalahan pada setiap gedung sebelum terkunci.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="text-sky-100">Akses Pengajar:</span>
            <button
              type="button"
              onClick={() => router.push("/lecturer")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 font-bold text-white transition cursor-pointer"
            >
              <GraduationCap className="h-4 w-4" />
              Dashboard Dosen
            </button>
          </div>
        </div>

        {/* Panel Kanan: Formulir Masuk Mahasiswa */}
        <div className="lg:col-span-7 p-7 lg:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Masuk Sesi Mahasiswa
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Masukkan identitas, pilih avatar hewan Anda, dan tempel kode sesi dari dosen.
          </p>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NIM Mahasiswa
                </label>
                <div className="relative">
                  <Hash className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 230101001"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kode Sesi Kelas
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    placeholder="SEC-XXXXXX"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm font-mono uppercase text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda..."
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Pilihan Avatar Hewan */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  Pilih Avatar Karakter
                </label>
                <span className="text
