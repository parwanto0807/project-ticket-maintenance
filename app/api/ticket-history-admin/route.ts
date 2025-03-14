import { NextResponse } from "next/server";
import { fetchTicketListHistory } from "@/data/asset/ticket";
import { z } from "zod";

// 🔹 Validasi query params menggunakan Zod
const querySchema = z.object({
    query: z.string().optional(),
    currentPage: z.string(),
});

// 🔹 API Handler untuk `GET /api/tickets`
export async function GET(req: Request) {
    try {
        // 🔹 Ambil query parameter dari URL
        const { searchParams } = new URL(req.url);
        const params = {
            query: searchParams.get("query") || "",
            currentPage: searchParams.get("currentPage") || "1",
        };

        // 🔹 Validasi parameter
        const validatedParams = querySchema.parse(params);
        const currentPage = parseInt(validatedParams.currentPage, 10);

        // 🔹 Cek apakah `email` dikirimkan
        // if (!validatedParams.email) {
        //     return NextResponse.json(
        //         { error: "Email is required" },
        //         { status: 400 }
        //     );
        // }

        // 🔹 Fetch ticket data dari database
        const tickets = await fetchTicketListHistory(validatedParams.query || "", currentPage);

        return NextResponse.json({ data: tickets }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json(
            { error: "Failed to fetch tickets" },
            { status: 500 }
        );
    }
}
