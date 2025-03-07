"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import InstallButton from "./installButton";
import DashboardCards from "../user-panel/dashboard-card";
import DashboardChartSection from "../user-panel/ticket-maintenance-chart";


export default function DashboardOverviewPage() {
  const user = useCurrentUser();
  return (
    <div className="relative min-h-screen bg-orange-100 dark:bg-slate-900">
      {/* Header dengan tema orange Sky */}
      <header className="py-8 px-2 bg-gradient-to-t from-orange-200 to-orange-300 text-gray-800 flex flex-col items-center justify-center shadow-lg rounded-md dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 dark:text-white">
        <h1 className="text-xl font-bold text-center">Hi, Welcome back {user?.name}👋</h1>
      </header>
      {/* Tombol Install (opsional) */}
      <div className="absolute top-4 right-4">
        <InstallButton />
      </div>
      {/* Dashboard Cards */}
      <section className="mt-4 px-4">
        <DashboardCards />
      </section>
      {/* Ticket Maintenance Chart */}
      <section className="mt-4 px-4">
        <DashboardChartSection />
      </section>
    </div>
  );
}
