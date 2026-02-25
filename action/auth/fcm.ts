"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const saveFcmToken = async (token: string) => {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "User not authenticated" };
        }

        await db.user.update({
            where: { id: session.user.id },
            data: { fcmToken: token },
        });

        return { success: "FCM Token saved successfully" };
    } catch (error) {
        console.error("Error saving FCM token:", error);
        return { error: "Failed to save FCM token" };
    }
};
