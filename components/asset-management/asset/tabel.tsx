"use client";

import React from "react";
import { PrintAssetButton, UpdateAssetLink } from "./buttons";
import DeleteAlertProduct from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrencyQtt } from "@/lib/utils";
import ImageDialog from "./imageDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrinterIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetDetailSheet } from "./detailSheet";
import { AssetFilters } from "./asset-filters";
import { calculateAssetDepreciation } from "@/lib/finance";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MaintenanceHistoryDialog } from "./maintenance-history-dialog";
import { ITEMS_PER_PAGE_ASSET_ADMIN } from "@/lib/constants";

export default function AssetTable({
    assets,
    assetsGeneral,
    loading,
    query,
    currentPage,
    assetType,
    userName,
    department,
    status,
    location,
    software,
}: {
    assets: any[];
    assetsGeneral: any[];
    loading: boolean;
    query: string;
    currentPage: number;
    assetType?: string;
    userName?: string;
    department?: string;
    status?: string;
    location?: string;
    software?: string;
}) {
    if (loading) {
        return <div className="py-20 text-center font-medium text-slate-500">Loading assets...</div>;
    }

    if (!assets || assets.length === 0) {
        return <div className="py-20 text-center font-medium text-slate-500">No assets found.</div>;
    }

    // Pastikan assetsGeneral adalah array
    const assetsData = Array.isArray(assetsGeneral) ? assetsGeneral : [];

    // Hitung statistik dari assetsGeneral
    const totalAssets = assetsData.length;
    const totalAssetValue = assetsData.reduce((sum: number, asset: any) => sum + Number(asset.purchaseCost || 0), 0);

    // Hitung kategori aset unik
    const assetCategories = [...new Set(assetsData.map(asset => asset.assetType?.name).filter(Boolean))];
    const totalCategories = assetCategories.length;

    // Hitung status aset
    const statusCount = assetsData.reduce((acc: any, asset: any) => {
        const status = asset.status?.toLowerCase() || 'unknown';
        if (status.includes('active') || status.includes('use')) acc.inUse++;
        else if (status.includes('available') || status.includes('ready')) acc.available++;
        else if (status.includes('maintenance') || status.includes('broken') || status.includes('repair')) acc.maintenance++;
        else acc.other++;
        return acc;
    }, { inUse: 0, available: 0, maintenance: 0, other: 0 });

    // Hitung total software installations
    const totalSoftwareInstallations = assetsData.reduce((total: number, asset: any) => {
        return total + (asset.softwareInstallations?.length || 0);
    }, 0);

    // Hitung software installations untuk data yang difilter (dengan query)
    const assetsWithSoftwareCount = assets.map(asset => ({
        ...asset,
        softwareCount: asset.softwareInstallations?.length || 0
    }));

    // Group data by department untuk data yang difilter
    const groupedData = assetsWithSoftwareCount.reduce((acc: Record<string, any[]>, item: any) => {
        const deptName = item.department?.dept_name || "Unassigned";
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(item);
        return acc;
    }, {} as Record<string, any[]>);

    // Data untuk dropdown filters - Filter out undefined/null values
    const assetTypes = [...new Set(assetsData.map(asset => asset.assetType?.name).filter(Boolean))] as string[];
    const userNames = [...new Set(assetsData.map(asset => asset.employee?.name).filter(Boolean))] as string[];
    const departments = [...new Set(assetsData.map(asset => asset.department?.dept_name).filter(Boolean))] as string[];
    const statuses = [...new Set(assetsData.map(asset => asset.status).filter(Boolean))] as string[];
    const locations = [...new Set(assetsData.map(asset => asset.location).filter(Boolean))] as string[];

    // Statistik card data
    const statsCards = [
        {
            title: "🏷️ Total Aset",
            value: totalAssets.toString(),
            description: "Jumlah seluruh aset terdaftar",
            gradient: "from-blue-50 to-blue-100 border-blue-200",
            darkGradient: "from-blue-900/20 to-blue-800/20 border-blue-800",
            textColor: "text-blue-700 dark:text-blue-300",
            valueColor: "text-blue-900 dark:text-blue-100",
            icon: "📊"
        },
        {
            title: "💰 Total Nilai Aset",
            value: formatCurrencyQtt(totalAssetValue),
            description: "Penjumlahan semua harga aset",
            gradient: "from-green-50 to-green-100 border-green-200",
            darkGradient: "from-green-900/20 to-green-800/20 border-green-800",
            textColor: "text-green-700 dark:text-green-300",
            valueColor: "text-green-900 dark:text-green-100",
            icon: "💵"
        },
        {
            title: "🧩 Jumlah Kategori",
            value: `${totalCategories} ${assetCategories.length > 0 ? `(${assetCategories.slice(0, 3).join(', ')})` : ''}`,
            description: "Berdasarkan jenis aset",
            gradient: "from-purple-50 to-purple-100 border-purple-200",
            darkGradient: "from-purple-900/20 to-purple-800/20 border-purple-800",
            textColor: "text-purple-700 dark:text-purple-300",
            valueColor: "text-purple-900 dark:text-purple-100",
            icon: "📂"
        },
        {
            title: "🟢 In Use",
            value: statusCount.inUse.toString(),
            description: "Aset yang sedang digunakan",
            gradient: "from-emerald-50 to-emerald-100 border-emerald-200",
            darkGradient: "from-emerald-900/20 to-emerald-800/20 border-emerald-800",
            textColor: "text-emerald-700 dark:text-emerald-300",
            valueColor: "text-emerald-900 dark:text-emerald-100",
            icon: "✅"
        },
        {
            title: "🟡 Available",
            value: statusCount.available.toString(),
            description: "Aset yang siap digunakan",
            gradient: "from-amber-50 to-amber-100 border-amber-200",
            darkGradient: "from-amber-900/20 to-amber-800/20 border-amber-800",
            textColor: "text-amber-700 dark:text-amber-300",
            valueColor: "text-amber-900 dark:text-amber-100",
            icon: "🟡"
        },
        {
            title: "🔴 Maintenance / Broken",
            value: statusCount.maintenance.toString(),
            description: "Aset dalam perbaikan atau rusak",
            gradient: "from-red-50 to-red-100 border-red-200",
            darkGradient: "from-red-900/20 to-red-800/20 border-red-800",
            textColor: "text-red-700 dark:text-red-300",
            valueColor: "text-red-900 dark:text-red-100",
            icon: "🔧"
        },
        {
            title: "🧰 Total Software Terpasang",
            value: totalSoftwareInstallations.toString(),
            description: "Jumlah total software yang ter-install di semua aset",
            gradient: "from-indigo-50 to-indigo-100 border-indigo-200",
            darkGradient: "from-indigo-900/20 to-indigo-800/20 border-indigo-800",
            textColor: "text-indigo-700 dark:text-indigo-300",
            valueColor: "text-indigo-900 dark:text-indigo-100",
            icon: "💻"
        }
    ];

    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'default';
            case 'inactive': return 'secondary';
            case 'maintenance': return 'destructive';
            case 'retired': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <div className="flow-root space-y-6">
            {/* Statistik lengkap — accordion */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="asset-overview" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <span className="font-inter text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Statistik lengkap
                        </span>
                        <Badge variant="outline" className="ml-2 font-inter text-[10px] font-medium">
                            Semua metrik
                        </Badge>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsCards.map((card, index) => (
                                <Card
                                    key={index}
                                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 shadow-sm"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-inter text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 truncate">
                                                    {card.title}
                                                </p>
                                                <p className="font-inter text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                                                    {card.value}
                                                </p>
                                                <p className="font-inter text-[10px] text-slate-500 dark:text-slate-500 truncate mt-0.5">
                                                    {card.description}
                                                </p>
                                            </div>
                                            <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700/50 flex items-center justify-center shrink-0 ml-2">
                                                <span className="text-base">{card.icon}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-inter text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                📋 Status Distribution
                                            </p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>In Use:</span>
                                                    <span className="font-asset-num font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                        {statusCount.inUse} ({totalAssets > 0 ? Math.round((statusCount.inUse / totalAssets) * 100) : 0}%)
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>Available:</span>
                                                    <span className="font-asset-num font-medium text-amber-600 dark:text-amber-400 tabular-nums">
                                                        {statusCount.available} ({totalAssets > 0 ? Math.round((statusCount.available / totalAssets) * 100) : 0}%)
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>Maintenance:</span>
                                                    <span className="font-asset-num font-medium text-red-600 dark:text-red-400 tabular-nums">
                                                        {statusCount.maintenance} ({totalAssets > 0 ? Math.round((statusCount.maintenance / totalAssets) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">📊</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-inter text-[12px] font-semibold text-cyan-700 dark:text-cyan-300 mb-2">
                                                💾 Software Distribution
                                            </p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>Total Software:</span>
                                                    <span className="font-asset-num font-medium text-cyan-600 dark:text-cyan-400 tabular-nums">
                                                        {totalSoftwareInstallations}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>Assets with Software:</span>
                                                    <span className="font-asset-num font-medium text-cyan-600 dark:text-cyan-400 tabular-nums">
                                                        {assetsData.filter(asset => (asset.softwareInstallations?.length || 0) > 0).length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-inter text-[11px]">
                                                    <span>Avg per Asset:</span>
                                                    <span className="font-asset-num font-medium text-cyan-600 dark:text-cyan-400 tabular-nums">
                                                        {totalAssets > 0 ? (totalSoftwareInstallations / totalAssets).toFixed(1) : 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">💻</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Filter */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                <AssetFilters
                    assetTypes={assetTypes}
                    userNames={userNames}
                    departments={departments}
                    statuses={statuses}
                    locations={locations}
                />
            </section>

            {/* Daftar Aset — Tabel */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="font-inter text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Daftar Aset
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Menampilkan halaman {currentPage} — {assetsWithSoftwareCount.length} aset
                    </p>
                </div>
                <div className="w-full">
                    <TooltipProvider delayDuration={0}>
                        {/* Mobile View */}
                        <div className="lg:hidden p-4 space-y-4">
                            {assetsWithSoftwareCount.map((data) => (
                                <Card key={data.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="p-4 space-y-4">
                                            {/* Baris 1: No. Aset (utama) + Status */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-14 h-14 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 shrink-0">
                                                        <ImageDialog src={data.assetImage1 || "/noImage.jpg"} alt={data.assetNumber} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-inter text-sm font-semibold text-slate-900 dark:text-white truncate">#{data.assetNumber}</div>
                                                        <div className="font-inter text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">{data.assetType.name}</div>
                                                    </div>
                                                </div>
                                                <Badge variant={getStatusVariant(data.status)} className="font-inter shrink-0 rounded-md px-2 py-0.5 font-medium text-[10px] uppercase">
                                                    {data.status}
                                                </Badge>
                                            </div>
                                            {/* Baris 2: Nama produk */}
                                            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-700/50">
                                                <div className="font-inter font-medium text-[12px] text-slate-900 dark:text-white line-clamp-1">
                                                    {data.product.part_name}
                                                </div>
                                                <div className="font-inter text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Part: {data.product.part_number}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 items-center">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs opacity-60">👤</span>
                                                        <span className="font-inter text-[12px] font-normal text-slate-700 dark:text-slate-300 truncate">{data.employee?.name || 'Unassigned'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs opacity-60">📍</span>
                                                        <span className="font-inter text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate tracking-tight">{data.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center border-l dark:border-slate-800 pl-3">
                                                    {(() => {
                                                        const dep = calculateAssetDepreciation(
                                                            data.purchaseCost,
                                                            data.purchaseDate,
                                                            data.usefulLife,
                                                            data.residualValue
                                                        );
                                                        return (
                                                            <>
                                                                <div className="font-asset-num text-[12px] text-blue-600 dark:text-blue-400 leading-none flex items-center gap-1 tabular-nums">
                                                                    {formatCurrencyQtt(dep.bookValue)}
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${dep.percentRemaining > 50 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : dep.percentRemaining > 20 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                                </div>
                                                                <div className="font-asset-num text-[11px] text-slate-400 uppercase mt-1 text-right tracking-tight tabular-nums">
                                                                    {dep.percentRemaining.toFixed(0)}% Health
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="font-inter text-[10px] font-medium px-2 py-0.5 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                                        {data.softwareCount} Software
                                                    </Badge>
                                                    <MaintenanceHistoryDialog
                                                        tickets={data.tickets || []}
                                                        assetNumber={data.assetNumber}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div>
                                                                <AssetDetailSheet asset={data} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Lihat Detail Aset</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={`/dashboard/asset/asset-software/create/${data.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-8 h-8 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-600 transition-all duration-200 group p-0"
                                                                >
                                                                    <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Pasang Software</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div>
                                                                <UpdateAssetLink id={data.id} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ubah Aset</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div>
                                                                <DeleteAlertProduct id={data.id} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Hapus Aset</TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={`/dashboard/asset/generate-pdf/${data.id}`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                >
                                                                    <PrinterIcon className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Cetak PDF</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Desktop View - Fixed table without overflow */}
                        <div className="hidden lg:block overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900">
                                        <TableHead className="font-inter w-12 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 text-center uppercase text-[12px] tracking-widest whitespace-nowrap">
                                            #
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest whitespace-nowrap">
                                            Asset Info
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest whitespace-nowrap">
                                            Product Details
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest whitespace-nowrap">
                                            Assignment
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest text-center whitespace-nowrap">
                                            Financial
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest text-center whitespace-nowrap">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 uppercase text-[12px] tracking-widest text-center whitespace-nowrap">
                                            Maintenance
                                        </TableHead>
                                        <TableHead className="font-inter text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 py-5 text-center uppercase text-[12px] tracking-widest whitespace-nowrap">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(groupedData).map(([deptName, items]: [string, any[]]) => (
                                        <React.Fragment key={deptName}>
                                            {/* Department Header */}
                                            <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30">
                                                <TableCell
                                                    colSpan={14}
                                                    className="font-inter font-bold text-[15px] text-blue-900 dark:text-blue-100 py-3 px-6 border-b border-blue-200 dark:border-blue-700"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                                        <span>🏢 {deptName}</span>
                                                        <Badge variant="secondary" className="font-inter ml-2 bg-blue-500 text-white text-[10px] font-medium">
                                                            {items.length} assets
                                                        </Badge>
                                                        <Badge variant="outline" className="font-inter ml-2 bg-green-500 text-white text-[10px] font-medium">
                                                            {items.reduce((sum: number, item: any) => sum + item.softwareCount, 0)} total software
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {/* Department Data */}
                                            {items.map((data: any, index: number) => (
                                                <TableRow
                                                    key={`${deptName}-${data.id}`}
                                                    className="bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300"
                                                >
                                                    <TableCell className="font-asset-num text-[11px] text-center font-normal text-slate-400 py-4 border-b border-slate-50 dark:border-slate-800/30 tabular-nums">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 overflow-hidden rounded-xl border-2 border-zinc-100 dark:border-zinc-800 group-hover:border-blue-500/30 transition-colors duration-300 shadow-sm shrink-0">
                                                                <ImageDialog src={data.assetImage1 || "/noImage.jpg"} alt={data.assetNumber} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-inter text-[12px] font-normal text-blue-600 dark:text-blue-400 tracking-tight truncate">#{data.assetNumber}</div>
                                                                <div className="font-inter text-[11px] font-normal text-slate-400 uppercase tracking-widest truncate">{data.assetType.name}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                                        <div className="max-w-[200px]">
                                                            <div className="font-inter font-normal text-[12px] text-slate-900 dark:text-white truncate" title={data.product.part_name}>
                                                                {data.product.part_name}
                                                            </div>
                                                            <div className="font-inter text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate tracking-tight">
                                                                {data.product.part_number}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <span
                                                                    className="font-inter text-[12px] font-normal text-slate-900 dark:text-slate-100 truncate max-w-[120px]"
                                                                    title={data.employee?.name || 'Unassigned'}
                                                                >
                                                                    {data.employee?.name || 'Unassigned'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 opacity-70">
                                                                <span
                                                                    className="font-inter text-[11px] font-normal text-slate-500 truncate max-w-[120px]"
                                                                    title={data.location || ''}
                                                                >
                                                                    📍 {data.location}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            {(() => {
                                                                const dep = calculateAssetDepreciation(
                                                                    data.purchaseCost,
                                                                    data.purchaseDate,
                                                                    data.usefulLife,
                                                                    data.residualValue
                                                                );
                                                                return (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="cursor-help flex flex-col items-center text-center border-b border-dotted border-blue-200 dark:border-blue-800/50 pb-0.5">
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-asset-num text-[12px] text-blue-600 dark:text-blue-400 tabular-nums whitespace-nowrap">
                                                                                        {formatCurrencyQtt(dep.bookValue)}
                                                                                    </span>
                                                                                    <div className={`w-2 h-2 rounded-full ${dep.percentRemaining > 50 ? 'bg-green-500' : dep.percentRemaining > 20 ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                                                                    {dep.isValid && dep.isNearingEndOfLife && (
                                                                                        <Badge variant="outline" className="font-inter ml-1 px-1 h-3.5 text-[10px] font-medium bg-red-50 text-red-600 border-red-200 animate-pulse whitespace-nowrap">
                                                                                            SOON EXPIRED
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <span className="font-asset-num text-[11px] text-slate-400 uppercase tracking-tighter tabular-nums whitespace-nowrap">
                                                                                    Cost: {formatCurrencyQtt(dep.purchaseCost)}
                                                                                </span>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-slate-900 text-white border-slate-800 p-3 rounded-xl shadow-2xl z-50 max-w-[220px]">
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
                                                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Ringkasan Finansial</span>
                                                                                    <Badge variant="outline" className="font-inter font-medium h-4 text-[10px] border-slate-700 text-slate-400 px-1">
                                                                                        Sisa {dep.percentRemaining.toFixed(0)}%
                                                                                    </Badge>
                                                                                </div>

                                                                                {!dep.isValid ? (
                                                                                    <div className="text-[10px] text-amber-400 italic py-1">
                                                                                        ⚠️ Data tidak lengkap untuk kalkulasi
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                                                                                        <span className="text-slate-400">Harga Beli:</span>
                                                                                        <span className="text-right font-asset-num tabular-nums">{formatCurrencyQtt(dep.purchaseCost)}</span>

                                                                                        <span className="text-slate-400">Akum. Penyusutan:</span>
                                                                                        <span className="text-right font-asset-num text-red-400 tabular-nums">-{formatCurrencyQtt(dep.accumulatedDepreciation)}</span>

                                                                                        <span className="text-slate-400">Nilai Sisa:</span>
                                                                                        <span className="text-right font-asset-num text-green-400 tabular-nums">{formatCurrencyQtt(dep.residualValue)}</span>

                                                                                        <div className="col-span-2 border-t border-slate-800 my-1 pt-1 flex justify-between">
                                                                                            <span className="text-slate-400">Progress Umur:</span>
                                                                                            <span className="font-bold whitespace-nowrap">{dep.monthsElapsed} / {dep.totalMonths} Bln</span>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                <div className="pt-2 border-t border-slate-800 mt-2">
                                                                                    <p className="text-[10px] text-yellow-500 leading-tight italic">
                                                                                        * Dihitung menggunakan **Metode Garis Lurus**. Nilai aset berkurang secara seragam selama masa manfaatnya hingga mencapai nilai sisa.
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                );
                                                            })()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30 text-center">
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            <Badge variant={getStatusVariant(data.status)} className="font-inter rounded-md px-2 py-0 font-medium text-[10px] uppercase tracking-tighter whitespace-nowrap">
                                                                {data.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="font-inter text-[10px] font-medium px-1.5 py-0 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                                                {data.softwareCount} SW
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30 text-center">
                                                        <MaintenanceHistoryDialog
                                                            tickets={data.tickets || []}
                                                            assetNumber={data.assetNumber}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div>
                                                                        <AssetDetailSheet asset={data} />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Lihat Detail Aset</TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link href={`/dashboard/asset/asset-software/create/${data.id}`}>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="w-8 h-8 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-600 transition-all duration-200 group p-0"
                                                                        >
                                                                            <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                                                                        </Button>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Pasang Software</TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div>
                                                                        <PrintAssetButton id={data.id} />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Cetak PDF</TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div>
                                                                        <UpdateAssetLink
                                                                            id={data.id}
                                                                            searchParams={{
                                                                                page: currentPage,
                                                                                query,
                                                                                assetType,
                                                                                userName,
                                                                                department,
                                                                                status,
                                                                                location,
                                                                                software
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Ubah Aset</TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div>
                                                                        <DeleteAlertProduct id={data.id} />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Hapus Aset</TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TooltipProvider>
                </div>
            </section>
        </div>
    );
}