import { NextRequest, NextResponse } from "next/server";
import { fetchMaintenancePlannerData } from "@/data/asset/planner";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const query = searchParams.get("query") || "";

    try {
        const data = await fetchMaintenancePlannerData(year, page, query);
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch planner data" }, { status: 500 });
    }
}
