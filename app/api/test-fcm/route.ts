import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { adminMessaging } from "@/lib/firebase-admin";

// POST /api/test-fcm - Send a test FCM notification to the current user
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { fcmToken: true, name: true },
        });

        if (!user?.fcmToken) {
            return NextResponse.json({ error: "No FCM token found for this user. Make sure notifications are enabled." }, { status: 400 });
        }

        // Save test notification to DB
        await db.notification.create({
            data: {
                userId: session.user.id,
                title: "🔔 Test Notification",
                message: `Halo ${user.name || "User"}! Ini adalah notifikasi test FCM realtime.`,
                link: "/dashboard",
            },
        });

        // Send FCM push
        const result = await adminMessaging.send({
            token: user.fcmToken,
            notification: {
                title: "🔔 Test Notification",
                body: `Halo ${user.name || "User"}! Ini adalah notifikasi test FCM realtime.`,
            },
            data: {
                link: "/dashboard",
            },
        });

        console.log("Test FCM sent successfully:", result);
        return NextResponse.json({ success: true, messageId: result });
    } catch (error: any) {
        console.error("Test FCM error:", error);
        return NextResponse.json({ error: error.message || "Failed to send test notification" }, { status: 500 });
    }
}
