import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Sesuaikan dengan path koneksi database

export async function GET(req: Request, { params }: { params: { email: string } }) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Gunakan Promise.all() untuk mengambil data total asset dan total purchaseCost secara bersamaan
    const [totalAsset, purchaseSummary] = await Promise.all([
      db.asset.count({
        where: {
          employee: {
            email: email, // Hitung jumlah asset berdasarkan email
          },
        },
      }),
      db.asset.aggregate({
        _sum: {
          purchaseCost: true, // Menjumlahkan semua purchaseCost berdasarkan email
        },
        where: {
          employee: {
            email: email,
          },
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
