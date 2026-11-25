"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import RobloxCityMap from "@/components/RobloxCityMap";
import { ANIMAL_AVATARS, getAvatarById } from "@/lib/avatars";
import { Trophy, AlertTriangle, CheckCircle2, DoorOpen, Lock, LogOut } from "lucide-react";

const LEVEL_META = {
  pemula: { label: "Pemula (3 Soal • 1 pt)", count: 3 },
  menengah: { label: "Menengah (2 Soal • 2 pt)", count: 2 },
  mahir: { label: "Mahir (1 Soal • 3 pt)", count: 1 },
};

export default function GamePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [progress, setProgress] = useState({
    totalScore: 0,
    activeBuildingId: null,
    visitedBuildings: [],
    lockedBuildings: [],
    completedBuildings: [],
    buildingWrongAttempts: {},
    completedQuestions: {},
  });
  const [previewBuildingId, setPreviewBuildingId] = useState(1);
  const [activeLevel, setActiveLevel] = useState("pemula");
  const [bannerMsg, setBannerMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadState = useCallback(async (sess) => {
    const res = await fetch(`/api/submit?nim=${sess.nim}&token=${sess.sessionToken}`);
    if (!res.ok) {
      sessionStorage.removeItem("ssc_session");
      router.push("/");
      return;
    }
    const data = await res.json();
    setBuildings(data.buildings);
    setProgress(data.progress);
    if (data.progress.activeBuildingId) {
      setPreviewBuildingId(data.progress.activeBuildingId);
    }
  }, [router]);

  useEffect(() => {
    const raw = sessionStorage.getItem("ssc_session");
    if (!raw) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(raw);
    setSession(parsed);
    loadState(parsed);
  }, [router, loadState]);

  const handleChangeAvatar = async (newAvatarId) => {
    if (!session) return;
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_avatar",
        nim: session.nim,
        sessionToken: session.sessionToken,
        avatarId: newAvatarId,
      }),
    });
    if (res.ok) {
      const updated = { ...session, avatarId: newAvatarId };
      setSession(updated);
      sessionStorage.setItem("ssc_session", JSON.stringify(updated));
      setProgress((prev) => ({ ...prev, avatarId: newAvatarId }));
    }
  };

  const handleEnterBuilding = async (bId) => {
    if (!session || busy) return;
    setBusy(true);
    setBannerMsg(null);
    try {
      const res = await fetch("/api/building", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: session.nim,
          sessionToken: session.sessionToken,
          buildingId: bId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBannerMsg({ type: "error", text: data.error });
        await loadState(session);
        return;
      }
      setActiveLevel("pemula");
      await loadState(session);
      setBannerMsg({
        type: "info",
        text: `Anda memasuki Gedung ${bId}. Akses hanya 1x dan maksimal salah 3x di gedung ini.`,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleExitBuilding = async () => {
    if (!session || !progress.activeBuildingId || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: session.nim,
          token: session.sessionToken,
          action: "exit_building",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBannerMsg({ type: "warning", text: data.reason });
        await loadState(session);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAnswer = async (questionId, optionIndex) => {
    if (!session || !progress.activeBuildingId || busy) return;
    setBusy(true);
    setBannerMsg(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nim: session.nim,
          token: session.sessionToken,
          buildingId: progress.activeBuildingId,
          level: activeLevel,
          questionId,
          selectedOption: optionIndex,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBannerMsg({ type: "error", text: data.error });
        await loadState(session);
        return;
      }

      if (data.ejected) {
        setBannerMsg({ type: "error", text: data.ejectReason });
        await loadState(session);
        return;
      }

      if (data.correct) {
        setBannerMsg({
          type: "success",
          text: `Jawaban BENAR! +${data.addedScore} poin. Total poin Anda: ${data.totalScore}/100.`,
        });
      } else {
        setBannerMsg({
          type: "warning",
          text: `Jawaban SALAH di gedung ini (${data.wrongAttemptsInBuilding}/3 salah). Sisa kesempatan salah: ${data.remainingWrongAttempts}x.`,
        });
      }

      await loadState(session);
    } finally {
      setBusy(false);
    }
  };

  if (!session || buildings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Memuat Smart Secure City...
      </div>
    );
  }

  const avatar = getAvatarById(progress.avatarId || session.avatarId);
  const isInsideBuilding = Boolean(progress.activeBuildingId);
  const currentBuilding =
    buildings.find((b) => b.id === (progress.activeBuildingId || previewBuildingId)) || buildings[0];

  const isVisitedOrLocked =
    (progress.visitedBuildings || []).includes(currentBuilding.id) ||
    (progress.lockedBuildings || []).includes(currentBuilding.id);

  const wrongInCurrentBuilding = progress.buildingWrongAttempts?.[currentBuilding.id] || 0;
  const remainingWrong = Math.max(0, 3 - wrongInCurrentBuilding);
  const levelQuestions = currentBuilding.levels[activeLevel] || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-14">
      {/* Header Profil & Skor */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            {avatar.emoji}
          </span>
          <div>
            <p className="text-[11px] text-slate-400 font-mono">
              {session.nim} • {avatar.name}
            </p>
            <h2 className="text-sm font-bold truncate max-w-[155px]">{session.nama}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300 text-sm">{progress.totalScore}/100</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("ssc_session");
              router.push("/");
            }}
            className="p-2 text-slate-400 hover:text-red-400"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Pemilih Avatar Hewan Bebas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0">Avatar Hewan:</span>
          <div className="flex gap-1.5">
            {ANIMAL_AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => handleChangeAvatar(av.id)}
                title={av.name}
                className={`px-2 py-1 rounded-lg text-lg border transition ${
                  avatar.id === av.id
                    ? "bg-blue-600/30 border-blue-400"
                    : "bg-slate-950 border-slate-800 opacity-75 hover:opacity-100"
                }`}
              >
                {av.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Notifikasi Status */}
        {bannerMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2 ${
              bannerMsg.type === "error"
                ? "bg-red-500/15 border-red-500/40 text-red-200"
                : bannerMsg.type === "warning"
                ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                : bannerMsg.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                : "bg-blue-500/15 border-blue-500/40 text-blue-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{bannerMsg.text}</span>
          </div>
        )}

        {/* Peta 3D Roblox-Style */}
        <RobloxCityMap
          buildings={buildings}
          completedQuestions={progress.completedQuestions}
          visitedBuildings={progress.visitedBuildings}
          lockedBuildings={progress.lockedBuildings}
          activeBuildingId={progress.activeBuildingId}
          onSelectBuilding={(id) => {
            if (!isInsideBuilding) setPreviewBuildingId(id);
          }}
        />

        {/* Daftar 10 Gedung (Pilih Acak) */}
        {!isInsideBuilding && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {buildings.map((b) => {
              const used =
                (progress.visitedBuildings || []).includes(b.id) ||
                (progress.lockedBuildings || []).includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => setPreviewBuildingId(b.id)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                    previewBuildingId === b.id
                      ? "bg-blue-600 border-blue-400 text-white"
                      : used
                      ? "bg-slate-900/60 border-slate-800 text-slate-500"
                      : "bg-slate-900 border-slate-700 text-slate-200"
                  }`}
                >
                  {used && <Lock className="w-3 h-3 text-red-400" />}
                  Gedung {b.id}
                </button>
              );
            })}
          </div>
        )}

        {/* Panel Gedung Terpilih */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-blue-400 uppercase">{currentBuilding.topic}</span>
              <h3 className="text-lg font-bold">{currentBuilding.name}</h3>
            </div>

            {isInsideBuilding ? (
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 font-semibold">
                  Sisa Salah: {remainingWrong}/3
                </span>
                <button
                  onClick={handleExitBuilding}
                  disabled={busy}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <DoorOpen className="w-4 h-4" /> Keluar Gedung
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEnterBuilding(currentBuilding.id)}
                disabled={busy || isVisitedOrLocked}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold"
              >
                {isVisitedOrLocked ? "Gedung Terkunci / Sudah Dimasuki" : "Masuki Gedung (1x Kesempatan)"}
              </button>
            )}
          </div>

          {/* 3 Tingkat Tantangan: Pemula (3 soal), Menengah (2 soal), Mahir (1 soal) */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl">
            {Object.entries(LEVEL_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setActiveLevel(key)}
                className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                  activeLevel === key ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>

          {!isInsideBuilding && (
            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              Pratinjau tantangan gedung. Klik <strong>Masuki Gedung</strong> untuk mulai menjawab. Setiap gedung hanya bisa dimasuki <strong>1 kali</strong> dan batas salah maksimal <strong>3 kali</strong>.
            </p>
          )}

          {/* Daftar Soal Pilihan Ganda A-E */}
          <div className="space-y-4">
            {levelQuestions.map((item, idx) => {
              const rec = progress.completedQuestions?.[item.id];
              const isSolved = rec?.correct === true;
              const disabledOption = !isInsideBuilding || isSolved || busy;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border ${
                    isSolved ? "bg-emerald-950/20 border-emerald-700/50" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <p className="text-sm font-medium">
                      <span className="text-blue-400 font-bold mr-1.5">
                        {activeLevel.toUpperCase()} #{idx + 1}.
                      </span>
                      {item.q}
                    </p>
                    <span className="shrink-0 text-xs px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                      +{item.points} pt
                    </span>
                  </div>

                  <div className="space-y-2">
                    {item.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isPicked = rec?.selectedOption === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={disabledOption}
                          onClick={() => handleAnswer(item.id, optIdx)}
                          className={`w-full text-left text-xs sm:text-sm p-3 rounded-lg border transition ${
                            isPicked && isSolved
                              ? "bg-emerald-600/25 border-emerald-400 text-white"
                              : isPicked && !isSolved
                              ? "bg-red-600/20 border-red-500/60 text-red-200"
                              : "bg-slate-900 hover:bg-slate-800 border-slate-700/80 disabled:opacity-60"
                          }`}
                        >
                          <span className="font-mono font-bold text-blue-300 mr-2">{letter}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSolved && (
                    <div className="mt-2.5 text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Terjawab benar (+{rec.score} poin)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
