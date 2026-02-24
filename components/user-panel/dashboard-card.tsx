"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import {
  FaBox,
  FaTicketAlt,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

interface CardItem {
  title: string;
  value: React.ReactNode; // Mengizinkan string, number, atau komponen (misalnya, spinner)
  tooltip?: string;
  icon: React.ReactNode;
}

const DashboardCards = () => {
  const user = useCurrentUser();
  const [totalAssetUser, setTotalAssetUser] = useState<number | null>(null);
  const [totalTicketUser, setTotalTicketUser] = useState<number | null>(null);
  const [openTicketUser, setOpenTicketUser] = useState<number | null>(null);
  const [totalPurchaseCost, setTotalPurchaseCost] = useState<number | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchTotalAsset(user.email);
      fetchTotalTicket(user.email);
    }
  }, [user?.email]);

  const fetchTotalAsset = async (email: string) => {
    try {
      const response = await fetch(`/api/asset/dashboard/${email}`);
      const data = await response.json();
      setTotalAssetUser(data.total || 0);
      setTotalPurchaseCost(data.totalPurchaseCost || 0);
    } catch (error) {
      console.error("Error fetching total assets:", error);
      setTotalAssetUser(0);
      setTotalPurchaseCost(0);
    }
  };

  const fetchTotalTicket = async (email: string) => {
    try {
      const response = await fetch(`/api/ticket/dashboard/${email}`);
      const data = await response.json();
      setTotalTicketUser(data.total || 0);
      setOpenTicketUser(data.open || 0);
    } catch (error) {
      console.error("Error fetching total tickets:", error);
      setTotalTicketUser(0);
      setOpenTicketUser(0);
    }
  };

  const cardData: CardItem[] = [
    {
      title: "Total Asset User",
      value: totalAssetUser !== null ? `${totalAssetUser} Set Asset` : (
        <FaSpinner className="animate-spin text-orange-500 mx-auto" />
      ),
      tooltip: "Jumlah total asset user yang dimiliki",
      icon: <FaBox className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Total Ticket Maintenance",
      value: totalTicketUser !== null ? `${totalTicketUser} Ticket` : (
        <FaSpinner className="animate-spin text-orange-500 mx-auto" />
      ),
      tooltip: "Jumlah total tiket maintenance",
      icon: <FaTicketAlt className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Ticket Open",
      value: openTicketUser !== null ? `${openTicketUser} Ticket` : (
        <FaSpinner className="animate-spin text-orange-500 mx-auto" />
      ),
      tooltip: "Jumlah tiket yang masih terbuka",
      icon: <FaExclamationCircle className="w-6 h-6 text-orange-500" />,
    },
    {
      title: "Total Purchase Cost",
      value: totalPurchaseCost !== null
        ? `Rp ${(totalPurchaseCost).toLocaleString()}`
        : (
          <FaSpinner className="animate-spin text-orange-500 mx-auto" />
        ),
      tooltip: "Total biaya pembelian asset",
      icon: <FaMoneyBillWave className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {cardData
          .filter((card) => card.title !== "Total Purchase Cost")
          .map((card, index) => (
            <Tooltip.Root key={index}>
              <Tooltip.Trigger asChild>
                <motion.div
                  className={cn(
                    "bg-gradient-to-br from-white to-orange-50/50 p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-orange-100/50 hover:shadow-md transition-all dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 relative overflow-hidden group",
                    font.className
                  )}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Decorative background element */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />

                  {/* Icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-orange-500/10 rounded-lg sm:rounded-xl">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400">
                      {card.icon}
                    </div>
                  </div>

                  {/* Konten Card */}
                  <div className="text-slate-500 text-[9px] sm:text-xs font-black dark:text-slate-400 uppercase tracking-widest mb-1 sm:mb-2 text-left">
                    {card.title === "Total Asset User" ? "Total Aset" : card.title === "Total Ticket Maintenance" ? "Total Tiket" : "Tiket Aktif"}
                  </div>

                  {/* Tampilkan Nilai atau Spinner Jika Masih Loading */}
                  <div className="text-[16px] sm:text-2xl font-black text-slate-900 dark:text-white flex justify-start items-baseline gap-1 tracking-tighter uppercase">
                    {typeof card.value === 'string' && card.value.includes(' ') ? (
                      <>
                        <span>{card.value.split(' ')[0]}</span>
                        <span className="text-[8px] sm:text-xs font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase ml-0.5">
                          {card.value.split(' ')[1]}
                        </span>
                      </>
                    ) : card.value}
                  </div>
                </motion.div>
              </Tooltip.Trigger>
              {card.tooltip && (
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg text-xs shadow-lg"
                    side="top"
                    sideOffset={8}
                  >
                    {card.tooltip}
                    <Tooltip.Arrow className="fill-gray-700" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          ))}
      </div>
    </Tooltip.Provider>
  );
};

export default DashboardCards;
