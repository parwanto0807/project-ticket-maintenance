"use server";

import { generateTicketNumber } from "@/data/asset/ticket";
// import * as z from "zod"
import { db } from "@/lib/db";
import { CreateTicketMaintenanceOnAssignSchema, CreateTicketMaintenanceSchema, UpdateTicketMaintenanceSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export const createTicket = async (formData: FormData) => {
  try {
    const { ticketNumber, countNumber } = await generateTicketNumber();
    const session = await auth(); // Dapatkan user login
    if (!session?.user?.id) {
      return { error: "User not authenticated" };
    }


    const rawData = {
      troubleUser: formData.get("troubleUser") as string,
      analisaDescription: formData.get("analisaDescription") as string | "",
      actionDescription: formData.get("actionDescription") as string | "",
      priorityStatus: formData.get("priorityStatus") as "Low" | "Medium" | "High" | "Critical",
      status: (formData.get("status") as string).replace(" ", "_") as "Pending" | "In_Progress" | "Completed", // Normalize status
      employeeId: formData.get("employeeId") as string,
      assetId: formData.get("assetId") as string,
      scheduledDate: undefined,
      completedDate: undefined,
      ticketNumber,
      countNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // console.log("Raw Data", rawData);

    const result = CreateTicketMaintenanceSchema.safeParse(rawData);
    // console.log("Result", result);
    if (!result.success) {
      return { error: "Invalid field data", details: result.error.format() };
    }

    const newTicket = await db.ticketMaintenance.create({
      data: result.data,
    });

    revalidatePath("/dashboard/maintenance/ticket");
    return { success: "Ticket created successfully!", data: newTicket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Failed to create ticket" };
  }
};



export const updateTicket = async (id: string, formData: FormData) => {
  if (!id) return { error: "Asset ID is required" };

  // Parse FormData
  const rawData = {
    analisaDescription: formData.get("analisaDescription") || undefined,
    actionDescription: formData.get("actionDescription") || undefined,
    priorityStatus: formData.get("priorityStatus") || undefined,
    status: formData.get("status") || undefined,
    scheduledDate: formData.get("scheduledDate") || undefined,
    assetId: formData.get("assetId") || undefined,
    employeeId: formData.get("employeeId") || undefined,
  };

  // Validasi data dengan UpdateTicketMaintenanceSchema
  const result = UpdateTicketMaintenanceSchema.safeParse(rawData);

  if (!result.success) {
    return { error: "Invalid field data" };
  }

  // Hapus field yang undefined agar sesuai dengan tipe Prisma
  const filteredData = Object.fromEntries(
    Object.entries(result.data).filter(([, v]) => v !== undefined)
  );

  try {
    await db.ticketMaintenance.update({
      where: { id },
      data: {
        ...filteredData,
        updatedAt: new Date(), // Pastikan updatedAt selalu diperbarui
      },
    });


    revalidatePath("/dashboard/maintenance/ticket");
    return { success: "Ticket updated successfully!" };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { error: "Failed to update ticket" };
  }
};

export const deleteTicket = async (id: string) => {
  try {
    await db.ticketMaintenance.delete({
      where: {
        id: id
      }
    })
    revalidatePath("/dashboard/maintenance/ticket")
    return { message: "Delete ticket successfull" }
  } catch {
    return { message: "Delete ticket Filed!" }
  }
}

export const createTicketAssign = async (formData: FormData) => {
  try {
    const { ticketNumber, countNumber } = await generateTicketNumber();
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "User not authenticated" };
    }

    const scheduledDateStr = formData.get("scheduledDate") as string | null;
    const scheduledDate = scheduledDateStr ? new Date(scheduledDateStr) : undefined;

    const rawData = {
      troubleUser: formData.get("troubleUser") as string,
      analisaDescription: (formData.get("analisaDescription") as string) || "",
      actionDescription: (formData.get("actionDescription") as string) || "",
      priorityStatus: formData.get("priorityStatus") as "Low" | "Medium" | "High" | "Critical",
      status: ((formData.get("status") as string) || "").replace(" ", "_") as "Pending" | "In_Progress" | "Completed",
      employeeId: formData.get("employeeId") as string,
      technicianId: formData.get("technicianId") as string,
      assetId: formData.get("assetId") as string,
      scheduledDate,
      completedDate: undefined,
      ticketNumber,
      countNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log(rawData);

    const result = CreateTicketMaintenanceOnAssignSchema.safeParse(rawData);
    if (!result.success) {
      return { error: "Invalid field data", details: result.error.format() };
    }

    const newTicket = await db.ticketMaintenance.create({
      data: result.data,
    });

    revalidatePath("/dashboard/technician/assign");
    return { success: "Ticket created successfully!", data: newTicket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Failed to create ticket" };
  }
};

export const updateTicketAssign = async (formData: FormData) => {
  try {
    // Pastikan ticketId tersedia dalam FormData
    const ticketId = formData.get("ticketId") as string;
    if (!ticketId) {
      return { error: "Ticket ID is required" };
    }

    // Ambil dan konversi nilai scheduledDate dan completedDate
    const scheduledDateStr = formData.get("scheduledDate") as string | null;
    const scheduledDate = scheduledDateStr ? new Date(scheduledDateStr) : undefined;

    const completedDateStr = formData.get("completedDate") as string | null;
    const completedDate = completedDateStr ? new Date(completedDateStr) : undefined;

    // Bangun data mentah untuk update
    const rawData = {
      troubleUser: formData.get("troubleUser") as string,
      analisaDescription: (formData.get("analisaDescription") as string) || "",
      actionDescription: (formData.get("actionDescription") as string) || "",
      priorityStatus: formData.get("priorityStatus") as "Low" | "Medium" | "High" | "Critical",
      // Normalize status dengan mengganti spasi dengan underscore
      status: ((formData.get("status") as string) || "").replace(" ", "_") as "Pending" | "In_Progress" | "Completed",
      employeeId: formData.get("employeeId") as string,
      technicianId: formData.get("technicianId") as string,
      assetId: formData.get("assetId") as string,
      scheduledDate,
      completedDate,
      updatedAt: new Date(),
    };

    // Validasi data menggunakan schema (gunakan schema yang sesuai dengan update)
    const result = CreateTicketMaintenanceOnAssignSchema.safeParse(rawData);
    if (!result.success) {
      return { error: "Invalid field data", details: result.error.format() };
    }

    // Update record di database
    const updatedTicket = await db.ticketMaintenance.update({
      where: { id: ticketId },
      data: result.data,
    });

    // Revalidasi path agar data di dashboard ter-refresh
    revalidatePath("/dashboard/technician/assign");

    return { success: "Ticket updated successfully!", data: updatedTicket };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { error: "Failed to update ticket" };
  }
};

