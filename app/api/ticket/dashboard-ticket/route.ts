import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Pastikan path koneksi database benar

export async function GET() {
  try {
    // Ambil 10 record tiket maintenance terakhir, diurutkan berdasarkan createdAt secara descending
    const tickets = await db.ticketMaintenance.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        employee: true,
        asset: true,
      },
    });

    // Map data ke format yang diinginkan:
    // - name: employee.name
    // - email: employee.email
    // - amount: asset.name (menggantikan amount)
    const salesData = tickets.map((ticket) => ({
      name: ticket.employee.name,
      email: ticket.troubleUser,
      amount: ticket.ticketNumber,
    }));
    console.log(salesData)

    return NextResponse.json(salesData);
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
