import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Generate nama unik untuk gambar
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Ambil field dari formData
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const emailCorporate = formData.get("emailCorporate") as string;
        const address = formData.get("address") as string;
        const userDept = formData.get("userDept") as string;
        const file = formData.get("picture") as File;

        // Validasi input
        if (!name || !email || !address || !userDept || !file) {
            return NextResponse.json({ message: "Semua field wajib diisi!" }, { status: 400 });
        }

        // Generate nama file unik dengan UUID + ekstensi asli
        const ext = path.extname(file.name);
        const uniqueFileName = `${uuidv4()}${ext}`;

        // Path penyimpanan gambar
        const filePath = path.join(process.cwd(), "public/uploads", uniqueFileName);

        // Simpan gambar ke server (folder /public/uploads)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Simpan data ke database menggunakan Prisma
        const newEmployee = await db.employee.create({
            data: {
                name,
                email,
                emailCorporate,
                address,
                userDept,
                picture: `/uploads/${uniqueFileName}`, // Path gambar di database
            },
        });

        return NextResponse.json({ message: "Data Employee berhasil disimpan!", employee: newEmployee }, { status: 201 });
    } catch (error) {
        console.error("Error saat menyimpan Employee:", error);
        return NextResponse.json({ message: "Terjadi kesalahan saat menyimpan data!" }, { status: 500 });
    }
}
