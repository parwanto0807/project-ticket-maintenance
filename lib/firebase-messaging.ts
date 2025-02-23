"use client";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase"; // Ambil `app` dari firebase.ts

// Cek apakah window tersedia sebelum inisialisasi Messaging
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// Fungsi untuk mendapatkan token FCM
export async function requestForToken(): Promise<string | null> {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error("Gagal mendapatkan token FCM:", error);
    return null;
  }
}

// Event listener untuk menerima notifikasi saat aplikasi berjalan
export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log("🔔 Notifikasi masuk:", payload);
      resolve(payload);
    });
  });
}
