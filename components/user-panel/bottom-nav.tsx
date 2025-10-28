import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface Menu {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface BottomNavProps {
  menus: Menu[];
}

export default function BottomNav({ menus }: BottomNavProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Fungsi Logout yang diperbaiki
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSigningOut) return; // Prevent multiple clicks
    
    setIsSigningOut(true);
    
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/auth/login" 
      });
      
      // Redirect manual setelah signOut selesai
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      window.location.href = "/auth/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  // Jika menus kosong, jangan tampilkan apa-apa
  if (!menus || menus.length === 0) {
    return null;
  }

  // Bagi menu menjadi dua grup: ambil item tengah sebagai tombol utama
  const midIndex = Math.floor(menus.length / 2);
  const centerItem = menus[midIndex];
  const leftMenus = menus.slice(0, midIndex);
  const rightMenus = menus.slice(midIndex + 1);

  return (
    <nav className="fixed -bottom-1 left-0 right-0 bg-white border-t border-orange-200 shadow h-20 flex items-center justify-between px-4 dark:bg-gradient-to-t from-slate-800 to-slate-900 dark:text-white dark:border-orange-600">
      {/* Bagian Kiri: Tombol Home + grup kiri */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs">Home</span>
        </Link>
        {leftMenus.map((menu, index) => {
          if (menu.disabled) return null;
          if (menu.label === "Sign Out") {
            return (
              <button
                key={index}
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {menu.icon ? (
                  <menu.icon className="text-2xl" />
                ) : (
                  <FaSignOutAlt className="text-2xl" />
                )}
                <span className="text-xs">{menu.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={index}
              href={menu.href}
              className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200"
            >
              {menu.icon && <menu.icon className="text-2xl" />}
              <span className="text-xs">{menu.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Tombol Tengah (Floating Button) */}
      <div className="relative">
        {centerItem && (
          <Link
            href={centerItem.href}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 shadow -translate-y-6 hover:scale-105 transition-transform duration-200"
          >
            {centerItem.icon ? (
              <centerItem.icon className="text-2xl" />
            ) : (
              <span className="text-sm font-bold">{centerItem.label}</span>
            )}
          </Link>
        )}
      </div>

      {/* Bagian Kanan: Grup kanan + Tombol Sign Out */}
      <div className="flex items-center gap-4">
        {rightMenus.map((menu, index) => {
          if (menu.disabled) return null;
          if (menu.label === "Sign Out") {
            return (
              <button
                key={index}
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {menu.icon ? (
                  <menu.icon className="text-2xl" />
                ) : (
                  <FaSignOutAlt className="text-2xl" />
                )}
                <span className="text-xs">{menu.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={index}
              href={menu.href}
              className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200"
            >
              {menu.icon && <menu.icon className="text-2xl" />}
              <span className="text-xs">{menu.label}</span>
            </Link>
          );
        })}
        
        {/* Tombol Sign Out tambahan */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex flex-col items-center justify-center text-orange-600 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSignOutAlt className="text-2xl" />
          <span className="text-xs">Sign Out</span>
          {isSigningOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}