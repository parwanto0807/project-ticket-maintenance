"use client";

import React from "react";

interface CardItem {
  title: string;
  value: number | string;
}

const DashboardCards = () => {
  // Data statis contoh; nantinya bisa digantikan dengan data dari API
  const cardData: CardItem[] = [
    { title: "Total Asset User", value: 120 },
    { title: "Total Ticket Maintenance", value: 45 },
    { title: "Ticket Open", value: 10 },
    { title: "Total Purchase Asset", value: 75 },
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
          <div className="mt-2 text-3xl font-bold text-orange-700">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
