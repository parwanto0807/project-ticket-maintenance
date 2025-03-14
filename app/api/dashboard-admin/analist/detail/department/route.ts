import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { fetchTicketAnalistDepartment } from "@/data/asset/ticket"; // Menggunakan fungsi yang sudah dibuat
import { subMonths, startOfMonth } from "date-fns";

export async function GET() {
    noStore();
    try {
        // Hitung tanggal mulai dari 12 bulan terakhir
        const startDate = startOfMonth(subMonths(new Date(), 11)); // Ambil data dari 12 bulan terakhir

        // Ambil data dari backend
        const tickets = await fetchTicketAnalistDepartment();

        // Filter hanya tiket yang dibuat dalam 12 bulan terakhir
        const filteredTickets = tickets.filter((ticket) => 
            new Date(ticket.createdAt) >= startDate
        );
        // console.log(JSON.stringify(filteredTickets));
        return NextResponse.json(JSON.parse(JSON.stringify(filteredTickets)));


    } catch (error) {
        console.error("Error fetching ticket data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
