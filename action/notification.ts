"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const getNotifications = async () => {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Not authenticated" };

        const notifications = await db.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return { data: notifications };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { error: "Failed to fetch notifications" };
    }
};

export const markAsRead = async (id: string) => {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Not authenticated" };

        await db.notification.update({
            where: { id, userId: session.user.id },
            data: { isRead: true },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { error: "Failed to mark as read" };
    }
};

export const markAllAsRead = async () => {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Not authenticated" };

        await db.notification.updateMany({
            where: { userId: session.user.id, isRead: false },
            data: { isRead: true },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return { error: "Failed to mark all as read" };
    }
};
