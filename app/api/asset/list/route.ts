import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';
import { fetchAssetListByEmail } from "@/data/asset/asset";

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
    const { assets, totalPages } = await fetchAssetListByEmail(query, currentPage, email);

    // ✅ Pastikan data yang dikembalikan dalam bentuk objek dengan totalPages
    return NextResponse.json({ assets, totalPages }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching asset list:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data", error: error },
      { status: 500 }
    );
  }
}
