import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  BUILDINGS_DATA,
  MAX_WRONG_ATTEMPTS_PER_BUILDING,
  getSafeBuildingsForClient,
} from "@/lib/questionBank";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nim = searchParams.get("nim")?.toUpperCase();
  const token = searchParams.get("token");

  if (!nim || !token) {
    return NextResponse.json({ error: "Autentikasi diperlukan." }, { status: 401 });
  }

  const snap = await adminDb.collection("students").doc(nim).get();
  if (!snap.exists || snap.data().sessionToken !== token) {
    return NextResponse.json({ error: "Session token tidak valid atau sesi digantikan." }, { status: 401 });
  }

  const s = snap.data();
  return NextResponse.json({
    buildings: getSafeBuildingsForClient(),
    progress: {
      nim: s.nim,
      nama: s.nama,
      avatarId: s.avatarId || "fox",
      totalScore: s.totalScore || 0,
      activeBuildingId: s.activeBuildingId ?? null,
      visitedBuildings: s.visitedBuildings || [],
      lockedBuildings: s.lockedBuildings || [],
      completedBuildings: s.completedBuildings || [],
      buildingWrongAttempts: s.buildingWrongAttempts || {},
      completedQuestions: s.completedQuestions || {},
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nim, token, action, buildingId, level, questionId, selectedOption } = body;

    if (!nim || !token) {
      return NextResponse.json({ error: "Sesi tidak lengkap." }, { status: 401 });
    }

    const cleanNim = String(nim).trim().toUpperCase();
    const studentRef = adminDb.collection("students").doc(cleanNim);
    const snap = await studentRef.get();

    if (!snap.exists || snap.data().sessionToken !== token) {
      return NextResponse.json({ error: "Sesi tidak sah. Silakan login kembali." }, { status: 401 });
    }

    const student = snap.data();
    const nowIso = new Date().toISOString();
    const prevLogs = student.activityLogs || [];

    // Mahasiswa keluar secara sukarela dari gedung aktif (tidak bisa masuk lagi)
    if (action === "exit_building") {
      const activeId = student.activeBuildingId;
      if (!activeId) {
        return NextResponse.json({ error: "Tidak sedang berada di dalam gedung." }, { status: 400 });
      }
      const completedBuildings = student.completedBuildings || [];
      const updatedCompleted = completedBuildings.includes(activeId)
        ? completedBuildings
        : [...completedBuildings, activeId];

      await studentRef.update({
        activeBuildingId: null,
        completedBuildings: updatedCompleted,
        lastActive: nowIso,
        activityLogs: [
          ...prevLogs.slice(-39),
          { time: nowIso, event: `Keluar dari Gedung ${activeId} (akses gedung selesai)` }
        ],
      });

      return NextResponse.json({
        ejected: true,
        reason: "Anda keluar dari gedung. Gedung ini tidak dapat dimasuki kembali.",
        activeBuildingId: null,
      });
    }

    // Validasi jawaban pilihan ganda (A-E => 0-4)
    const bId = Number(buildingId);
    if (student.activeBuildingId !== bId) {
      return NextResponse.json(
        { error: "Anda tidak berada di dalam gedung ini atau sudah terlempar keluar." },
        { status: 403 }
      );
    }

    const lockedBuildings = student.lockedBuildings || [];
    if (lockedBuildings.includes(bId)) {
      return NextResponse.json(
        { error: "Kesempatan di gedung ini sudah habis." },
        { status: 403 }
      );
    }

    if (typeof selectedOption !== "number" || selectedOption < 0 || selectedOption > 4) {
      return NextResponse.json({ error: "Pilihan jawaban harus antara A sampai E." }, { status: 400 });
    }

    const building = BUILDINGS_DATA.find((b) => b.id === bId);
    const levelQuestions = building?.levels?.[level];
    const question = levelQuestions?.find((q) => q.id === questionId);

    if (!building || !question) {
      return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
    }

    const completedQuestions = { ...(student.completedQuestions || {}) };
    if (completedQuestions[questionId]?.correct) {
      return NextResponse.json({ error: "Soal ini sudah dijawab benar sebelumnya." }, { status: 400 });
    }

    const wrongMap = { ...(student.buildingWrongAttempts || {}) };
    let wrongCount = wrongMap[bId] || 0;
    const isCorrect = selectedOption === question.answer;

    let addedScore = 0;
    let ejected = false;
    let ejectReason = "";
    let newActiveBuildingId = bId;
    const updatedLocked = [...lockedBuildings];
    const completedBuildings = [...(student.completedBuildings || [])];

    if (isCorrect) {
      addedScore = question.points; // Pemula: 1, Menengah: 2, Mahir: 3
      completedQuestions[questionId] = {
        correct: true,
        score: addedScore,
        selectedOption,
        buildingId: bId,
        level,
        timestamp: nowIso,
      };

      // Cek apakah seluruh 6 soal pada gedung ini sudah terjawab benar
      const allBuildingQIds = [
        ...building.levels.pemula.map((q) => q.id),
        ...building.levels.menengah.map((q) => q.id),
        ...building.levels.mahir.map((q) => q.id),
      ];
      const allSolved = allBuildingQIds.every((qid) => completedQuestions[qid]?.correct === true);
      if (allSolved && !completedBuildings.includes(bId)) {
        completedBuildings.push(bId);
      }
    } else {
      wrongCount += 1;
      wrongMap[bId] = wrongCount;

      completedQuestions[questionId] = {
        correct: false,
        score: 0,
        selectedOption,
        buildingId: bId,
        level,
        timestamp: nowIso,
      };

      // Aturan: Salah 3x per gedung -> otomatis terlempar keluar & terkunci permanen
      if (wrongCount >= MAX_WRONG_ATTEMPTS_PER_BUILDING) {
        ejected = true;
        newActiveBuildingId = null;
        if (!updatedLocked.includes(bId)) {
          updatedLocked.push(bId);
        }
        ejectReason = `Salah ${MAX_WRONG_ATTEMPTS_PER_BUILDING}x di Gedung ${bId}! Anda otomatis terlempar keluar dan tidak dapat masuk kembali.`;
      }
    }

    const newTotalScore = Math.min(100, (student.totalScore || 0) + addedScore);
    const optionLetter = String.fromCharCode(65 + selectedOption);
    const logMessage = ejected
      ? `SALAH ke-3 di Gedung ${bId} (${questionId}, pilih ${optionLetter}) -> OTOMATIS TERLEMPAR KELUAR`
      : `Gedung ${bId} [${level}] ${questionId} pilih ${optionLetter}: ${isCorrect ? `BENAR (+${addedScore} poin)` : `SALAH (${wrongCount}/${MAX_WRONG_ATTEMPTS_PER_BUILDING})`}`;

    await studentRef.update({
      totalScore: newTotalScore,
      activeBuildingId: newActiveBuildingId,
      buildingWrongAttempts: wrongMap,
      lockedBuildings: updatedLocked,
      completedBuildings,
      completedQuestions,
      currentBuilding: bId,
      currentLevel: level,
      lastActive: nowIso,
      activityLogs: [...prevLogs.slice(-39), { time: nowIso, event: logMessage }],
    });

    return NextResponse.json({
      correct: isCorrect,
      addedScore,
      totalScore: newTotalScore,
      wrongAttemptsInBuilding: wrongCount,
      remainingWrongAttempts: Math.max(0, MAX_WRONG_ATTEMPTS_PER_BUILDING - wrongCount),
      ejected,
      ejectReason,
      activeBuildingId: newActiveBuildingId,
    });
  } catch (err) {
    console.error("Submit Error:", err);
    return NextResponse.json({ error: "Gagal memproses jawaban." }, { status: 500 });
  }
}
