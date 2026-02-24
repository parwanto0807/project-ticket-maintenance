import Link from "next/link";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false, callbackUrl: "/auth/login" });
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/auth/login";
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!menus || menus.length === 0) return null;

  const midIndex = Math.floor(menus.length / 2);
  const centerItem = menus[midIndex];
  const leftMenus = menus.slice(0, midIndex);
  const rightMenus = menus.slice(midIndex + 1);

  const NavItem = ({ menu, isSignOut = false }: { menu: Menu; isSignOut?: boolean }) => {
    const isActive = pathname === menu.href;
    const Icon = menu.icon || (isSignOut ? FaSignOutAlt : FaHome);

    return (
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="flex-1 flex justify-center"
      >
        {isSignOut ? (
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={cn(
              "relative flex flex-col items-center gap-1 py-1 transition-all duration-300",
              isSigningOut ? "opacity-50" : "opacity-100"
            )}
          >
            <div className="relative">
              <Icon className="text-[18px] text-slate-500" />
              {isSigningOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">
              Logout
            </span>
          </button>
        ) : (
          <Link
            href={menu.href}
            className={cn(
              "relative flex flex-col items-center gap-1 py-1 transition-all duration-300",
              isActive ? "text-blue-600" : "text-slate-500"
            )}
          >
            <Icon className={cn("text-[20px]", isActive ? "text-blue-600" : "text-slate-400")} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-tighter",
              isActive ? "text-blue-700" : "text-slate-500"
            )}>
              {menu.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none md:hidden">
      <nav className="w-full h-16 flex items-center justify-between pointer-events-auto
        bg-white/95 dark:bg-slate-900/98 backdrop-blur-xl
        border-t border-slate-200/50 dark:border-slate-800/50 
        shadow-[0_-1px_12px_rgba(0,0,0,0.05)] overflow-visible px-2">

        {/* Left Section */}
        <div className="flex-1 flex items-center justify-around">
          <NavItem menu={{ label: "Home", href: "/dashboard", icon: FaHome }} />
          {leftMenus.map((menu, i) => !menu.disabled && <NavItem key={i} menu={menu} />)}
        </div>

        {/* Center Button - Increased width for wider gap */}
        <div className="relative flex justify-center w-24 overflow-visible">
          {centerItem && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -top-7"
            >
              <Link
                href={centerItem.href}
                className="flex items-center justify-center w-14 h-14 rounded-2xl
                  bg-gradient-to-br from-orange-500 to-amber-600 
                  shadow-[0_8px_20px_-4px_rgba(249,115,22,0.4)] 
                  border-2 border-white/50 dark:border-slate-800/50
                  text-white relative z-10"
              >
                {centerItem.icon ? (
                  <centerItem.icon className="text-2xl drop-shadow-sm" />
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-tighter">{centerItem.label}</span>
                )}
              </Link>
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full -z-10 animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-around">
          {rightMenus.map((menu, i) => !menu.disabled && <NavItem key={i} menu={menu} />)}
          <NavItem menu={{ label: "Sign Out", href: "#" }} isSignOut />
        </div>
      </nav>
    </div>
  );
}