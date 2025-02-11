import { NextRequest, NextResponse } from "next/server";
import { createAsset } from "@/action/asset/asset";  // Pastikan path ini sesuai dengan file fungsi createAsset
import { AssetSchema } from "@/schemas"; // Pastikan Anda sudah mendefinisikan skema AssetSchema

export async function POST(req: NextRequest) {
  try {
    // Mengambil body dari request
    const values = await req.json();

    // Validasi data dengan Zod
    const validationResult = AssetSchema.safeParse(values);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid fields", details: validationResult.error.errors }, { status: 400 });
    }

    const validatedValues = validationResult.data;

    // Memanggil fungsi untuk membuat asset
    const result = await createAsset(validatedValues);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result?.success) {
      return NextResponse.json({ success: result.success }, { status: 200 });
    }

    // Jika terjadi error tidak terduga
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });

  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
