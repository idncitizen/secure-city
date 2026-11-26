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

    const studentsSnap = await adminDb.collection("students").get();
    const students = studentsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      session,
      students
    });
  } catch (err) {
    console.error("Submit GET Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
