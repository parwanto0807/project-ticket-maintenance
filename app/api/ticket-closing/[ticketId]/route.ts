import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path sesuai dengan setup Prisma Anda
import { unstable_noStore as noStore } from "next/cache";

export async function PUT(req: Request, { params }: { params: { ticketId: string } }) {
  noStore()
  try {
    const body = await req.json();
    const { status} = body;
    
    // Update record menggunakan params.ticketId karena file route adalah [ticketId].ts
    const updatedTicket = await db.ticketMaintenance.update({
      where: { id: params.ticketId },
      data: {
        status: status, 
        completedDate: new Date(),
      },
    });
    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
