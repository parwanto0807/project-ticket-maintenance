import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path koneksi database benar
import { startOfMonth } from "date-fns";
import { addMonths } from "date-fns";
import { format } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Ambil total tiket dan tiket yang belum selesai secara paralel
    const [totalTicket, openTicket] = await Promise.all([
      db.ticketMaintenance.count({
        where: {
          employee: { email: email },
        },
      }),
      db.ticketMaintenance.count({
        where: {
          employee: { email: email },
          NOT: { status: { in: ["Completed", "Canceled"] } },
        },
      }),
    ]);

    // Breakdown bulanan untuk 12 bulan terakhir (urut dari 11 bulan yang lalu sampai bulan berjalan)
    const now = new Date();
    const monthlyData = await Promise.all(
      Array.from({ length: 12 }).map(async (_, i) => {
        // Agar data diurutkan dari 11 bulan lalu (paling lama) ke bulan berjalan (paling baru)
        const monthsAgo = 11 - i;
        const monthStart = startOfMonth(addMonths(now, -monthsAgo));
        const monthEnd = startOfMonth(addMonths(now, -monthsAgo + 1));
        const count = await db.ticketMaintenance.count({
          where: {
            createdAt: {
              gte: monthStart,
              lt: monthEnd,
            },
            employee: { email: email },
          },
        });
        const monthLabel = format(monthStart, "MMM yyyy");
        return { month: monthLabel, total: count };
      })
    );

    return NextResponse.json({
      total: totalTicket,
      open: openTicket,
      monthly: monthlyData,
    });
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
