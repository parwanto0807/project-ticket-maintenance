import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path koneksi database benar

export async function GET(req: Request, { params }: { params: { email: string } }) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Gunakan Promise.all() agar lebih efisien
    const [totalTicket, openTicket] = await Promise.all([
      db.ticketMaintenance.count({
        where: {
          employee: {
            email: email, // Hitung semua tiket berdasarkan email
          },
        },
      }),
      db.ticketMaintenance.count({
        where: {
          employee: {
            email: email, // Hitung tiket yang status-nya bukan "Complete" atau "Cancel"
          },
          NOT: {
            status: {
              in: ["Completed", "Canceled"], // Filter status
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      total: totalTicket, // Total semua tiket
      open: openTicket,   // Tiket yang belum selesai
    });
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
