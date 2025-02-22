import { NextResponse } from "next/server";
import { db } from "@/lib/db";// Sesuaikan path ke prisma instance

export async function GET() {
    try {
        // Dapatkan tanggal saat ini
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2); // Ambil 2 digit terakhir tahun
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan (dari 1-12)

        const lastTicket = await db.ticketMaintenance.findFirst({
            where: {
                ticketNumber: {
                    startsWith: `T-${year}${month}`, // Cari yang formatnya sama
                },
            },
            orderBy: { countNumber: "desc" }, // Ambil nomor urut terbesar
            select: { countNumber: true },
        });

        const newIdNumber = lastTicket?.countNumber ? lastTicket.countNumber + 1 : 1;
        const newTicketNumber = `T-${year}${month}${String(newIdNumber).padStart(4, "0")}`;

        return NextResponse.json({ ticketNumber: newTicketNumber, countNumber: newIdNumber });
    } catch (error) {
        console.error("Failed to generate ticket number", error);
        return NextResponse.json({ error: "Failed to generate ticket number" }, { status: 500 });
    }
}
