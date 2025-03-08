import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startOfMonth, addMonths, format } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Buat array untuk 12 bulan terakhir, urut dari bulan paling lama ke bulan paling baru
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(addMonths(now, -i));
      const monthEnd = startOfMonth(addMonths(now, -i + 1));
      const label = format(monthStart, "MMM yyyy"); // misalnya "Jul 2023"
      months.push({ label, monthStart, monthEnd });
    }

    // Jalankan query count untuk setiap bulan secara paralel
    const counts = await Promise.all(
      months.map(async (m) => {
        const count = await db.ticketMaintenance.count({
          where: {
            createdAt: {
              gte: m.monthStart,
              lt: m.monthEnd,
            },
            employee: {
              email: email,
            },
          },
        });
        return { name: m.label, total: count };
      })
    );

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}