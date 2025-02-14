"use server"

import * as z from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { DeptSchema, EmployeeSchemaCreate } from "@/schemas";
import { getDeptById } from "@/data/master/employee";
import { put, del } from "@vercel/blob";

export const deleteEmployee = async (id: string) => {
    try {
        await db.employee.delete({
            where: {
                id
            }
        });
        revalidatePath('/dahsboard/master/employees')
        return { success: "Deleted employee successfull" }
    } catch {
        return { error: "Filed deleted employee" }
    }
}

export const updateEmployee = async (id: string, formData: FormData) => {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const address = formData.get("address") as string;
        const userDept = formData.get("userDept") as string;
        const picture = formData.get("picture") as File | null;

        if (!name || !email || !address || !userDept) {
            return { error: "Semua field wajib diisi" };
        }

        // Ambil data karyawan lama untuk mendapatkan nama gambar lama
        const existingEmployee = await db.employee.findUnique({
            where: { id },
            select: { picture: true }, // Hanya ambil gambar
        });

        let imageUrl: string | undefined;

        if (picture) {
            // Hapus gambar lama jika ada
            if (existingEmployee?.picture) {
                await del(existingEmployee.picture);
            }

            // Simpan gambar baru ke Vercel Blob Storage
            const { url } = await put(picture.name, picture, {
                access: "public",
                contentType: picture.type,
            });

            imageUrl = url; 
        }

        await db.employee.update({
            where: { id },
            data: {
                name,
                email,
                address,
                userDept,
                ...(imageUrl ? { picture: imageUrl } : {}),
            },
        });
        revalidatePath('/dahsboard/master/employees')
        return { success: "Berhasil memperbarui karyawan" };
    } catch (error) {
        console.error("Error updating employee:", error);
        return { error: "Gagal memperbarui karyawan" };
    }
};

export const createEmployee = async (formData: FormData) => {
    const now = new Date();

    // Convert FormData ke Object biasa
    const values = {
        userDept: formData.get("userDept") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        picture: formData.get("picture") as File | null | string,
    };

    // Validasi dengan Zod
    const validatedFieldDept = EmployeeSchemaCreate.safeParse(values);
    if (!validatedFieldDept.success) {
        console.error(validatedFieldDept.error);
        return { error: "Invalid input data" };
    }

    const { name, userDept, address, email, picture } = validatedFieldDept.data;
    try {
        let imageUrl = "";

        // Upload gambar jika ada
        if (picture) {
            const { url } = await put(
                picture.name ,
                picture,
                {
                    access: "public",
                    contentType: picture.type,
                });
            imageUrl = url;
        }

        // Simpan data ke database
        await db.employee.create({
            data: {
                userDept,
                address,
                email,
                name,
                picture: imageUrl, // Simpan URL gambar jika ada
                createdAt: now,
                updatedAt: now,
            },
        });

        // Revalidate path
        revalidatePath("/dashboard/master/employees/create");
        return { success: "Successfully created department" };
    } catch (error) {
        console.error("Error creating department:", error);
        return { error: "Failed to create department" };
    }
};

export const createDept = async (values: z.infer<typeof DeptSchema>) => {
    const validatedFieldDept = DeptSchema.safeParse(values)
    const now = new Date()

    if (!validatedFieldDept.success) {
        //const errors = validatedField.error.flatten().fieldErrors
        return {
            error: "Invalid Credentials"
        }
    }

    const {
        dept_name,
    } = validatedFieldDept.data;

    const existingDept = await getDeptById(dept_name);
    if (existingDept) {
        return { error: `Department ${validatedFieldDept.data.dept_name} already in use` }
    }

    try {
        await db.department.create({
            data: {
                dept_name: validatedFieldDept.data.dept_name,
                note: validatedFieldDept.data.note,
                createdAt: now,
                updatedAt: now
            }
        })
        revalidatePath('/dashboard/master/employees/create')
        return { success: "Succesfully created department" };
    } catch {
        return { error: "Filed created department" }
    }
}

export const deleteDept = async (id: string) => {
    try {
        await db.department.delete({
            where: {
                id: (id)
            }
        })
    } catch {
        return { error: "Filed deleted department" }
    }
}