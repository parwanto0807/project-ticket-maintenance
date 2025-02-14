import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Sesuaikan dengan setup Prisma di proyekmu

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const asset = await db.asset.findUnique({
      where: { id: params.id },
      include: {
        assetType: true,
        department: true,
        product: true,
        employee: true,
      },
    });

    if (!asset) {
      return NextResponse.json({ message: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
