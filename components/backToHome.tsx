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
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // ✅ Hitung posisi default dari kanan bawah
  useEffect(() => {
    const updatePosition = () => {
      setIsMobile(window.innerWidth < 1024);

      // default posisi kanan bawah (24px dari sisi kanan dan bawah)
      setPosition({
        x: window.innerWidth - 88, // w-14 (56px) + 24px padding + margin buffer
        y: window.innerHeight - 88,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  useEffect(() => {
    const isChildPage = pathname !== "/dashboard" && pathname.startsWith("/dashboard");
    setIsVisible(isChildPage);
  }, [pathname]);

  // 🔄 Load posisi tersimpan
  useEffect(() => {
    const saved = localStorage.getItem("floating-button-position");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } catch {
        console.warn("Failed to parse saved position");
      }
    }
  }, []);

  const savePosition = useCallback((newPos: Position) => {
    localStorage.setItem("floating-button-position", JSON.stringify(newPos));
  }, []);

  const handleBackToDashboard = () => {
    if (!isDragging) router.push("/dashboard");
  };

  const handleDragStart = () => setIsDragging(true);

  // ✅ Batasi pergerakan tombol agar tidak liar
  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setPosition((prev) => {
      const newX = Math.max(16, Math.min(window.innerWidth - 72, prev.x + info.delta.x * 0.8)); // 0.8 untuk stabilitas
      const newY = Math.max(16, Math.min(window.innerHeight - 72, prev.y + info.delta.y * 0.8));
      return { x: newX, y: newY };
    });
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    setPosition((prev) => {
      const newPos = {
        x: Math.max(16, Math.min(window.innerWidth - 72, prev.x + info.offset.x * 0.8)),
        y: Math.max(16, Math.min(window.innerHeight - 72, prev.y + info.offset.y * 0.8)),
      };
      savePosition(newPos);
      return newPos;
    });
  };

  // 💻 Desktop (tanpa drag)
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
              bottom-6 right-6
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
            "
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

  // 📱 Mobile (dragable)
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="mobile-back-button"
          className="fixed z-[9999] lg:hidden cursor-grab active:cursor-grabbing"
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

          {/* Tooltip pertama kali */}
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
