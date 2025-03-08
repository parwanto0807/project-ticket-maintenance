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
} from "react-icons/fa"; // Ikon untuk card

interface CardItem {
  title: string;
  value: React.ReactNode; // 🔥 Ubah ke React.ReactNode agar bisa menampilkan Spinner
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
      value: totalAssetUser !== null ? `${totalAssetUser} Set` : (
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
      value:
        totalPurchaseCost !== null ? `Rp ${(totalPurchaseCost ?? 0).toLocaleString()}` : (
          <FaSpinner className="animate-spin text-orange-500 mx-auto" />
        ),
      tooltip: "Total biaya pembelian asset",
      icon: <FaMoneyBillWave className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger asChild>
              <motion.div
                className="bg-gradient-to-r from-orange-100 to-orange-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Ikon */}
                <div className="absolute top-4 right-4 opacity-90">{card.icon}</div>

                {/* Konten Card */}
                <div className="text-gray-700 text-sm font-semibold dark:text-white">
                  {card.title}
                </div>

                {/* Tampilkan Nilai atau Spinner Jika Masih Loading */}
                <div className="mt-2 text-3xl font-bold text-orange-700 dark:text-white flex justify-left">
                  {card.value}
                </div>
              </motion.div>
            </Tooltip.Trigger>

            {/* Tooltip Muncul Jika Ada Keterangan */}
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
