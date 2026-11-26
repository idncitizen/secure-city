import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const db = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Contoh ambil data gedung dari Firestore
    if (id) {
      const docRef = db.collection("buildings").doc(id);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        return NextResponse.json(
          { error: "Data gedung tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: snapshot.id,
        ...snapshot.data(),
      });
    }

    const querySnapshot = await db.collection("buildings").get();
    const buildings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ buildings });
  } catch (error) {
    console.error("Error di /api/building [GET]:", error);
    return NextResponse.json(
      {
        error: "Gagal memproses data gedung di server",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = getAdminDb();
    const body = await request.json();

    // Sesuaikan validasi & penyimpanan data sesuai kebutuhan game/praktikum Anda
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload tidak valid" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, received: body }, { status: 201 });
  } catch (error) {
    console.error("Error di /api/building [POST]:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan data gedung",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
