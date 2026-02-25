"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MasterPageHeaderProps {
    titleKey: TranslationKeys;
    descKey: TranslationKeys;
    breadcrumbKeys: { labelKey: TranslationKeys; href?: string }[];
    icon: LucideIcon;
}

export function MasterPageHeader({
    titleKey,
    descKey,
    breadcrumbKeys,
    icon: Icon
}: MasterPageHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-1">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbKeys.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                {item.href ? (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={item.href}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            {t(item.labelKey)}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage className="font-bold text-slate-800 dark:text-slate-200">
                                        {t(item.labelKey)}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbKeys.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-2 text-left">
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    {t(titleKey)}
                </h1>
                <p className="text-[12px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 max-w-2xl line-clamp-2 sm:line-clamp-none">
                    {t(descKey)}
                </p>
            </div>
        </div>
    );
}

import React from "react";
