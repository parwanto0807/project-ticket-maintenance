"use server";

import { db } from "@/lib/db";
import { TechnicianSchema } from "@/schemas";

export async function createTechnician(formData: FormData) {
  try {
    // Konversi FormData ke Object
    const technicianData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      specialization: formData.get("specialization"),
      status: formData.get("status"),
      createdAt: new Date(), // Tambahkan timestamp
      updatedAt: new Date(), // Tambahkan timestamp
    };

    // 🔹 Validasi data dengan TechnicianSchema
    const parsedData = TechnicianSchema.safeParse(technicianData);

    if (!parsedData.success) {
      return { error: "Invalid data", details: parsedData.error.format() };
    }

    // 🔹 Cek apakah email sudah ada di database (hindari duplikasi)
    const existingTechnician = await db.technician.findUnique({
      where: { email: parsedData.data.email },
    });

    if (existingTechnician) {
      return { error: "Technician with this email already exists." };
    }

    // 🔹 Simpan data yang sudah divalidasi
    const technician = await db.technician.create({
      data: {
        ...parsedData.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: "Technician successfully created!", technician };
  } catch (error) {
    console.error("Error creating technician:", error);
    return { error: "Failed to create technician." };
  }
}
