import admin from "firebase-admin";

// Pastikan Firebase hanya diinisialisasi sekali
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const sendNotification = async ({
  title,
  body,
  token,
}: {
  title: string;
  body: string;
  token: string;
}) => {
  console.log("🔔 Mengirim notifikasi ke:", token);
  console.log("📢 Judul:", title);
  console.log("📃 Pesan:", body);

  try {
    const message = {
      notification: { title, body },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notifikasi berhasil dikirim:", response);
  } catch (error) {
    console.error("❌ Gagal mengirim notifikasi:", error);
  }
};
