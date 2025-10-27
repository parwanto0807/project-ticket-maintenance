"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingBackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isChildPage = pathname !== "/dashboard" && pathname.startsWith("/dashboard");
        setIsVisible(isChildPage);
    }, [pathname]);

    const handleBackToDashboard = () => {
        router.push("/dashboard");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="
            fixed z-50 
            bottom-6 right-6
            lg:hidden
            w-14 h-14
            rounded-full
            bg-gradient-to-br from-blue-500 to-purple-600 
            border border-white/30 
            /* Shadow minimalis dan rapat */
            shadow-sm shadow-black/20
            hover:shadow-md hover:shadow-black/30
            text-white
            flex items-center justify-center
            transition-all duration-300
            group
            cursor-pointer
          "
                    onClick={handleBackToDashboard}
                >
                    <Home className="w-6 h-6" />

                    {/* Tooltip */}
                    <div className="
            absolute right-16
            px-3 py-2
            bg-slate-900
            rounded-lg
            text-xs font-medium text-white
            whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            pointer-events-none
            shadow-sm
          ">
                        Back to Dashboard
                        <div className="
              absolute top-1/2 -right-1
              w-2 h-2 bg-slate-900
              transform -translate-y-1/2 rotate-45
            " />
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}