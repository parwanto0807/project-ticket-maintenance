"use client";

import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PWAInstallButton = () => {
    const { isInstallable, handleInstallClick } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
        };
        setIsMobile(checkMobile());

        // Show after a short delay if installable
        if (isInstallable) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isInstallable]);

    if (!isMobile || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900 p-4 flex items-center justify-between gap-4 overflow-hidden relative group">
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Download className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                    Install Aplikasi
                                </h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    Akses lebih cepat & mudah dari Homescreen
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 relative z-10">
                            <Button
                                onClick={handleInstallClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg h-9 shadow-md transition-all active:scale-95"
                            >
                                Install
                            </Button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallButton;
