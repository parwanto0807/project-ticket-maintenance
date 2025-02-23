import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Sesuaikan dengan koneksi Prisma

export async function POST(req: Request) {
  try {
    const { userId, fcmToken } = await req.json();
    if (!userId || !fcmToken) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    await db.user.update({
      where: { id: userId},
      data: { fcmToken },
    });
    console.log("✅ FCM Token saved for user:", userId);

    return NextResponse.json({ success: true });
  } catch  {
    return NextResponse.json({ error: "Error saving token" }, { status: 500 });
  }
}
