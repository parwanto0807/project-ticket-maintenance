import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Sesuaikan dengan path koneksi database
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
    noStore()
  try {

    // Gunakan Promise.all() untuk mengambil data total asset dan total purchaseCost secara bersamaan
    const [totalAsset, purchaseSummary] = await Promise.all([
      db.asset.count({
      }),
      db.asset.aggregate({
        _sum: {
          purchaseCost: true, // Menjumlahkan semua purchaseCost berdasarkan email
        },
      }),
    ]);

    return NextResponse.json({
      total: totalAsset, // Total jumlah asset
      totalPurchaseCost: purchaseSummary._sum.purchaseCost || 0, // Total biaya pembelian asset
    });
  } catch (error) {
    console.error("Error fetching asset data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
