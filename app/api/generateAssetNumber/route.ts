import { NextResponse } from "next/server";
import { generateAssetNumber } from "@/data/asset/asset"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const assetTypeId = searchParams.get("assetTypeId");

        if (!assetTypeId) {
            return NextResponse.json({ error: "Missing assetTypeId" }, { status: 400 });
        }

        const assetNumber = await generateAssetNumber(assetTypeId);
        return NextResponse.json({ assetNumber }, { status: 200 });
    } catch (error) {
        console.error("Error generating asset number:", error);
        return NextResponse.json({ error: "Failed to generate asset number" }, { status: 500 });
    }
}
