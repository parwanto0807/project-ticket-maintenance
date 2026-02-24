// components/auth/header.tsx
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { ReactNode } from "react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface HeaderProps {
    label: string | ReactNode; // Ubah ini
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <p className="text-slate-400 text-sm font-medium">
                {typeof label === 'string' ? label : label}
            </p>
        </div>
    );
};