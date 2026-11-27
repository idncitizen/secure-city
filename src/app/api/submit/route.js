import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getBuildingById, getOrderedQuestions } from "@/lib/buildings";

export async function GET(req) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(req.url);
    const adminKey = searchParams.get("adminKey");

    if (process.env.LECTURER_ADMIN_KEY && adminKey !== process.env.LECTURER_ADMIN_KEY) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
    }

    const sessionSnap = await adminDb.collection("system").doc("active_session").get();
    const session = sessionSnap.exists ? sessionSnap.data() : null;
    const activeCode = session?.classCode || null;

    const studentsSnap = activeCode
      ? await adminDb.collection("students").where("classCode", "==", activeCode).get()
      : await adminDb.collection("students").get();

    const students = studentsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const historySnap = await adminDb
      .collection("class_sessions")
      .orderBy("endedAt", "desc")
      .limit(20)
      .get();

    const previousSessions = historySnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((s) => s.classCode && s.classCode !== activeCode);

    return NextResponse.json({
      success: true,
      session,
      students,
      previousSessions
    });
  } catch (err) {
    console.error("Submit GET Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const adminDb = getAdminDb();
    const body = await req.json();
    const {
      sessionToken,
      action,
      buildingId,
      questionId,
      selectedIndex,
      timedOut = false
    } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: "Token sesi tidak ditemukan." }, { status: 401 });
    }

    const studentsSnap = await adminDb
      .collection("students")
      .where("sessionToken", "==", sessionToken)
      .limit(1)
      .get();

    if (studentsSnap.empty) {
      return NextResponse.json({ error: "Sesi mahasiswa tidak valid." }, { status: 401 });
    }

    const studentDoc = studentsSnap.docs[0];
    const studentData = studentDoc.data();

    const completedBuildings = Array.isArray(studentData.completedBuildings)
      ? [...studentData.completedBuildings]
      : [];
    const lockedBuildings = Array.isArray(studentData.lockedBuildings)
      ? [...studentData.lockedBuildings]
      : [];
    const answeredCorrectIds = Array.isArray(studentData.answeredCorrectIds)
      ? [...studentData.answeredCorrectIds]
      : [];
    const buildingMistakes = { ...(studentData.buildingMistakes || {}) };
    const logs = Array.isArray(studentData.logs) ? [...studentData.logs] : [];

    if (action === "exit_building") {
      await studentDoc.ref.set(
        {
          activeBuildingId: null,
          lastActiveAt: new Date().toISOString()
        },
        { merge: true }
      );
      return NextResponse.json({
        success: true,
        activeBuildingId: null,
        score: Number(studentData.score || 0),
        completedBuildings,
        lockedBuildings,
        buildingMistakes
      });
    }

    const building = getBuildingById(buildingId);
    if (!building) {
      return NextResponse.json({ error: "Gedung tidak ditemukan." }, { status: 404 });
    }

    if (lockedBuildings.includes(building.id)) {
      return NextResponse.json(
        { error: "Gedung ini sudah terkunci karena 3x kesalahan.", ejected: true, lockedBuildings },
        { status: 403 }
      );
    }

    const orderedQuestions = getOrderedQuestions(building);
    const question = orderedQuestions.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: "Pertanyaan tidak ditemukan." }, { status: 400 });
    }

    const isCorrect = !timedOut && Number(selectedIndex) === Number(question.correctIndex);
    let currentScore = Number(studentData.score || 0);
    let mistakesInBuilding = Number(buildingMistakes[building.id] || 0);
    let ejected = false;

    if (isCorrect) {
      if (!answeredCorrectIds.includes(question.id)) {
        answeredCorrectIds.push(question.id);
        currentScore = Math.min(100, currentScore + Number(question.points || 0));
      }
      logs.unshift({
        time: new Date().toISOString(),
        buildingId: building.id,
        buildingName: building.name,
        level: question.level,
        questionId: question.id,
        result: "BENAR",
        pointsEarned: Number(question.points || 0)
      });
    } else {
      mistakesInBuilding += 1;
      buildingMistakes[building.id] = mistakesInBuilding;

      logs.unshift({
        time: new Date().toISOString(),
        buildingId: building.id,
        buildingName: building.name,
        level: question.level,
        questionId: question.id,
        result: timedOut ? "WAKTU HABIS" : "SALAH",
        mistakesInBuilding
      });

      if (mistakesInBuilding >= 3) {
        ejected = true;
        if (!lockedBuildings.includes(building.id)) {
          lockedBuildings.push(building.id);
        }
      }
    }

    const buildingCorrectCount = orderedQuestions.filter((q) =>
      answeredCorrectIds.includes(q.id)
    ).length;
    const buildingCompleted = !ejected && buildingCorrectCount >= orderedQuestions.length;

    if (buildingCompleted && !completedBuildings.includes(building.id)) {
      completedBuildings.push(building.id);
    }

    const nextActiveBuildingId = ejected || buildingCompleted ? null : building.id;

    await studentDoc.ref.set(
      {
        score: currentScore,
        completedBuildings,
        lockedBuildings,
        answeredCorrectIds,
        buildingMistakes,
        activeBuildingId: nextActiveBuildingId,
        logs: logs.slice(0, 100),
        lastActiveAt: new Date().toISOString()
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      isCorrect,
      timedOut,
      explanation: question.explanation,
      pointsEarned: isCorrect ? Number(question.points || 0) : 0,
      timeDelta: isCorrect ? 3 : -3,
      score: currentScore,
      mistakesInBuilding,
      remainingMistakes: Math.max(0, 3 - mistakesInBuilding),
      ejected,
      buildingCompleted,
      activeBuildingId: nextActiveBuildingId,
      completedBuildings,
      lockedBuildings
    });
  } catch (err) {
    console.error("Submit API Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
