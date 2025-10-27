"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Home, Grip } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface Position {
    x: number;
    y: number;
}

export default function FloatingBackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 24, y: 24 });
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(true);

    // 🧩 FIX — gunakan "useLayoutEffect" agar dijalankan sebelum paint
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const isChildPage = pathname !== "/dashboard" && pathname.startsWith("/dashboard");
        setIsVisible(isChildPage);
    }, [pathname]);

    // Load saved position from localStorage
    useEffect(() => {
        const savedPosition = localStorage.getItem("floating-button-position");
        if (savedPosition) {
            try {
                setPosition(JSON.parse(savedPosition));
            } catch {
                console.warn("Failed to parse saved button position");
            }
        }
    }, []);

    const savePosition = useCallback((newPosition: Position) => {
        localStorage.setItem("floating-button-position", JSON.stringify(newPosition));
    }, []);

    const handleBackToDashboard = () => {
        if (!isDragging) {
            router.push("/dashboard");
        }
    };

    const handleDragStart = () => setIsDragging(true);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        setIsDragging(false);

        const newPosition = {
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
        };

        const constrainedPosition = {
            x: Math.max(16, Math.min(window.innerWidth - 72, newPosition.x)),
            y: Math.max(16, Math.min(window.innerHeight - 72, newPosition.y)),
        };

        setPosition(constrainedPosition);
        savePosition(constrainedPosition);
    };

    const handleDrag = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const newX = Math.max(16, Math.min(window.innerWidth - 72, position.x + info.delta.x));
        const newY = Math.max(16, Math.min(window.innerHeight - 72, position.y + info.delta.y));
        setPosition({ x: newX, y: newY });
    };

    // 🧩 FIX — pastikan tombol muncul (z tinggi dan pointer aktif)
    if (!isMobile) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        key="desktop-back-button"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                            fixed z-[9999]
                            top-6 right-6
                            w-12 h-12
                            rounded-xl
                            bg-gradient-to-br from-slate-800 to-slate-900
                            border border-slate-700/50
                            shadow-lg shadow-black/30
                            hover:shadow-xl hover:shadow-black/40
                            text-white flex items-center justify-center
                            transition-all duration-300
                            group
                            backdrop-blur-sm
                            cursor-pointer
                        " // 🧩 FIX — ubah dari `lg:flex hidden` agar tidak tersembunyi
                        onClick={handleBackToDashboard}
                    >
                        <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />

                        <div
                            className="
                                absolute right-14
                                px-3 py-2
                                bg-slate-900/95
                                backdrop-blur-sm
                                rounded-xl
                                text-xs font-medium text-white
                                whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300
                                pointer-events-none
                                shadow-lg
                                border border-slate-700/50
                            "
                        >
                            Back to Dashboard
                            <div
                                className="
                                    absolute top-1/2 -right-1
                                    w-2 h-2 bg-slate-900/95
                                    transform -translate-y-1/2 rotate-45
                                "
                            />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        );
    }

    // 🧩 FIX — versi mobile
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="mobile-back-button"
                    className="fixed z-[9999] lg:hidden cursor-grab active:cursor-grabbing"
                    // 🧩 gunakan `style={{ top, left }}` agar benar-benar di posisi yang diinginkan
                    style={{
                        top: position.y,
                        left: position.x,
                    }}
                    drag
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="
                            relative
                            w-14 h-14
                            rounded-2xl
                            bg-gradient-to-br from-slate-800 to-slate-900
                            border border-slate-700/50
                            shadow-lg shadow-black/30
                            hover:shadow-xl hover:shadow-black/40
                            text-white
                            flex items-center justify-center
                            transition-all duration-300
                            group
                            backdrop-blur-sm
                            cursor-pointer
                        "
                        onClick={handleBackToDashboard}
                    >
                        <motion.div
                            className="
                                absolute -top-1 -right-1
                                w-4 h-4
                                rounded-full
                                bg-blue-500
                                flex items-center justify-center
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-300
                                cursor-grab
                            "
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Grip className="w-2 h-2 text-white" />
                        </motion.div>

                        <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />

                        <div
                            className="
                                absolute inset-0
                                rounded-2xl
                                bg-gradient-to-br from-blue-500/20 to-purple-500/20
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-300
                            "
                        />

                        <div
                            className="
                                absolute right-16
                                px-3 py-2
                                bg-slate-900/95
                                backdrop-blur-sm
                                rounded-xl
                                text-xs font-medium text-white
                                whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                transition-all duration-300
                                pointer-events-none
                                shadow-lg
                                border border-slate-700/50
                            "
                        >
                            Back to Dashboard
                            <div
                                className="
                                    absolute top-1/2 -right-1
                                    w-2 h-2 bg-slate-900/95
                                    transform -translate-y-1/2 rotate-45
                                "
                            />
                        </div>

                        <div
                            className="
                                absolute inset-0
                                rounded-2xl
                                bg-gradient-to-br from-blue-500 to-purple-600
                                opacity-0
                                animate-pulse
                                group-hover:opacity-20
                                transition-opacity duration-300
                            "
                        />
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="
                            absolute top-full left-1/2
                            mt-2
                            px-2 py-1
                            bg-slate-800/90
                            backdrop-blur-sm
                            rounded-lg
                            text-xs text-slate-300
                            whitespace-nowrap
                            transform -translate-x-1/2
                            pointer-events-none
                            border border-slate-700/50
                            shadow-lg
                        "
                    >
                        Drag to move
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
