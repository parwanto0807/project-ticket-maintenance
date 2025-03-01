import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path sesuai dengan setup Prisma Anda

export async function PUT(req: Request, { params }: { params: { ticketId: string } }) {
  try {
    const body = await req.json();
    const { technicianId, scheduledDate, analisaDescription, actionDescription, status } = body;

    // Validasi input
    if (!technicianId || !scheduledDate) {
      return NextResponse.json(
        { message: "technicianId dan scheduledDate wajib diisi" },
        { status: 400 }
      );
    }

    // Update record di database
    const updatedTicket = await db.ticketMaintenance.update({
      where: { id: params.ticketId },
      data: {
        technicianId,
        scheduledDate: new Date(scheduledDate),
        analisaDescription,
        actionDescription,
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
