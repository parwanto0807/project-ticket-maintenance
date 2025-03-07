"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface CardItem {
  title: string;
  value: number | string;
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

  // Fungsi untuk mengambil total asset dari API
  const fetchTotalAsset = async (email: string) => {
    try {
      const response = await fetch(`/api/asset/dashboard/${email}`);
      const data = await response.json();
      setTotalAssetUser(data.total || 0);
      setTotalPurchaseCost(data.totalPurchaseCost || 0);
    } catch (error) {
      console.error("Error fetching total assets:", error);
      setTotalAssetUser(0); // Jika error, set default ke 0
      setTotalPurchaseCost(0);
    }
  };

    // Fungsi untuk mengambil total asset dari API
    const fetchTotalTicket = async (email: string) => {
      try {
        const response = await fetch(`/api/ticket/dashboard/${email}`);
        const data = await response.json();
        setTotalTicketUser(data.total || 0);
        setOpenTicketUser(data.open || 0);
      } catch (error) {
        console.error("Error fetching total assets:", error);
        setTotalTicketUser(0); // Jika error, set default ke 0
        setOpenTicketUser(0);
      }
    };

  // Data statis untuk kartu lainnya
  const cardData: CardItem[] = [
    { title: "Total Asset User", value: `${totalAssetUser ?? "Loading..." } Set`},
    { title: "Total Ticket Maintenance", value: `${totalTicketUser ?? " Loading..."} Ticket`},
    { title: "Ticket Open", value: `${openTicketUser ?? " Loading..."} Ticket`},
    { title: "Total Purchase Cost", value: `Rp ${(totalPurchaseCost ?? 0).toLocaleString()}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
        >
          <div className="text-gray-700 text-sm font-semibold dark:text-white">
            {card.title}
          </div>
          <div className="mt-2 text-3xl font-bold text-orange-700 dark:text-white">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
