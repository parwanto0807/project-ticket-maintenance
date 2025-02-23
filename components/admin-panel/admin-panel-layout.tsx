"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase-messaging";;// Sesuaikan dengan lokasi Firebase
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { data: session } = useSession();

  useEffect(() => {
    async function getFirebaseToken() {
      if (!messaging) {
        console.warn("⚠️ Firebase Messaging tidak tersedia.");
        return;
      }
      if (session?.user) {
        try {
          const token = await getToken(messaging, { 
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
          });
  
          if (token) {
            console.log("✅ FCM Token didapatkan:", token); // Tambahkan ini
            await fetch("/api/save-fcm-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session.user.id, fcmToken: token }),
            });
            console.log("✅ Token dikirim ke API");
          } else {
            console.warn("⚠️ FCM Token kosong");
          }
        } catch (err) {
          console.error("🔥 Error mendapatkan token FCM:", err);
        }
      }
    }
    getFirebaseToken();
  }, [session]);
  

  if (!sidebar) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-grow transition-[margin-left] ease-in-out duration-300",
          fontSans.variable,
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}





// "use client";

// import { cn } from "@/lib/utils";
// import { useStore } from "@/hooks/use-store";
// // import { Footer } from "@/components/admin-panel/footer";
// import { Sidebar } from "@/components/admin-panel/sidebar";
// import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
// import { Inter as FontSans } from "next/font/google";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// export default function AdminPanelLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const sidebar = useStore(useSidebarToggle, (state) => state);

//   if (!sidebar) return null;

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Sidebar />
//       <div
//         className={cn(
//           "flex flex-col flex-grow transition-[margin-left] ease-in-out duration-300",
//           fontSans.variable,
//           sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
//         )}
//       >
//         <main className="flex-grow">{children}</main>
//         {/* <footer className="w-full">
//           <Footer />
//         </footer> */}
//       </div>
//     </div>
//   );
// }
