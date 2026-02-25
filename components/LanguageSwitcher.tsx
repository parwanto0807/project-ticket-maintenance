"use client";

import { useLanguageStore } from "@/hooks/use-language-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center bg-muted/50 rounded-full p-1 border shadow-sm">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage('ID')}
                className={cn(
                    "h-7 px-3 rounded-full text-[10px] font-black transition-all duration-300",
                    language === 'ID'
                        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                ID
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage('EN')}
                className={cn(
                    "h-7 px-3 rounded-full text-[10px] font-black transition-all duration-300",
                    language === 'EN'
                        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                EN
            </Button>
        </div>
    );
}
