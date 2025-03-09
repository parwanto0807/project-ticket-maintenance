import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const employeeId = params.id;
        const formData = await req.formData();

        // Ambil data dari form
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const emailCorporate = formData.get("emailCorporate") as string;
        const address = formData.get("address") as string;
        const userDept = formData.get("userDept") as string;
        const file = formData.get("picture") as File | null;

        if (!name || !email || !address || !userDept) {
            return NextResponse.json({ message: "Semua field wajib diisi!" }, { status: 400 });
        }

        // Cari employee lama
        const existingEmployee = await db.employee.findUnique({
            where: { id: employeeId },
        });

        if (!existingEmployee) {
            return NextResponse.json({ message: "Employee tidak ditemukan!" }, { status: 404 });
        }

        let imageUrl = existingEmployee.picture;
        const uploadDir = "/var/www/uploads";

        if (file) {
            // Hapus gambar lama jika ada
            if (existingEmployee.picture) {
                const oldImagePath = path.join(uploadDir, path.basename(existingEmployee.picture));
                try {
                    if (fs.existsSync(oldImagePath)) {
                        await unlink(oldImagePath);
                    }
                } catch (error) {
                    console.error("Gagal menghapus gambar lama:", error);
                }
            }

            // Simpan gambar baru
            const ext = path.extname(file.name);
            const uniqueFileName = `${uuidv4()}${ext}`;
            const filePath = path.join(uploadDir, uniqueFileName);

            // Pastikan folder /var/www/uploads ada
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Simpan file ke /var/www/uploads/
            const bytes = await file.arrayBuffer();
            await writeFile(filePath, Buffer.from(bytes));

            // Set kepemilikan file agar bisa diakses oleh Apache
            fs.chownSync(filePath, 33, 33); // UID & GID 33 = www-data

            // Update URL gambar baru
            imageUrl = `/uploads/${uniqueFileName}`;
        }

        // Update data employee di database
        const updatedEmployee = await db.employee.update({
            where: { id: employeeId },
            data: {
                name,
                email,
                emailCorporate,
                address,
                userDept,
                picture: imageUrl,
            },
        });

        return NextResponse.json({ message: "Data Employee berhasil diperbarui!", employee: updatedEmployee }, { status: 200 });

    } catch (error) {
        console.error("Error saat memperbarui Employee:", error);
        return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui data!" }, { status: 500 });
    }
}
