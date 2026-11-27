import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

function generateClassCode() {
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SEC-${randomPart}`;
}

function generateSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

async function getPreviousSessions(adminDb, activeClassCode = null) {
  const historySnap = await adminDb
    .collection("class_sessions")
    .orderBy("endedAt", "desc")
    .limit(20)
    .get();

  return historySnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((s) => s.classCode && s.classCode !== activeClassCode);
}

export async function GET(req) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(req.url);
    const codeQuery = searchParams.get("code")?.trim().toUpperCase();

    const sessionSnap = await adminDb.collection("system").doc("active_session").get();
    const activeSession = sessionSnap.exists ? sessionSnap.data() : null;

    if (codeQuery) {
      const isValid = Boolean(activeSession?.classCode && activeSession.classCode === codeQuery);
      return NextResponse.json({
        success: true,
        valid: isValid,
        classCode: activeSession?.classCode || null
      });
    }

    return NextResponse.json({
      success: true,
      session: activeSession
    });
  } catch (err) {
    console.error("Session GET Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const adminDb = getAdminDb();
    const body = await req.json();
    const { action, adminKey, forceNew = false, nim, nama, classCode, avatarId, avatar } = body;

    // Aksi dosen: membuat atau mengambil sesi kelas aktif & mengarsipkan sesi lama
    if (action === "generate_class_session") {
      if (process.env.LECTURER_ADMIN_KEY && adminKey !== process.env.LECTURER_ADMIN_KEY) {
        return NextResponse.json({ error: "Kunci akses dosen tidak valid." }, { status: 401 });
      }

      const activeRef = adminDb.collection("system").doc("active_session");
      const prevSnap = await activeRef.get();
      const prevSession = prevSnap.exists ? prevSnap.data() : null;

      let currentSession = prevSession;

      if (forceNew || !prevSession?.classCode) {
        if (forceNew && prevSession?.classCode) {
          const prevStudentsSnap = await adminDb
            .collection("students")
            .where("classCode", "==", prevSession.classCode)
            .get();

          const archivedStudents = prevStudentsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          await adminDb
            .collection("class_sessions")
            .doc(prevSession.classCode)
            .set(
              {
                classCode: prevSession.classCode,
                startedAt: prevSession.createdAt || null,
                endedAt: new Date().toISOString(),
                studentCount: archivedStudents.length,
                students: archivedStudents
              },
              { merge: true }
            );
        }

        const newCode = generateClassCode();
        currentSession = {
          classCode: newCode,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        await activeRef.set(currentSession);
      }

      const activeStudentsSnap = await adminDb
        .collection("students")
        .where("classCode", "==", currentSession.classCode)
        .get();

      const students = activeStudentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      const previousSessions = await getPreviousSessions(adminDb, currentSession.classCode);

      return NextResponse.json({
        success: true,
        session: currentSession,
        classCode: currentSession.classCode,
        students,
        previousSessions
      });
    }

    // Aksi mahasiswa: masuk ke sesi kelas aktif
    const cleanNim = String(nim || "").trim();
    const cleanNama = String(nama || "").trim();
    const cleanCode = String(classCode || "").trim().toUpperCase();

    if (!cleanNim || !cleanNama || !cleanCode) {
      return NextResponse.json(
        { error: "NIM, Nama, dan Kode Sesi wajib diisi." },
        { status: 400 }
      );
    }

    const activeSnap = await adminDb.collection("system").doc("active_session").get();
    const activeSession = activeSnap.exists ? activeSnap.data() : null;

    if (!activeSession?.classCode || activeSession.classCode !== cleanCode) {
      return NextResponse.json(
        { error: "Kode sesi tidak aktif atau tidak ditemukan. Minta kode terbaru ke dosen." },
        { status: 404 }
      );
    }

    const resolvedAvatarId = avatarId || avatar?.id || "fox";
    const resolvedAvatar =
      avatar && typeof avatar === "object"
        ? { id: resolvedAvatarId, name: avatar.name || "Rubah", emoji: avatar.emoji || "🦊" }
        : { id: resolvedAvatarId, name: "Avatar", emoji: "🦊" };

    const studentDocId = `${cleanCode}_${cleanNim}`;
    const studentRef = adminDb.collection("students").doc(studentDocId);
    const existingSnap = await studentRef.get();
    const existingData = existingSnap.exists ? existingSnap.data() : null;

    const sessionToken = existingData?.sessionToken || generateSessionToken();

    const studentPayload = {
      nim: cleanNim,
      nama: cleanNama,
      classCode: cleanCode,
      avatarId: resolvedAvatarId,
      avatar: resolvedAvatar,
      sessionToken,
      score: existingData ? Number(existingData.score || 0) : 0,
      completedBuildings: existingData?.completedBuildings || [],
      lockedBuildings: existingData?.lockedBuildings || [],
      answeredCorrectIds: existingData?.answeredCorrectIds || [],
      buildingMistakes: existingData?.buildingMistakes || {},
      activeBuildingId: existingData?.activeBuildingId || null,
      logs: existingData?.logs || [],
      joinedAt: existingData?.joinedAt || new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    await studentRef.set(studentPayload, { merge: true });

    return NextResponse.json({
      success: true,
      nim: cleanNim,
      nama: cleanNama,
      classCode: cleanCode,
      avatarId: resolvedAvatarId,
      avatar: resolvedAvatar,
      sessionToken,
      score: studentPayload.score,
      completedBuildings: studentPayload.completedBuildings,
      lockedBuildings: studentPayload.lockedBuildings,
      buildingMistakes: studentPayload.buildingMistakes
    });
  } catch (err) {
    console.error("Session POST Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
