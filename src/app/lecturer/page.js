"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { getAvatarById } from "@/lib/avatars";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Users, Activity, RefreshCw } from "lucide-react";

export default function LecturerDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentLog, setSelectedStudentLog] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    const q = query(collection(db, "students"), orderBy("totalScore", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => d.data()));
    });
    return () => unsub();
  }, [authenticated]);

  const handleGenerateSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_class_session", adminKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Kunci dosen salah.");
        return;
      }
      setAuthenticated(true);
      setSessionInfo(data);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "NIM",
      "Nama",
      "Avatar Hewan",
      "Skor (Maks 100)",
      "Gedung Dimasuki",
      "Gedung Terkunci/Gagal",
      "Aktivitas Terakhir"
    ];

    const rows = students.map((s) => {
      const av = getAvatarById(s.avatarId);
      return [
        `"${s.nim}"`,
        `"${s.nama}"`,
        `"${av.name}"`,
        s.totalScore || 0,
        `"${(s.visitedBuildings || []).join(";")}"`,
        `"${(s.lockedBuildings || []).join(";")}"`,
        `"${s.lastActive ? new Date(s.lastActive).toLocaleString("id-ID") : "-"}"`
      ].join(",");
    });

    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `Rekap_SmartSecureCity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h1 className="text-xl font-bold">Dashboard Dosen — Smart Secure City</h1>
          <input
            type="password"
            placeholder="Kunci Admin Dosen"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
          />
          <button
            onClick={handleGenerateSession}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
          >
            {loading ? "Memproses..." : "Buka Dashboard & Buat Sesi QR"}
          </button>
        </div>
      </div>
    );
  }

  const loginUrl =
    typeof window !== "undefined" && sessionInfo
      ? `${window.location.origin}/?code=${sessionInfo.classCode}`
      : "";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
              <QrCode className="w-5 h-5" /> Sesi Aktif Perkuliahan
            </div>
            <h1 className="text-2xl font-bold">
              Kode Sesi: <span className="font-mono text-amber-400">{sessionInfo?.classCode}</span>
            </h1>
            <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 break-all">
              {loginUrl}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateSession}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Ganti Sesi Baru
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Ekspor CSV / Excel
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl">
            {loginUrl && <QRCodeSVG value={loginUrl} size={160} />}
            <span className="text-slate-900 font-mono font-bold text-xs mt-2">{sessionInfo?.classCode}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Users className="w-5 h-5 text-blue-400" />
              Pantauan Real-Time ({students.length} Mahasiswa)
            </div>
            <span className="text-xs text-emerald-400">● Live Firestore</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-3.5">Avatar</th>
                  <th className="p-3.5">NIM</th>
                  <th className="p-3.5">Nama</th>
                  <th className="p-3.5">Poin</th>
                  <th className="p-3.5">Gedung Dimasuki</th>
                  <th className="p-3.5">Terkunci (Salah 3x)</th>
                  <th className="p-3.5">Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((s) => {
                  const av = getAvatarById(s.avatarId);
                  return (
                    <tr key={s.nim} className="hover:bg-slate-800/40">
                      <td className="p-3.5 text-xl" title={av.name}>
                        {av.emoji}
                      </td>
                      <td className="p-3.5 font-mono text-xs">{s.nim}</td>
                      <td className="p-3.5 font-medium">{s.nama}</td>
                      <td className="p-3.5 font-bold text-amber-400">{s.totalScore || 0}/100</td>
                      <td className="p-3.5 text-xs">
                        {(s.visitedBuildings || []).length}/10 ({(s.visitedBuildings || []).join(", ") || "-"})
                      </td>
                      <td className="p-3.5 text-xs text-red-400">
                        {(s.lockedBuildings || []).join(", ") || "-"}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setSelectedStudentLog(s)}
                          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Activity className="w-3.5 h-3.5" /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedStudentLog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">
                  Log: {selectedStudentLog.nama} ({selectedStudentLog.nim})
                </h3>
                <button onClick={() => setSelectedStudentLog(null)} className="text-slate-400 hover:text-white">
                  Tutup ✕
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl">
                {(selectedStudentLog.activityLogs || []).slice().reverse().map((log, i) => (
                  <div key={i} className="border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">[{new Date(log.time).toLocaleTimeString("id-ID")}]</span>{" "}
                    <span>{log.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
