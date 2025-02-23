import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// Pastikan kamu sudah mengunduh `serviceAccountKey.json` dari Firebase Console
const serviceAccountPath = path.resolve(process.cwd(), "lib/serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// Inisialisasi Firebase Admin jika belum ada
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Inisialisasi Firebase Cloud Messaging
export const messaging = admin.messaging();

/**
 * Fungsi untuk mengirim notifikasi Firebase Cloud Messaging (FCM)
 * @param title Judul notifikasi
 * @param body Isi notifikasi
 * @param token Token FCM pengguna (harus disimpan di database)
 */
export const sendNotification = async ({
  title,
  body,
  token,
}: {
  title: string;
  body: string;
  token: string;
}) => {
  try {
    await messaging.send({
      token,
      notification: {
        title,
        body,
      },
    });
    console.log("✅ Notifikasi berhasil dikirim");
  } catch (error) {
    console.error("❌ Gagal mengirim notifikasi:", error);
  }
};
