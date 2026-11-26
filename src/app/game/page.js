"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Trophy,
  Timer,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Sparkles,
  Flame,
  DoorOpen
} from "lucide-react";
import { CITY_BUILDINGS, LEVEL_META, getOrderedQuestions } from "@/lib/buildings";
import CityInteractiveMap from "@/components/CityInteractiveMap";

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

export default function GamePage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(ANIMAL_AVATARS[0]);

  const [pendingBuilding, setPendingBuilding] = useState(null);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timeDeltaToast, setTimeDeltaToast] = useState(null);
  const [combo, setCombo] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bannerMsg, setBannerMsg] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("secure_city_student");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setStudent({
        score: 0,
        completedBuildings: [],
        lockedBuildings: [],
        buildingMistakes: {},
        ...parsed
      });
      if (parsed.avatar) {
        const match = ANIMAL_AVATARS.find((a) => a.id === parsed.avatar.id || a.emoji === parsed.avatar.emoji);
        if (match) setSelectedAvatar(match);
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  const syncStudentStorage = useCallback((updated) => {
    setStudent(updated);
    try {
      sessionStorage.setItem("secure_city_student", JSON.stringify(updated));
    } catch {
      // abaikan error penyimpanan lokal
    }
  }, []);

  const orderedQuestions = useMemo(() => {
    return currentBuilding ? getOrderedQuestions(currentBuilding) : [];
  }, [currentBuilding]);

  const activeQuestion = orderedQuestions[questionIndex] || null;

  useEffect(() => {
    if (!currentBuilding || !activeQuestion || feedback) return;
    const base =
      activeQuestion.baseTime || LEVEL_META[activeQuestion.level]?.defaultTime || 25;
    setTimeLeft(base);
    setSelectedOption(null);
  }, [currentBuilding, activeQuestion, feedback]);

  const handleAnswerSubmission = useCallback(
    async (optionIdx, timedOut = false) => {
      if (!currentBuilding || !activeQuestion || submitting || feedback) return;
      setSubmitting(true);
      if (!timedOut) setSelectedOption(optionIdx);

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken: student?.sessionToken,
            buildingId: currentBuilding.id,
            questionId: activeQuestion.id,
            selectedIndex: optionIdx,
            timedOut
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setBannerMsg({
            type: "error",
            text: data.error || "Gagal memproses jawaban."
          });
          setSubmitting(false);
          return;
        }

        const delta = data.isCorrect ? 3 : -3;
        setTimeDeltaToast({
          id: Date.now(),
          delta,
          text: data.isCorrect ? "+3 detik" : "-3 detik"
        });
        setTimeout(() => setTimeDeltaToast(null), 1600);

        if (data.isCorrect) {
          setCombo((c) => c + 1);
        } else {
          setCombo(0);
        }

        syncStudentStorage({
          ...student,
          score: data.score ?? student.score,
          completedBuildings: data.completedBuildings ?? student.completedBuildings,
          lockedBuildings: data.lockedBuildings ?? student.lockedBuildings,
          buildingMistakes: data.buildingMistakes ?? student.buildingMistakes
        });

        setFeedback({
          isCorrect: Boolean(data.isCorrect),
          timedOut: Boolean(timedOut),
          explanation:
            data.explanation ||
            (data.isCorrect
              ? "Jawaban tepat! Langkah keamanan sesuai praktik terbaik."
              : "Jawaban kurang tepat. Perhatikan risiko keamanan pada skenario tersebut."),
          pointsEarned: data.pointsEarned || 0,
          mistakesInBuilding: data.mistakesInBuilding || 0,
          remainingMistakes: data.remainingMistakes ?? 3,
          ejected: Boolean(data.ejected),
          buildingCompleted: Boolean(data.buildingCompleted)
        });
      } catch {
        setBannerMsg({
          type: "error",
          text: "Terjadi gangguan jaringan saat mengirim jawaban."
        });
      } finally {
        setSubmitting(false);
      }
    },
    [currentBuilding, activeQuestion, submitting, feedback, student, syncStudentStorage]
  );

  // Hitung mundur timer per soal + bonus/penalti 3 detik
  useEffect(() => {
    if (!currentBuilding || !activeQuestion || feedback || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswerSubmission(null, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentBuilding, activeQuestion, feedback, submitting, handleAnswerSubmission]);

  useEffect(() => {
    if (!feedback || !timeDeltaToast) return;
    if (!feedback.ejected && !feedback.buildingCompleted) {
      setTimeLeft((prev) => Math.max(5, prev + timeDeltaToast.delta));
    }
  }, [feedback, timeDeltaToast]);

  const handleApproachBuilding = useCallback(
    (building) => {
      if (currentBuilding || pendingBuilding) return;
      const locked = student?.lockedBuildings || [];
      const completed = student?.completedBuildings || [];
      if (locked.includes(building.id)) {
        setBannerMsg({
          type: "warning",
          text: `${building.name} sudah terkunci karena mencapai 3x kesalahan.`
        });
        return;
      }
      if (completed.includes(building.id)) {
        setBannerMsg({
          type: "info",
          text: `${building.name} sudah berhasil diamankan.`
        });
        return;
      }
      setPendingBuilding(building);
    },
    [currentBuilding, pendingBuilding, student]
  );

  const confirmEnterBuilding = async () => {
    if (!pendingBuilding) return;
    const target = pendingBuilding;
    setPendingBuilding(null);
    setFeedback(null);
    setSelectedOption(null);
    setQuestionIndex(0);
    setCombo(0);

    try {
      await fetch("/api/building", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: student?.sessionToken,
          buildingId: target.id
        })
      });
    } catch {
      // tetap lanjutkan ke dalam gedung
    }

    setCurrentBuilding(target);
  };

  const handleNextStepInBuilding = async () => {
    if (!feedback) return;

    if (feedback.ejected) {
      setBannerMsg({
        type: "error",
        text: `Anda keluar dari ${currentBuilding?.name} karena 3x kesalahan. Gedung dikunci.`
      });
      setCurrentBuilding(null);
      setFeedback(null);
      setSelectedOption(null);
      setQuestionIndex(0);
      return;
    }

    if (feedback.buildingCompleted || questionIndex + 1 >= orderedQuestions.length) {
      setBannerMsg({
        type: "success",
        text: `Selamat! Seluruh tantangan di ${currentBuilding?.name} telah tuntas.`
      });
      setCurrentBuilding(null);
      setFeedback(null);
      setSelectedOption(null);
      setQuestionIndex(0);
      return;
    }

    setFeedback(null);
    setSelectedOption(null);
    setQuestionIndex((idx) => idx + 1);
  };

  const handleExitBuildingEarly = async () => {
    if (!currentBuilding) return;
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: student?.sessionToken,
          action: "exit_building",
          buildingId: currentBuilding.id
        })
      });
    } catch {
      // abaikan error jaringan
    }
    setCurrentBuilding(null);
    setFeedback(null);
    setSelectedOption(null);
    setQuestionIndex(0);
  };

  const handleLogoutSession = () => {
    sessionStorage.removeItem("secure_city_student");
    router.push("/");
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 text-slate-700 font-medium">
        Memuat area Smart Secure City...
      </div>
    );
  }

  const completedCount = (student.completedBuildings || []).length;
  const lockedCount = (student.lockedBuildings || []).length;
  const currentMistakes = currentBuilding
    ? student.buildingMistakes?.[currentBuilding.id] || 0
    : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50 text-slate-900 flex flex-col">
      {/* Top HUD Bar Full-Width */}
      <header className="sticky top-0 z-30 border-b border-sky-200 bg-white/95 backdrop-blur-xs px-4 lg:px-8 py-3 shadow-xs">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-extrabold tracking-tight text-slate-900">
                  Smart Secure City
                </h1>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                  Sesi {student.classCode || "AKTIF"}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{student.nama}</span> ({student.nim}) •{" "}
                {selectedAvatar.emoji} {selectedAvatar.name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {combo >= 2 && (
              <div className="inline-flex items-center gap-1 rounded-xl bg-amber-100 border border-amber-300 px-3 py-1.5 text-xs font-extrabold text-amber-800">
                <Flame className="h-4 w-4 text-orange-500" />
                Combo x{combo}
              </div>
            )}

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>
                Aman: {completedCount}/{CITY_BUILDINGS.length}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-900 shadow-2xs">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span>{student.score || 0}/100</span>
            </div>

            <button
              type="button"
              onClick={handleLogoutSession}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>

        {/* Pemilih Avatar Hewan Cepat */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
            Avatar:
          </span>
          {ANIMAL_AVATARS.map((av) => {
            const active = av.id === selectedAvatar.id;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  setSelectedAvatar(av);
                  syncStudentStorage({ ...student, avatar: av });
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 transition cursor-pointer ${
                  active
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-sky-100"
                }`}
              >
                <span>{av.emoji}</span>
                <span>{av.name}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Notifikasi Status */}
      {bannerMsg && (
        <div className="px-4 lg:px-8 pt-3">
          <div
            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-xs font-semibold shadow-xs ${
              bannerMsg.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : bannerMsg.type === "warning"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : bannerMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-sky-50 border-sky-200 text-sky-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{bannerMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMsg(null)}
              className="text-xs font-bold underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Full-Width */}
      <main className="flex-1 w-full px-4 lg:px-8 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Kolom Utama: Peta Kota Interaktif */}
          <div className="xl:col-span-8">
            <CityInteractiveMap
              buildings={CITY_BUILDINGS}
              avatar={selectedAvatar}
              studentName={student.nama}
              completedBuildings={student.completedBuildings || []}
              lockedBuildings={student.lockedBuildings || []}
              activeBuildingId={currentBuilding?.id || null}
              onApproachBuilding={handleApproachBuilding}
              disabled={Boolean(currentBuilding || pendingBuilding)}
            />
          </div>

          {/* Kolom Samping: Status Kota & Daftar Gedung */}
          <aside className="xl:col-span-4 flex flex-col gap-4">
            <div className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-md">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                Progres Keamanan Kota
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Masuki gedung untuk menjawab soal 1 per 1 dari level <strong>Pemula</strong> ke <strong>Mahir</strong>. Maksimal salah <strong>3x</strong> per gedung.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                  <div className="text-lg font-black text-emerald-700">{completedCount}</div>
                  <div className="text-[11px] font-semibold text-emerald-800">Tuntas</div>
                </div>
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3">
                  <div className="text-lg font-black text-rose-700">{lockedCount}</div>
                  <div className="text-[11px] font-semibold text-rose-800">Terkunci</div>
                </div>
                <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
                  <div className="text-lg font-black text-sky-700">
                    {CITY_BUILDINGS.length - completedCount - lockedCount}
                  </div>
                  <div className="text-[11px] font-semibold text-sky-800">Tersedia</div>
                </div>
              </div>

              <div className="mt-4 max-h-[360px] overflow-y-auto space-y-2 pr-1">
                {CITY_BUILDINGS.map((b, i) => {
                  const isDone = (student.completedBuildings || []).includes(b.id);
                  const isLocked = (student.lockedBuildings || []).includes(b.id);
                  const mistakes = student.buildingMistakes?.[b.id] || 0;

                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">
                          {i + 1}. {b.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{b.role}</div>
                      </div>
                      <div className="shrink-0">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aman
                          </span>
                        ) : isLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-800">
                            <XCircle className="h-3.5 w-3.5" /> 3x Salah
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
                            Salah: {mistakes}/3
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Pop-Up Konfirmasi Saat Avatar Memasuki Gedung */}
      {pendingBuilding && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-sky-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ backgroundColor: pendingBuilding.color }}
              >
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                  {pendingBuilding.district}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {pendingBuilding.name}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Apakah Anda akan memasuki gedung tersebut?
            </p>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Di dalam gedung ini Anda akan mengerjakan soal satu per satu dimulai dari level{" "}
              <strong>Pemula</strong> ke <strong>Mahir</strong>. Akses gedung hanya{" "}
              <strong>1x kesempatan</strong> dan Anda akan otomatis keluar jika melakukan{" "}
              <strong>3x kesalahan</strong>.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPendingBuilding(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmEnterBuilding}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 cursor-pointer"
              >
                Ya, Masuk Gedung
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tantangan di Dalam Gedung (1 Soal Berjenjang + Timer +3d/-3d) */}
      {currentBuilding && activeQuestion && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-sky-200 bg-white p-6 lg:p-7 shadow-2xl my-auto">
            {/* Header Gedung & Timer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-sky-700">
                    {currentBuilding.name}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase ${
                      LEVEL_META[activeQuestion.level]?.badgeClass || ""
                    }`}
                  >
                    Level {LEVEL_META[activeQuestion.level]?.label || activeQuestion.level}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    Soal {questionIndex + 1}/{orderedQuestions.length} • +{activeQuestion.points} pt
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {timeDeltaToast && (
                  <span
                    key={timeDeltaToast.id}
                    className={`rounded-full px-2.5 py-1 text-xs font-black animate-bounce ${
                      timeDeltaToast.delta > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {timeDeltaToast.text}
                  </span>
                )}

                <div
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-black border ${
                    timeLeft <= 7
                      ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                      : "bg-sky-50 border-sky-200 text-sky-900"
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  <span>{timeLeft}d</span>
                </div>

                <div className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-xs font-extrabold text-amber-900">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Salah {currentMistakes}/3</span>
                </div>
              </div>
            </div>

            {/* Pertanyaan */}
            <div className="mt-5">
              <h3 className="text-base lg:text-lg font-extrabold text-slate-900 leading-snug">
                {activeQuestion.prompt}
              </h3>
            </div>

            {/* Pilihan Jawaban yang Bisa Diklik */}
            <div className="mt-5 space-y-2.5">
              {activeQuestion.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === idx;
                let btnStyle =
                  "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-sky-400 hover:bg-sky-50/80";

                if (feedback) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyle =
                      "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200";
                  } else if (isSelected && !feedback.isCorrect) {
                    btnStyle =
                      "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200";
                  } else {
                    btnStyle = "border-slate-200 bg-white text-slate-500 opacity-75";
                  }
                } else if (isSelected) {
                  btnStyle = "border-sky-600 bg-sky-50 text-sky-950 ring-2 ring-sky-200";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={Boolean(feedback) || submitting}
                    onClick={() => handleAnswerSubmission(idx, false)}
                    className={`w-full flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-700">
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {feedback && idx === activeQuestion.correctIndex && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                    {feedback && isSelected && !feedback.isCorrect && (
                      <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Umpan Balik Benar / Salah */}
            {feedback && (
              <div
                className={`mt-5 rounded-2xl border p-4 text-xs leading-relaxed ${
                  feedback.isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  {feedback.isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Benar! (+{feedback.pointsEarned} Poin • +3 Detik)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-600" />
                      <span>
                        {feedback.timedOut ? "Waktu Habis!" : "Jawaban Kurang Tepat!"} (-3 Detik • Kesalahan {feedback.mistakesInBuilding}/3)
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1.5 font-medium">{feedback.explanation}</p>
                {feedback.ejected && (
                  <p className="mt-2 font-extrabold text-rose-700">
                    Batas 3x kesalahan tercapai. Anda akan keluar dari gedung dan gedung ini dikunci.
                  </p>
                )}
              </div>
            )}

            {/* Footer Aksi Modal Gedung */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              {!feedback ? (
                <button
                  type="button"
                  onClick={handleExitBuildingEarly}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <DoorOpen className="h-4 w-4" />
                  Keluar Gedung
                </button>
              ) : (
                <div />
              )}

              {feedback && (
                <button
                  type="button"
                  onClick={handleNextStepInBuilding}
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 cursor-pointer"
                >
                  {feedback.ejected
                    ? "Keluar ke Peta Kota"
                    : feedback.buildingCompleted || questionIndex + 1 >= orderedQuestions.length
                    ? "Selesaikan Gedung"
                    : "Lanjut ke Soal Berikutnya"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
