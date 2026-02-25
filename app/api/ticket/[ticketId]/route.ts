import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path sesuai dengan setup Prisma Anda
import { unstable_noStore as noStore } from 'next/cache';
import { sendNotificationToAdmins, sendNotificationToTechnician, sendNotificationToUser } from "@/lib/notification";

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

    // Send notifications
    try {
      // 1. Fetch full ticket data with details for complete notifications
      const ticketWithDetails = await db.ticketMaintenance.findUnique({
        where: { id: params.ticketId },
        include: {
          employee: true,
          technician: true
        }
      });

      if (ticketWithDetails) {
        const ticketNumber = ticketWithDetails.ticketNumber || "";
        const employeeId = ticketWithDetails.employeeId;
        const techName = ticketWithDetails.technician?.name || "a technician";

        // Notify technician
        if (ticketWithDetails.technicianId) {
          await sendNotificationToTechnician(
            ticketWithDetails.technicianId,
            "Tugas Baru Ditugaskan",
            `Anda telah ditugaskan untuk tiket maintenance ${ticketNumber}. Jadwal: ${new Date(scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
            `/dashboard/technician/assign`
          );
        }

        // Notify requester (User)
        if (employeeId) {
          await sendNotificationToUser(
            employeeId,
            "Teknisi Ditugaskan",
            `Admin telah menugaskan teknisi ${techName} untuk tiket Anda (${ticketNumber}). Jadwal: ${new Date(scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
            `/dashboard/maintenance/ticket`
          );
        }

        // Notify admins
        await sendNotificationToAdmins(
          "Tiket Ditugaskan",
          `Tiket ${ticketNumber} telah ditugaskan ke teknisi ${techName}. Jadwal: ${new Date(scheduledDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
          `/dashboard/technician/assign`
        );
      }
    } catch (notifError) {
      console.error("Notification delivery failed on assignment:", notifError);
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
