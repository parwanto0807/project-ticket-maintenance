import { NextRequest, NextResponse } from "next/server";
import { fetchMaintenancePlannerData } from "@/data/asset/planner";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);

    try {
        const data = await fetchMaintenancePlannerData(year);
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch planner data" }, { status: 500 });
    }
}
