"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
// import { Footer } from "@/components/admin-panel/footer";
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
        {/* <footer className="w-full">
          <Footer />
        </footer> */}
      </div>
    </div>
  );
}
