"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FaSignOutAlt } from 'react-icons/fa';
import { Group, Menu } from '@/lib/menu-list';
import { getMenuList } from '@/lib/menu-list';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import InstallButton from '../demo/installButton';
// import WhatsAppButton from "@/components/whatsappButton"; // Pastikan path ini sesuai

export default function DashboardTechnicianPage() {
  const user = useCurrentUser();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const role = user?.role || 'USER';
  const menuGroups = getMenuList(pathname, role);

  // Daftar nomor WhatsApp
  // const whatsappNumbers = [
  //   { id: 1, label: "Teknisi 1 Parwanto", phone: "6281280212068" },
  //   { id: 2, label: "Teknisi 2 Agung", phone: "6281280660953" }
  // ];

  //   // Fungsi mendapatkan ucapan berdasarkan waktu
  //   const getTimeBasedGreeting = () => {
  //     const hours = new Date().getHours();
  //     if (hours >= 5 && hours < 12) return "Selamat pagi";
  //     if (hours >= 12 && hours < 16) return "Selamat siang";
  //     if (hours >= 16 && hours < 19) return "Selamat sore";
  //     return "Selamat malam";
  //   };

     // Message yang akan dikirim ke WhatsApp, bisa dinamis berdasarkan data
  // const message = `${getTimeBasedGreeting()} - Saya telah membuka ticket maintenance mohon di cek.`;


  // Fungsi logout
  const handleSignOut = () => {
    signOut();
    window.location.href = '/auth/login';
  };

  return (
    <ScrollArea className="h-full w-full relative">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {/* Header Welcome */}
        <div className="flex items-center justify-center p-4 rounded-xl space-y-2 bg-gradient-to-b from-orange-300 to-orange-600 dark:bg-gradient-to-b dark:from-orange-500 dark:to-slate-800 dark:text-white">
          <h2 className="text-1xl text-center font-bold tracking-tight">
            <p>Hi, Welcome back Technician <br /> {user?.name}👋</p>
          </h2>
        </div>

        {/* Install Button */}
        <div className='flex justify-center items-center w-full'>
          <InstallButton />
        </div>

        {/* Konten Utama */}
        <div className="min-h-screen rounded-lg bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-300 dark:to-slate-600 dark:text-black">
          <div className="p-4 text-center">
            <h1 className="text-2xl font-bold">Technician Dashboard</h1>
            <p className="text-sm">Manage your ticket maintenance easily</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-4 p-1">
            {menuGroups.map((group: Group, idx: number) => (
              <div key={idx} className="space-y-4 p-2">
                {group.menus.map((menu: Menu) => (
                  !menu.disabled && (
                    menu.label === 'Sign Out' ? (
                      <button
                        key={menu.label}
                        onClick={handleSignOut}
                        className="flex w-full items-center p-4 bg-orange-500/60 rounded-full shadow-lg hover:bg-orange-500/100 transition duration-300 dark:bg-orange-800 dark:hover:bg-orange-600"
                      >
                        <div className="mr-4">
                          <FaSignOutAlt style={{ fontSize: '30px' }} />
                        </div>
                        <span className="text-lg">{menu.label}</span>
                      </button>
                    ) : (
                      <Link key={menu.href} href={menu.href} className="flex items-center p-4 bg-orange-500/60 rounded-full shadow-lg hover:bg-orange-500/100 transition duration-300 dark:bg-orange-800 dark:text-white dark:hover:bg-orange-600">
                        <div className="mr-4">{menu.icon && <menu.icon style={{ fontSize: '30px' }} />}</div>
                        <span className="text-lg">{menu.label}</span>
                      </Link>
                    )
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button
      <WhatsAppButton numbers={whatsappNumbers} message={message} /> */}
    </ScrollArea>
  );
}
