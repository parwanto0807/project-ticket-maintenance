"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { messaging } from "@/lib/firebase-messaging";
import { getToken, onMessage } from "firebase/messaging";

export default function NotificationBell() {
  const router = useRouter(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [notifications, setNotifications] = useState<{ title: string; body: string }[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // ✅ Ambil notifikasi dari sessionStorage
    const storedNotifications = sessionStorage.getItem("notifications");
    const storedUnreadCount = sessionStorage.getItem("unreadCount");

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
    if (storedUnreadCount) {
      setUnreadCount(Number(storedUnreadCount));
    }
  }, []);

  useEffect(() => {
    async function getFirebaseToken() {
      if (!messaging) return;
      try {
        const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        if (token) {
          console.log("✅ FCM Token:", token);
        } else {
          console.warn("⚠️ Token FCM tidak tersedia.");
        }
      } catch (error) {
        console.error("❌ Gagal mendapatkan token FCM:", error);
      }
    }
    getFirebaseToken();
  }, []);

  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔔 Notifikasi masuk:", payload);
      if (payload.notification) {
        const newNotification = {
          title: payload.notification?.title || "No Title",
          body: payload.notification?.body || "No Body",
        };

        setNotifications((prev) => {
          const updatedNotifications = [newNotification, ...prev];
          sessionStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // ✅ Simpan ke sessionStorage
          return updatedNotifications;
        });

        setUnreadCount((prev) => {
          const newCount = prev + 1;
          sessionStorage.setItem("unreadCount", String(newCount)); // ✅ Simpan ke sessionStorage
          return newCount;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Reset unread count saat popover dibuka
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setUnreadCount(0);
      sessionStorage.setItem("unreadCount", "0");
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <h4 className="font-semibold text-lg mb-2">Notifikasi</h4>
        {notifications.length === 0 ? (
          <p className="text-gray-500">Tidak ada notifikasi</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notif, index) => (
              <li key={index} className="border p-2 rounded bg-gray-100">
                <p className="font-semibold">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.body}</p>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
