"use client";

import React from 'react';
import { UpdateSoftware } from './buttons';
import DeleteAlertSoftware from './alert-delete';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Package,
    Building,
    Calendar,
    Globe,
    FileText,
    Cpu,
    Shield,
    Factory,
    CheckCircle,
    XCircle,
    Monitor
} from 'lucide-react';
import { cn } from "@/lib/utils";

const getCategoryIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
        case 'os':
            return <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        case 'antivirus':
            return <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
        case 'cad':
        case 'erp':
            return <Factory className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
        default:
            return <Monitor className="h-4 w-4 text-slate-500" />;
    }
};

const getLicenseTypeBadge = (licenseType: string | null) => {
    const base = "text-[10px] font-black uppercase tracking-tight px-2 py-0.5 border-none";
    switch (licenseType?.toLowerCase()) {
        case 'subscription':
            return <Badge className={cn(base, "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300")}>Subscription</Badge>;
        case 'proprietary':
            return <Badge className={cn(base, "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300")}>Proprietary</Badge>;
        default:
            return <Badge className={cn(base, "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400")}>{licenseType || 'Unknown'}</Badge>;
    }
};

interface SoftwareTableProps {
    query: string;
    currentPage: number;
    software: any[]; // Using any[] for simplicity as the data is passed from server component
}

export default function SoftwareTable({ software }: { software: any[] }) {
    // Group software by category
    const groupedSoftware = software.reduce((acc: any, item: any) => {
        const category = item.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    // Sort categories alphabetically, but keep 'Uncategorized' at the end
    const sortedCategories = Object.keys(groupedSoftware).sort((a, b) => {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="w-full">
            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {sortedCategories.map((category) => {
                    const items = groupedSoftware[category];
                    return (
                        <div key={category} className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    {category} <span className="ml-1 text-slate-300">({items.length})</span>
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {items.map((item: any) => (
                                    <Card
                                        key={item.id}
                                        className="bg-white/40 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 dark:bg-slate-900/40 dark:border-slate-800 rounded-2xl overflow-hidden group"
                                    >
                                        <CardContent className="p-2.5 sm:p-3">
                                            <div className="space-y-2.5">
                                                {/* Header */}
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                            {getCategoryIcon(item.category)}
                                                        </div>
                                                        <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <UpdateSoftware id={item.id} />
                                                        <DeleteAlertSoftware id={item.id} />
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="grid grid-cols-2 gap-2 py-1.5 px-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                                    <div>
                                                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0">Vendor</span>
                                                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                            {item.vendor || '-'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0">Expiry</span>
                                                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                            {item.defaultExpiry ? `${item.defaultExpiry} mos` : '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[10px]">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold text-slate-400 uppercase tracking-tighter">Type:</span>
                                                        {getLicenseTypeBadge(item.licenseType)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {item.installations?.length > 0 ? (
                                                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                                                <CheckCircle className="h-3 w-3" />
                                                                <span>{item.installations.length} Active</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-slate-400 font-bold">
                                                                <XCircle className="h-3 w-3" />
                                                                <span>Inactive</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {item.website && (
                                                    <a
                                                        href={item.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 hover:underline pt-1 border-t border-slate-100/50 dark:border-slate-800/50"
                                                    >
                                                        <Globe className="h-3 w-3" />
                                                        <span className="truncate">{item.website}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="hidden lg:block">
                <Card className="bg-white/40 backdrop-blur-xl shadow-2xl border border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-800 rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        Software Details
                                    </TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        Vendor & Website
                                    </TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        License Info
                                    </TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        Installs
                                    </TableHead>
                                    <TableHead className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedCategories.map((category) => {
                                    const items = groupedSoftware[category];
                                    return (
                                        <React.Fragment key={category}>
                                            <TableRow className="bg-slate-50/30 dark:bg-slate-800/20 backdrop-blur-sm">
                                                <TableCell colSpan={5} className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                                                        <span className="text-[13px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">{category}</span>
                                                        <Badge variant="outline" className="ml-2 bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 font-bold">
                                                            {items.length} Software
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {items.map((item: any) => (
                                                <TableRow key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-300">
                                                    <TableCell className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                                {getCategoryIcon(item.category)}
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-black text-slate-800 dark:text-white tracking-tight">{item.name}</p>
                                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5 max-w-[200px] line-clamp-1">{item.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50">
                                                        <div className="space-y-1.5 text-[13px]">
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
                                                                <Building className="h-3.5 w-3.5 text-slate-400" />
                                                                {item.vendor || '-'}
                                                            </div>
                                                            {item.website && (
                                                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                                                                    <Globe className="h-3.5 w-3.5" />
                                                                    <span className="truncate max-w-[150px]">{item.website}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50">
                                                        <div className="space-y-1.5">
                                                            {getLicenseTypeBadge(item.licenseType)}
                                                            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {item.defaultExpiry ? `${item.defaultExpiry} mos` : 'No expiry'}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50">
                                                        {item.installations?.length > 0 ? (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[13px]">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                                    {item.installations.length} Active
                                                                </div>
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Installations</span>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-slate-800 font-bold opacity-50">
                                                                Not Installed
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50 text-right">
                                                        <div className="flex justify-end items-center gap-1.5">
                                                            <UpdateSoftware id={item.id} />
                                                            <DeleteAlertSoftware id={item.id} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {software.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                                <Monitor className="h-10 w-10 text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-800 dark:text-white font-black text-lg">No software found</p>
                                <p className="text-slate-400 font-medium text-sm">Try adjusting your search query</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}