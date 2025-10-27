// components/auth/header.tsx
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { ReactNode } from "react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label: string | ReactNode; // Ubah ini
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <div className="flex items-center gap-x-2">
                <div className="p-2 bg-green-500/20 rounded-xl border border-green-400/80">
                    <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h1 className={cn(
                    "text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent",
                    font.className
                )}>
                    AssetFlow
                </h1>
            </div>
            <div className="text-blue-200 text-sm text-center">
                {typeof label === 'string' ? label : label}
            </div>
        </div>
    );
};