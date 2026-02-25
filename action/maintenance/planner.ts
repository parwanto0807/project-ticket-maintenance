"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateTicketNumber } from "@/data/asset/ticket";
import { auth } from "@/auth";
import { sendNotificationToAdmins, sendNotificationToTechnician } from "@/lib/notification";

export async function toggleMaintenanceSchedule(assetId: string, date: string, technicianId?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Not authenticated" };

        const scheduledDate = new Date(date);

        // Check if a PM ticket already exists for this exact day (to prevent duplicates)
        const existingTicket = await db.ticketMaintenance.findFirst({
            where: {
                assetId,
                scheduledDate: {
                    gte: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate()),
                    lte: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), 23, 59, 59)
                },
                troubleUser: "Preventive Maintenance",
                status: { not: "Canceled" }
            }
        });

        if (existingTicket) {
            // If it exists, update it instead of toggling/deleting
            await db.ticketMaintenance.update({
                where: { id: existingTicket.id },
                data: {
                    technicianId: technicianId || null,
                    status: technicianId ? "Assigned" : "Pending",
                    scheduledDate,
                    updatedAt: new Date(),
                }
            });
            revalidatePath("/dashboard/technician/planner");
            return { success: "Jadwal berhasil diperbarui!" };
        }

        // Create new PM ticket
        const { ticketNumber, countNumber } = await generateTicketNumber();
        const asset = await db.asset.findUnique({ where: { id: assetId } });

        if (!asset) return { error: "Asset not found" };

        if (!asset.employeeId) {
            const fallbackEmployee = await db.employee.findFirst();
            if (!fallbackEmployee) return { error: "Tabel Employee kosong. Mohon isi data karyawan terlebih dahulu." };
            asset.employeeId = fallbackEmployee.id;
        }

        await db.ticketMaintenance.create({
            data: {
                ticketNumber,
                countNumber,
                assetId,
                employeeId: asset.employeeId,
                technicianId: technicianId || null,
                troubleUser: "Preventive Maintenance",
                analisaDescription: "Scheduled Preventive Maintenance",
                priorityStatus: "Medium",
                status: technicianId ? "Assigned" : "Pending",
                scheduledDate,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        // Send notification to admins
        await sendNotificationToAdmins(
            "New Preventive Maintenance",
            `A new PM ticket (${ticketNumber}) has been scheduled for asset ${asset.assetNumber}.`,
            `/dashboard/technician/planner`
        );

        // Send notification to technician if assigned
        if (technicianId) {
            await sendNotificationToTechnician(
                technicianId,
                "New PM Schedule",
                `You have been assigned a new PM task (${ticketNumber}) for asset ${asset.assetNumber}.`,
                `/dashboard/technician/planner`
            );
        }

        revalidatePath("/dashboard/technician/planner");
        return { success: "Jadwal berhasil dibuat!" };
    } catch (error) {
        console.error("Schedule error:", error);
        return { error: "Gagal memproses jadwal" };
    }
}

export async function deleteMaintenanceSchedule(ticketId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Not authenticated" };

        const ticket = await db.ticketMaintenance.findUnique({ where: { id: ticketId } });
        if (!ticket) return { error: "Tiket tidak ditemukan" };

        if (ticket.status !== "Pending" && ticket.status !== "Assigned") {
            return { error: "Tidak dapat menghapus jadwal yang sudah diproses atau selesai" };
        }

        await db.ticketMaintenance.delete({ where: { id: ticketId } });

        revalidatePath("/dashboard/technician/planner");
        return { success: "Jadwal berhasil dihapus" };
    } catch (error) {
        console.error("Delete error:", error);
        return { error: "Gagal menghapus jadwal" };
    }
}
