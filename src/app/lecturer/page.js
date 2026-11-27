"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Users,
  Lock,
  RefreshCw,
  Download,
  Search,
  KeyRound,
  QrCode,
  History,
  LayoutDashboard,
  ChevronRight
} from "lucide-react";

function rankStudents(list = []) {
  return [...list].sort((a, b) => {
    const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    const doneDiff =
      (b.completedBuildings?.length || 0) - (a.completedBuildings?.length || 0);
    if (doneDiff !== 0) return doneDiff;
    return String(a.nim || "").localeCompare(String(b.nim || ""));
  });
}

export default function LecturerDashboardPage() {
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [authorizedKey, setAuthorizedKey] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("active"); // "active" | "history"
  const [sessionInfo, setSessionInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [previousSessions, setPreviousSessions] = useState([]);
  const [selectedHistorySession, setSelectedHistorySession] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmNewSession, setConfirmNewSession] = useState(false);

  const createOrRefreshSession = async (keyToUse, forceNew = false) => {
    setLoadingAuth(true);
    setAuthError("");
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_class_session",
          adminKey: keyToUse,
          forceNew
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Kunci akses dosen tidak valid.");
        setLoadingAuth(false);
        return;
      }
      setAuthorizedKey(keyToUse);
      setSessionInfo(data.session || data);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.previousSessions)) setPreviousSessions(data.previousSessions);
    } catch {
      setAuthError("Terjadi kesalahan pada server saat menghubungkan sesi.");
    } finally {
      setLoadingAuth(false);
      setConfirmNewSession(false);
    }
  };

  useEffect(() => {
    if (!authorizedKey) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/submit?adminKey=${encodeURIComponent(authorizedKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.students)) setStudents(data.students);
          if (data.session) setSessionInfo(data.session);
          if (Array.isArray(data.previousSessions)) {
            setPreviousSessions(data.previousSessions);
          }
        }
      } catch {
        // abaikan error polling sesaat
      }
    };
    poll();
    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [authorizedKey]);

  const topThreeStudents = useMemo(() => rankStudents(students).slice(0, 3), [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        String(s.nim || "").toLowerCase().includes(q) ||
        String(s.nama || "").toLowerCase().includes(q);

      const lockedCount = (s.lockedBuildings || []).length;
      if (statusFilter === "locked") return matchQuery && lockedCount > 0;
      if (statusFilter === "completed")
        return matchQuery && (s.completedBuildings || []).length > 0;
      return matchQuery;
    });
  }, [students, searchQuery, statusFilter]);

  const avgScore = useMemo(() => {
    if (!students.length) return 0;
    const total = students.reduce((acc, s) => acc + Number(s.score || 0), 0);
    return (total / students.length).toFixed(1);
  }, [students]);

  const exportCsvForList = (list, labelCode) => {
    const headers = [
      "Peringkat",
      "Kode Sesi",
      "NIM",
      "Nama",
      "Skor",
      "Gedung Tuntas",
      "Gedung Terkunci"
    ];
    const sorted = rankStudents(list);
    const rows = sorted.map((s, idx) => [
      idx + 1,
      `"${labelCode || ""}"`,
      `"${s.nim || ""}"`,
      `"${(s.nama || "").replace(/"/g, '""')}"`,
      Number(s.score || 0),
      (s.completedBuildings || []).length,
      (s.lockedBuildings || []).length
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap-smart-secure-city-${labelCode || "sesi"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authorizedKey) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-sky-200 bg-white p-7 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">
                Dashboard Dosen — Smart Secure City
              </h1>
              <p className="text-xs text-slate-500">
                Masukkan kunci admin untuk membuka sesi kelas
              </p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800">
              {authError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createOrRefreshSession(adminKeyInput, false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kunci Akses Dosen (`LECTURER_ADMIN_KEY`)
              </label>
              <input
                type="password"
                required
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                placeholder="Masukkan kunci admin..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-60 cursor-pointer"
            >
              {loadingAuth ? "Memproses..." : "Buka Dashboard & Buat Sesi QR"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const classCode = sessionInfo?.classCode || "SEC-AKTIF";
  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?code=${encodeURIComponent(classCode)}`
      : `/?code=${classCode}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    joinUrl
  )}`;

  const medalStyles = [
    "from-amber-100 to-yellow-50 border-amber-300 text-amber-900",
    "from-slate-100 to-sky-50 border-slate-300 text-slate-800",
    "from-orange-100 to-amber-50 border-orange-300 text-orange-900"
  ];

  const historyStudents = rankStudents(selectedHistorySession?.students || []);
  const historyTopThree = historyStudents.slice(0, 3);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50 text-slate-900 px-4 lg:px-8 py-6">
      <div className="w-full space-y-6">
        {/* Navigasi Menu Sesi Aktif vs Detail Sesi Sebelumnya */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-white/95 px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                activeTab === "active"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-sky-50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Sesi Aktif ({classCode})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("history");
                if (!selectedHistorySession && previousSessions.length > 0) {
                  setSelectedHistorySession(previousSessions[0]);
                }
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                activeTab === "history"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50"
              }`}
            >
              <History className="h-4 w-4" />
              Detail Sesi Sebelumnya ({previousSessions.length})
            </button>
          </div>
        </div>

        {activeTab === "active" ? (
          <>
            {/* Kartu Sesi & QR Code */}
            <div className="rounded-3xl border border-sky-200 bg-white p-6 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-800">
                  <QrCode className="h-3.5 w-3.5" />
                  Sesi Aktif Perkuliahan
                </div>
                <div className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                  Kode Sesi: <span className="text-amber-600">{classCode}</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-700 break-all">
                  {joinUrl}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setConfirmNewSession(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Ganti Sesi Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => exportCsvForList(students, classCode)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Ekspor CSV / Excel
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <img
                  src={qrImageUrl}
                  alt={`QR Sesi ${classCode}`}
                  className="h-40 w-40 rounded-xl bg-white p-2 shadow-xs border border-slate-200"
                />
                <span className="mt-2 text-xs font-extrabold tracking-wider text-slate-700">
                  {classCode}
                </span>
              </div>
            </div>

            {/* Ringkasan Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-xs flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    Mahasiswa Sesi Ini
                  </div>
                  <div className="text-xl font-black text-slate-900">{students.length}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-xs flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Rata-Rata Poin Kelas</div>
                  <div className="text-xl font-black text-slate-900">{avgScore} / 100</div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-xs flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    Mahasiswa Pernah Terkunci
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {students.filter((s) => (s.lockedBuildings || []).length > 0).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Nilai Tertinggi Sesi Aktif */}
            <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base font-extrabold text-slate-900">
                    Top 3 Nilai Tertinggi ({classCode})
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Khusus peserta sesi aktif
                </span>
              </div>

              {topThreeStudents.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">
                  Belum ada data nilai mahasiswa pada sesi aktif ini.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topThreeStudents.map((s, idx) => (
                    <div
                      key={s.id || s.nim || idx}
                      className={`rounded-2xl border bg-gradient-to-br p-4 shadow-xs ${
                        medalStyles[idx] || medalStyles[2]
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-black shadow-2xs">
                          Peringkat #{idx + 1}
                        </span>
                        <span className="text-lg font-black">{Number(s.score || 0)}/100</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2.5">
                        <span className="text-2xl">{s.avatar?.emoji || "🦊"}</span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm truncate">{s.nama}</div>
                          <div className="text-xs opacity-80 truncate">NIM: {s.nim}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-[11px] font-bold flex items-center justify-between">
                        <span>Gedung Aman: {(s.completedBuildings || []).length}/10</span>
                        <span>Terkunci: {(s.lockedBuildings || []).length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Tabel Pantauan Real-Time Sesi Aktif */}
            <section className="rounded-3xl border border-sky-200 bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-sky-600" />
                  <h2 className="text-base font-extrabold text-slate-900">
                    Pantauan Real-Time ({filteredStudents.length} Mahasiswa)
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari NIM / Nama..."
                      className="rounded-xl border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="completed">Sudah Tuntas Gedung</option>
                    <option value="locked">Ada Gedung Terkunci</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                      <th className="py-3 px-3">Avatar</th>
                      <th className="py-3 px-3">NIM</th>
                      <th className="py-3 px-3">Nama</th>
                      <th className="py-3 px-3">Poin</th>
                      <th className="py-3 px-3">Gedung Dimasuki</th>
                      <th className="py-3 px-3">Terkunci (Salah 3x)</th>
                      <th className="py-3 px-3">Log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s, idx) => {
                      const completed = s.completedBuildings || [];
                      const locked = s.lockedBuildings || [];
                      const enteredCount = new Set([
                        ...completed,
                        ...locked,
                        ...Object.keys(s.buildingMistakes || {})
                      ]).size;

                      return (
                        <tr key={s.id || s.nim || idx} className="hover:bg-sky-50/50">
                          <td className="py-3 px-3 text-lg">{s.avatar?.emoji || "🦊"}</td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                            {s.nim}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">{s.nama}</td>
                          <td className="py-3 px-3 font-black text-amber-600">
                            {Number(s.score || 0)}/100
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {enteredCount}/10 (Aman: {completed.length})
                          </td>
                          <td className="py-3 px-3">
                            {locked.length > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                                {locked.length} gedung
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(s)}
                              className="font-bold text-sky-600 hover:underline cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          /* Menu Detail Sesi Sebelumnya */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Daftar Sesi Lama */}
            <section className="lg:col-span-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <History className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Riwayat Sesi Kelas
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Pilih sesi sebelumnya untuk melihat rekap nilai, Top 3, dan detail mahasiswa yang terpisah dari sesi aktif.
              </p>

              {previousSessions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                  Belum ada sesi sebelumnya yang tersimpan. Sesi lama akan otomatis masuk ke daftar ini saat Anda menekan <strong>Ganti Sesi Baru</strong>.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {previousSessions.map((ses) => {
                    const isSelected = selectedHistorySession?.classCode === ses.classCode;
                    const count = (ses.students || []).length;
                    return (
                      <button
                        key={ses.classCode}
                        type="button"
                        onClick={() => setSelectedHistorySession(ses)}
                        className={`w-full flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                          isSelected
                            ? "border-amber-400 bg-amber-50/80 shadow-xs"
                            : "border-slate-200 bg-slate-50/60 hover:border-sky-300"
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">
                            {ses.classCode}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Peserta: {count} mahasiswa
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Rincian Sesi Terpilih */}
            <section className="lg:col-span-8 rounded-3xl border border-sky-200 bg-white p-6 shadow-md space-y-5">
              {!selectedHistorySession ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  Pilih salah satu sesi di sebelah kiri untuk melihat detailnya.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        Arsip Sesi Sebelumnya
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Kode Sesi: {selectedHistorySession.classCode}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Total Peserta: {historyStudents.length} mahasiswa
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        exportCsvForList(historyStudents, selectedHistorySession.classCode)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Ekspor CSV Sesi Ini
                    </button>
                  </div>

                  {/* Top 3 Sesi Sebelumnya */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-3">
                      Top 3 Nilai Tertinggi Sesi {selectedHistorySession.classCode}
                    </h4>
                    {historyTopThree.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Tidak ada data mahasiswa pada sesi ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {historyTopThree.map((s, idx) => (
                          <div
                            key={s.id || s.nim || idx}
                            className={`rounded-2xl border bg-gradient-to-br p-3.5 ${
                              medalStyles[idx] || medalStyles[2]
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-black">
                              <span>#{idx + 1}</span>
                              <span>{Number(s.score || 0)}/100</span>
                            </div>
                            <div className="mt-2 font-extrabold text-sm truncate">
                              {s.avatar?.emoji || "🦊"} {s.nama}
                            </div>
                            <div className="text-[11px] opacity-80">NIM: {s.nim}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tabel Peserta Sesi Sebelumnya */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                          <th className="py-2.5 px-3">NIM</th>
                          <th className="py-2.5 px-3">Nama</th>
                          <th className="py-2.5 px-3">Poin</th>
                          <th className="py-2.5 px-3">Gedung Aman</th>
                          <th className="py-2.5 px-3">Log</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {historyStudents.map((s, i) => (
                          <tr key={s.id || s.nim || i} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono">{s.nim}</td>
                            <td className="py-2.5 px-3 font-bold">{s.nama}</td>
                            <td className="py-2.5 px-3 font-black text-amber-600">
                              {Number(s.score || 0)}/100
                            </td>
                            <td className="py-2.5 px-3">
                              {(s.completedBuildings || []).length}/10
                            </td>
                            <td className="py-2.5 px-3">
                              <button
                                type="button"
                                onClick={() => setSelectedStudent(s)}
                                className="font-bold text-sky-600 hover:underline cursor-pointer"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Konfirmasi Ganti Sesi Baru */}
      {confirmNewSession && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">
              Arsipkan & Buat Kode Sesi Baru?
            </h3>
            <p className="mt-2 text-xs text-slate-600">
              Data sesi <strong>{classCode}</strong> akan dipisahkan ke menu{" "}
              <strong>Detail Sesi Sebelumnya</strong> dan sesi aktif akan dimulai bersih dengan kode baru.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmNewSession(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => createOrRefreshSession(authorizedKey, true)}
                className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-extrabold text-white cursor-pointer"
              >
                Ya, Ganti Sesi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Log Mahasiswa */}
      {selectedStudent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedStudent.nama} ({selectedStudent.nim})
                </h3>
                <p className="text-xs text-slate-500">
                  Skor: {Number(selectedStudent.score || 0)}/100 • Sesi:{" "}
                  {selectedStudent.classCode || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {(selectedStudent.logs || []).length === 0 ? (
                <p className="text-xs text-slate-500">Belum ada riwayat jawaban tercatat.</p>
              ) : (
                (selectedStudent.logs || []).map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{log.buildingName}</span>{" "}
                      <span className="text-slate-500">({log.level})</span>
                    </div>
                    <span
                      className={`font-extrabold ${
                        log.result === "BENAR" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {log.result}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
