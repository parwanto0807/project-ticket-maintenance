"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn, generatePagination } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: string | number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }
    const allPages = generatePagination(currentPage, totalPages);

    const PaginationNumber = ({
        page,
        href,
        position,
        isActive
    }: {
        page: number | string;
        href: string;
        position?: "first" | "last" | "middle" | "single";
        isActive: boolean;
    }) => {
        const baseStyles = "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border text-[12px] sm:text-[13px] font-bold transition-all duration-300 shadow-sm";
        const activeStyles = "z-10 bg-gradient-to-tr from-blue-600 to-indigo-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105 sm:scale-110";
        const inactiveStyles = "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105";
        const middleStyles = "text-slate-400 dark:text-slate-500 border-none bg-transparent shadow-none cursor-default";

        const className = cn(
            baseStyles,
            isActive ? activeStyles : (position === "middle" ? middleStyles : inactiveStyles)
        );

        if (position === "middle") {
            return <div className={className}>{page}</div>;
        }

        return (
            <Link href={href} className={className}>
                {page}
            </Link>
        );
    };

    const PaginationArrow = ({
        href,
        direction,
        isDisabled,
    }: {
        href: string;
        direction: "left" | "right";
        isDisabled?: boolean;
    }) => {
        const baseStyles = "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-300 shadow-sm";
        const enabledStyles = "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 active:scale-95";
        const disabledStyles = "bg-slate-100/30 dark:bg-slate-800/10 border-slate-100/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50";

        const className = cn(
            baseStyles,
            isDisabled ? disabledStyles : enabledStyles,
            direction === "left" ? "mr-1.5 sm:mr-3" : "ml-1.5 sm:ml-3"
        );

        const icon = direction === "left" ? (
            <ChevronLeft className="h-5 w-5" />
        ) : (
            <ChevronRight className="h-5 w-5" />
        )

        if (isDisabled) {
            return <div className={className}>{icon}</div>;
        }

        return (
            <Link href={href} className={className}>
                {icon}
            </Link>
        );
    };

    if (totalPages <= 1) return null;

    return (
        <div className={cn("inline-flex items-center gap-1 sm:gap-1.5 py-2.5 sm:py-4 px-3 sm:px-6 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/30 dark:border-slate-800/30 shadow-xl", font.className)}>
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <div className="flex items-center gap-1.5">
                {allPages.map((page, index) => {
                    let position: "first" | "last" | "single" | "middle" | undefined;

                    if (index === 0) position = "first";
                    if (index === allPages.length - 1) position = "last";
                    if (allPages.length === 1) position = "single";
                    if (page === "...") position = "middle";

                    return (
                        <PaginationNumber
                            key={index}
                            href={createPageURL(page)}
                            page={page}
                            position={position}
                            isActive={currentPage === page}
                        />
                    )
                })}
            </div>

            <PaginationArrow
                direction="right"
                href={createPageURL(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
            />
        </div>
    )
}