"use client"

import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { generatePagination } from "@/lib/utils";

export default function Pagination ({totalPages}: {totalPages: number}) {
    const pathname = usePathname();
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber : string | number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }
    const allPages  = generatePagination(currentPage, totalPages);

    const PaginationNumber = ({
        page,
        href,
        position,
        isActive
    }:{
        page: number | string;
        href: string;
        position?: "first" | "last" | "middle" | "single";
        isActive: boolean;
    }) => {
        const className = clsx("flex h-9 w-9 items-center justify-center rounded-md border text-[11px]",
        {
            "rounded-l-sm" : position ==="first" || position === "single",
            "rounded-r-sm" : position ==="last" || position === "single",
            "z-0 bg-blue-800 border-blue-500 text-white" : isActive,
            "hover:bg-gray-800": !isActive && position !=="middle",
            "text-gray-300 pointer-event-none": position === "middle" 
    });
    return isActive && position === "middle" ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>{page}</Link>
        );
    };

    const PaginationArrow = ({
        href,
        direction,
        isDisabled,
    }:{
        href: string;
        direction: "left" | "right";
        isDisabled?: boolean;
    }) => {
        const className = clsx("flex h-9 w-9 items-center justify-center rounded-md border",
        {
            "pointer-events-none text-gray-300 bg-gray-900": isDisabled,
            "bg-blue-900 hover:bg-blue-700" : !isDisabled,
            "mr-2": direction ==="left",
            "ml-2": direction ==="right"
        }
        );
        const icon = direction ==="left" ? (
            <ChevronLeftIcon fontSize="small"/>
        ): (
            <ChevronRightIcon fontSize="small"/>
        )

        return isDisabled ? (
            <div className={className}> {icon} </div>
        ) : (
            <Link href={href} className={className}> {icon}</Link>
        );
    };

    return(
        <div className="inline-flex mb-20">
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />
            
            <div className="flex -space-x-px">
                {allPages.map((page, index)=> {
                    let position: "first" | "last" | "single" | "middle" | undefined;

                    if(index === 0) position = "first";
                    if(index === allPages.length -1) position = "last";
                    if(allPages.length === 1) position = "single";
                    if(page === "...") position = "middle";

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