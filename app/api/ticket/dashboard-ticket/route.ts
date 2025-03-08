import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function GET() {
  try {

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
    const salesData = tickets.map((ticket) => ({
      name: ticket.employee.name,
      email: ticket.troubleUser,
      amount: ticket.ticketNumber,
      status: ticket.status,
    }));

    return NextResponse.json(salesData);
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
