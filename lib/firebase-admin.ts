import * as admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || "ticket-maintenance-96997";
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@ticket-maintenance-96997.iam.gserviceaccount.com";
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "";

        if (!privateKey) {
            console.error("Firebase Admin: FIREBASE_PRIVATE_KEY is missing from environment variables!");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log("Firebase Admin initialized successfully");
    } catch (error) {
        console.error("Firebase admin initialization error", error);
    }
}

export const adminMessaging = admin.messaging();
