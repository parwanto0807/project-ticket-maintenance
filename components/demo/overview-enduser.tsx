"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FaSignOutAlt, FaWhatsappSquare } from 'react-icons/fa';
import { Group, Menu } from '@/lib/menu-list';
import { getMenuList } from '@/lib/menu-list';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import InstallButton from './installButton';

export default function DashboardOverviewPage() {
  const user = useCurrentUser();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const role = user?.role || 'USER';
  const menuGroups = getMenuList(pathname, role);

  // Fungsi untuk mendapatkan ucapan berdasarkan waktu
  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Selamat pagi";
    if (hours >= 12 && hours < 16) return "Selamat siang";
    if (hours >= 16 && hours < 19) return "Selamat sore";
    return "Selamat malam";
  };

  const whatsappNumber = "6281280212068"; // Ganti dengan nomor WhatsApp tujuan
  const message = `${getTimeBasedGreeting()} - Saya telah membuka ticket maintenance mohon di cek`;
  const encodedMessage = encodeURIComponent(message);

  // Fungsi untuk membuka WhatsApp dengan deteksi otomatis
  const openWhatsApp = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    
    if (isDesktop) {
      // Coba buka di WhatsApp Desktop
      const desktopWhatsApp = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
      window.location.href = desktopWhatsApp;

      // Jika gagal, fallback ke WhatsApp Web setelah 1 detik
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
      }, 1000);
    } else {
      // Mobile langsung buka WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    }
  };

  // Fungsi logout
  const handleSignOut = () => {
    signOut();
    window.location.href = '/auth/login';
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-center p-4 rounded-xl space-y-2 bg-gradient-to-b from-orange-300 to-orange-600 dark:bg-gradient-to-b dark:from-orange-500 dark:to-slate-800 dark:text-white">
          <h2 className="text-1xl text-center font-bold tracking-tight">
            <p>Hi, Welcome back <br /> {user?.name}👋</p>
          </h2>
        </div>
        <div className='flex justify-center items-center w-full'>
          <InstallButton />
        </div>

        <div className="min-h-screen rounded-lg bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-300 dark:to-slate-600 dark:text-black">
          {/* Header */}
          <div className="p-4 text-center">
            <h1 className="text-2xl font-bold">Ticket Maintenance</h1>
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

      {/* WhatsApp Floating Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500/80 text-white shadow-lg cursor-pointer hover:bg-green-500/100 transition"
      >
        <FaWhatsappSquare size={40} />
      </button>
    </ScrollArea>
  );
}
