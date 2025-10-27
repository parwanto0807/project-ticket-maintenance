"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingBackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Check if current page is a child page (not dashboard)
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
            bottom-6 right-6 /* Posisi default bawah kanan */
            lg:hidden /* Hanya tampil di mobile */
            w-14 h-14 /* Ukuran bulat */
            rounded-full /* Bentuk bulat */
            bg-gradient-to-br from-blue-500 to-purple-600 
            backdrop-blur-xl
            border border-white/20 
            shadow-2xl shadow-blue-500/25
            hover:shadow-3xl hover:shadow-blue-500/40
            text-white
            flex items-center justify-center
            transition-all duration-300
            group
            cursor-pointer
          "
                    onClick={handleBackToDashboard}
                >
                    {/* Main Icon dengan animasi */}
                    <motion.div
                        animate={{ rotate: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <Home className="w-6 h-6" />

                        {/* Ping Animation */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-white/20"
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>

                    {/* Tooltip on hover */}
                    <div className="
            absolute right-16
            px-3 py-2
            bg-slate-900/95 backdrop-blur-xl
            rounded-lg
            text-xs font-medium text-white
            whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transform translate-x-2 group-hover:translate-x-0
            transition-all duration-300
            pointer-events-none
            border border-slate-700/50
            shadow-xl
          ">
                        Back to Dashboard
                        {/* Tooltip arrow */}
                        <div className="
              absolute top-1/2 -right-1
              w-2 h-2 bg-slate-900/95
              transform -translate-y-1/2 rotate-45
              border-r border-b border-slate-700/50
            " />
                    </div>

                    {/* Shine Effect */}
                    <div className="
            absolute inset-0 
            bg-gradient-to-r from-transparent via-white/20 to-transparent 
            -skew-x-12 -translate-x-full 
            group-hover:translate-x-full 
            transition-transform duration-1000
            rounded-full
          " />

                    {/* Glow Effect */}
                    <div className="
            absolute inset-0 
            rounded-full 
            bg-blue-500/20 blur-xl 
            -z-10 
            group-hover:bg-blue-500/30 
            transition-all duration-500
          " />
                </motion.button>
            )}
        </AnimatePresence>
    );
}