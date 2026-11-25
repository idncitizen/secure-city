import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";
import { getAvatarById } from "@/lib/avatars";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, nim, nama, classCode, avatarId, sessionToken, adminKey } = body;

    // 1. DOSEN MEMBUAT / MEMPERBARUI KODE SESI KULIAH
    if (action === "generate_class_session") {
      if (adminKey !== process.env.LECTURER_ADMIN_KEY) {
        return NextResponse.json({ error: "Kunci admin dosen tidak valid." }, { status: 401 });
      }
      const newClassCode = "SEC-" + crypto.randomBytes(3).toString("hex").toUpperCase();
      const expiresAt = Date.now() + 3 * 60 * 60 * 1000;

      await adminDb.collection("system").doc("active_session").set({
        classCode: newClassCode,
        expiresAt,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ classCode: newClassCode, expiresAt });
    }

    // 2. MAHASISWA MENGGANTI AVATAR HEWAN SECARA BEBAS
    if (action === "update_avatar") {
      if (!nim || !sessionToken || !avatarId) {
        return NextResponse.json({ error: "Data avatar tidak lengkap." }, { status: 400 });
      }
      const cleanNim = String(nim).trim().toUpperCase();
      const studentRef = adminDb.collection("students").doc(cleanNim);
      const snap = await studentRef.get();

      if (!snap.exists || snap.data().sessionToken !== sessionToken) {
        return NextResponse.json({ error: "Sesi tidak sah." }, { status: 401 });
      }

      const chosenAvatar = getAvatarById(avatarId);
      const nowIso = new Date().toISOString();
      const prevLogs = snap.data().activityLogs || [];

      await studentRef.update({
        avatarId: chosenAvatar.id,
        lastActive: nowIso,
        activityLogs: [
          ...prevLogs.slice(-39),
          { time: nowIso, event: `Mengganti avatar menjadi ${chosenAvatar.name} (${chosenAvatar.emoji})` }
        ],
      });

      return NextResponse.json({ success: true, avatarId: chosenAvatar.id });
    }

    // 3. MAHASISWA LOGIN DENGAN NIM, NAMA, KODE SESI & AVATAR HEWAN
    if (!nim || !nama || !classCode) {
      return NextResponse.json({ error: "NIM, Nama, dan Kode Sesi wajib diisi." }, { status: 400 });
    }

    const cleanNim = String(nim).trim().toUpperCase();
    const cleanNama = String(nama).trim();
    const cleanCode = String(classCode).trim().toUpperCase();
    const chosenAvatar = getAvatarById(avatarId || "fox");

    const sessionDoc = await adminDb.collection("system").doc("active_session").get();
    if (!sessionDoc.exists) {
      return NextResponse.json({ error: "Belum ada sesi perkuliahan aktif dari dosen." }, { status: 403 });
    }

    const activeSession = sessionDoc.data();
    if (activeSession.classCode !== cleanCode || Date.now() > activeSession.expiresAt) {
      return NextResponse.json({ error: "Kode sesi salah atau sesi perkuliahan telah berakhir." }, { status: 403 });
    }

    const newSessionToken = crypto.randomBytes(24).toString("hex");
    const studentRef = adminDb.collection("students").doc(cleanNim);
    const existingSnap = await studentRef.get();
    const nowIso = new Date().toISOString();

    if (!existingSnap.exists) {
      await studentRef.set({
        nim: cleanNim,
        nama: cleanNama,
        avatarId: chosenAvatar.id,
        sessionToken: newSessionToken,
        classCode: cleanCode,
        totalScore: 0,
        activeBuildingId: null,
        visitedBuildings: [],     // Gedung yang sudah pernah dimasuki (maks 1x per gedung)
        lockedBuildings: [],      // Gedung yang gagal karena salah 3x / terlempar keluar
        completedBuildings: [],   // Gedung yang sudah selesai dikerjakan
        buildingWrongAttempts: {},// { [buildingId]: number (0..3) }
        completedQuestions: {},   // { [questionId]: { correct, score, selectedOption, timestamp } }
        currentBuilding: null,
        currentLevel: "pemula",
        lastActive: nowIso,
        activityLogs: [
          {
            time: nowIso,
            event: `Login sesi ${cleanCode} dengan avatar ${chosenAvatar.name} ${chosenAvatar.emoji}`
          }
        ],
      });
    } else {
      const prev = existingSnap.data();
      const prevLogs = prev.activityLogs || [];
      await studentRef.update({
        nama: cleanNama,
        avatarId: avatarId ? chosenAvatar.id : (prev.avatarId || chosenAvatar.id),
        sessionToken: newSessionToken,
        classCode: cleanCode,
        lastActive: nowIso,
        activityLogs: [
          ...prevLogs.slice(-39),
          { time: nowIso, event: `Login ulang pada sesi ${cleanCode}` }
        ],
      });
    }

    return NextResponse.json({
      success: true,
      nim: cleanNim,
      nama: cleanNama,
      avatarId: chosenAvatar.id,
      sessionToken: newSessionToken,
    });
  } catch (err) {
    console.error("Session API Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
