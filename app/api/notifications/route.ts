import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await db.notification.findMany({
    include: { user: true },
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5, // Ambil 5 notifikasi terbaru
  });

  return NextResponse.json(notifications);
}
