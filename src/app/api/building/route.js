import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { BUILDINGS_DATA } from "@/lib/questionBank";

export async function POST(req) {
  try {
    const { nim, sessionToken, buildingId } = await req.json();
    const cleanNim = String(nim || "").trim().toUpperCase();
    const bId = Number(buildingId);

    if (!cleanNim || !sessionToken || !bId) {
      return NextResponse.json({ error: "Parameter masuk gedung tidak lengkap." }, { status: 400 });
    }

    const building = BUILDINGS_DATA.find((b) => b.id === bId);
    if (!building) {
      return NextResponse.json({ error: "Gedung tidak ditemukan." }, { status: 404 });
    }

    const studentRef = adminDb.collection("students").doc(cleanNim);
    const snap = await studentRef.get();

    if (!snap.exists || snap.data().sessionToken !== sessionToken) {
      return NextResponse.json({ error: "Session token tidak valid." }, { status: 401 });
    }

    const student = snap.data();
    const visited = student.visitedBuildings || [];
    const locked = student.lockedBuildings || [];
    const nowIso = new Date().toISOString();
    const prevLogs = student.activityLogs || [];

    // Jika sudah berada di dalam gedung ini, lanjutkan
    if (student.activeBuildingId === bId) {
      return NextResponse.json({ success: true, activeBuildingId: bId });
    }

    // Jika sedang berada di gedung lain dan belum menyelesaikan/keluar
    if (student.activeBuildingId && student.activeBuildingId !== bId) {
      return NextResponse.json(
        { error: `Selesaikan atau keluar terlebih dahulu dari Gedung ${student.activeBuildingId}.` },
        { status: 400 }
      );
    }

    // Aturan: Hanya boleh memasuki gedung 1 kali & tidak boleh masuk ulang jika sudah gagal/terkunci
    if (visited.includes(bId) || locked.includes(bId)) {
      await studentRef.update({
        lastActive: nowIso,
        activityLogs: [
          ...prevLogs.slice(-39),
          { time: nowIso, event: `Percobaan masuk ulang Gedung ${bId} ditolak (akses 1x saja)` }
        ],
      });
      return NextResponse.json(
        { error: "Anda sudah pernah memasuki gedung ini atau kesempatan telah habis. Pilih gedung lain." },
        { status: 403 }
      );
    }

    const updatedVisited = [...visited, bId];
    await studentRef.update({
      activeBuildingId: bId,
      currentBuilding: bId,
      currentLevel: "pemula",
      visitedBuildings: updatedVisited,
      lastActive: nowIso,
      activityLogs: [
        ...prevLogs.slice(-39),
        { time: nowIso, event: `Memasuki Gedung ${bId}: ${building.name}` }
      ],
    });

    return NextResponse.json({
      success: true,
      activeBuildingId: bId,
      visitedBuildings: updatedVisited,
    });
  } catch (err) {
    console.error("Building Entry Error:", err);
    return NextResponse.json({ error: "Gagal memasuki gedung." }, { status: 500 });
  }
}
