import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path sesuai dengan setup Prisma Anda
import { unstable_noStore as noStore } from 'next/cache';

export async function PUT(req: Request, { params }: { params: { ticketId: string } }) {
  noStore();
  try {
    const body = await req.json();
    const { technicianId, scheduledDate } = body;
    
    // Validasi input
    if (!technicianId || !scheduledDate) {
      return NextResponse.json(
        { message: "technicianId dan scheduledDate wajib diisi" },
        { status: 400 }
      );
    }
    
    // Update record menggunakan params.ticketId karena file route adalah [ticketId].ts
    const updatedTicket = await db.ticketMaintenance.update({
      where: { id: params.ticketId },
      data: {
        technicianId,
        status: "Assigned", // Set status ke "Assigned"
        scheduledDate: new Date(scheduledDate),
      },
    });
    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
