import { db } from "./db";
import { adminMessaging } from "./firebase-admin";

export const sendNotificationToAdmins = async (title: string, message: string, link?: string) => {
    try {
        // Get all admins with FCM tokens
        const admins = await db.user.findMany({
            where: {
                role: "ADMIN",
            },
            select: { id: true, fcmToken: true },
        });

        const tokens = admins.map((admin) => admin.fcmToken as string).filter(Boolean);

        const payload = {
            notification: {
                title,
                body: message,
            },
            data: link ? { link } : {},
        };

        // 1. Save notifications to the database for each admin
        await db.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id || "",
                title,
                message,
                link,
            })).filter(n => n.userId),
        });

        // 2. Send push notifications if tokens exist
        if (tokens.length > 0) {
            const dataPayload: { [key: string]: string } = link ? { link } : {};
            await adminMessaging.sendEachForMulticast({
                tokens,
                notification: payload.notification,
                data: dataPayload,
            });
        }
    } catch (error) {
        console.error("Error sending notification to admins:", error);
    }
};

export const sendNotificationToTechnician = async (technicianId: string, title: string, message: string, link?: string) => {
    try {
        // 1. Get the technician's email
        const technician = await db.technician.findUnique({
            where: { id: technicianId },
            select: { email: true },
        });

        if (!technician || !technician.email) return;

        // 2. Find the User associated with this email
        const user = await db.user.findUnique({
            where: { email: technician.email },
            select: { id: true, fcmToken: true },
        });

        if (!user) return;

        // 3. Save notification to DB
        await db.notification.create({
            data: {
                userId: user.id,
                title,
                message,
                link,
            },
        });

        // 4. Send push notification if token exists
        if (user.fcmToken) {
            await adminMessaging.send({
                token: user.fcmToken,
                notification: {
                    title,
                    body: message,
                },
                data: link ? { link } : {},
            });
            console.log(`Notification sent to technician: ${technician.email}`);
        }
    } catch (error) {
        console.error("Error sending notification to technician:", error);
    }
};

export const sendNotificationToUser = async (employeeId: string, title: string, message: string, link?: string) => {
    try {
        console.log(`Starting sendNotificationToUser for employeeId: ${employeeId}`);
        // 1. Get the employee's email
        const employee = await db.employee.findUnique({
            where: { id: employeeId },
            select: { email: true, emailCorporate: true },
        });

        if (!employee) {
            console.error(`Employee not found for id: ${employeeId}`);
            return;
        }
        if (!employee.email) {
            console.error(`Employee ${employeeId} has no email`);
            return;
        }

        console.log(`Found employee email: ${employee.email}`);

        // 2. Find the User associated with the employee email
        // We try primary email first, then emailCorporate as fallback
        let user = await db.user.findUnique({
            where: { email: employee.email },
            select: { id: true, fcmToken: true },
        });

        if (!user && employee.emailCorporate) {
            console.log(`Primary email failed, trying corporate email: ${employee.emailCorporate}`);
            user = await db.user.findUnique({
                where: { email: employee.emailCorporate },
                select: { id: true, fcmToken: true },
            });
        }

        if (!user) {
            console.error(`No User account found matching employee email: ${employee.email} or corporate email: ${employee.emailCorporate}`);
            return;
        }

        console.log(`Found matching User id: ${user.id}, FCM Token present: ${!!user.fcmToken}`);

        // 3. Save notification to DB
        await db.notification.create({
            data: {
                userId: user.id,
                title,
                message,
                link,
            },
        });

        // 4. Send push notification if token exists
        if (user.fcmToken) {
            const dataPayload: { [key: string]: string } = link ? { link } : {};
            await adminMessaging.send({
                token: user.fcmToken,
                notification: {
                    title,
                    body: message,
                },
                data: dataPayload,
            });
            console.log(`Push notification sent to user: ${user.id}`);
        } else {
            console.log(`No FCM token for user: ${user.id}, push skipped but DB record created.`);
        }
    } catch (error) {
        console.error("Error sending notification to user:", error);
    }
};
