// app/api/ticket-list/route.ts

import { NextResponse } from "next/server";
import { fetchTicketListTechnician } from "@/data/asset/ticket"; // Pastikan path-nya sesuai
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: Request) {
  noStore();
  
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "";
  const currentPageStr = url.searchParams.get("currentPage") || "1";
  const email = url.searchParams.get("email") || "";
  const currentPage = parseInt(currentPageStr, 10);

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const tickets = await fetchTicketListTechnician(query, currentPage, email);
    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 200 });
    }
    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching ticket list:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data" },
      { status: 500 }
    );
  }
}
