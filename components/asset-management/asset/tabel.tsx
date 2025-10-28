
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
import { fetchAllAssetsGeneral, fetchAssetList } from "@/data/asset/asset";
import { formatCurrencyQtt } from "@/lib/utils";
import ImageDialog from "./imageDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetDetailSheet } from "./detailSheet";
import { AssetFilters } from "./asset-filters";

export default async function AssetTable({
    query,
    currentPage,
    assetType,
    userName,
    department,
    status,
    location,
    software,
}: {
    query: string;
    currentPage: number;
    assetType?: string;
    userName?: string;
    department?: string;
    status?: string;
    location?: string;
    software?: string;
}) {

    const filters = {
        assetType,
        userName,
        department,
        status,
        location,
        software,
    };
    const data = await fetchAssetList(query, currentPage, filters);
    const dataGeneral = await fetchAllAssetsGeneral();

    if (!Array.isArray(data)) {
        console.error("Failed to fetch asset list:", data.error);
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                Error: {data.error}
            </div>
        );
    }

    // Pastikan dataGeneral adalah array
    const assetsData = Array.isArray(dataGeneral) ? dataGeneral : [];

    // Hitung statistik dari dataGeneral
    const totalAssets = assetsData.length;
    const totalAssetValue = assetsData.reduce((sum, asset) => sum + Number(asset.purchaseCost || 0), 0);

    // Hitung kategori aset unik
    const assetCategories = [...new Set(assetsData.map(asset => asset.assetType?.name).filter(Boolean))];
    const totalCategories = assetCategories.length;

    // Hitung status aset
    const statusCount = assetsData.reduce((acc, asset) => {
        const status = asset.status?.toLowerCase() || 'unknown';
        if (status.includes('active') || status.includes('use')) acc.inUse++;
        else if (status.includes('available') || status.includes('ready')) acc.available++;
        else if (status.includes('maintenance') || status.includes('broken') || status.includes('repair')) acc.maintenance++;
        else acc.other++;
        return acc;
    }, { inUse: 0, available: 0, maintenance: 0, other: 0 });

    // Hitung total software installations
    const totalSoftwareInstallations = assetsData.reduce((total, asset) => {
        return total + (asset.softwareInstallations?.length || 0);
    }, 0);

    // Hitung software installations untuk data yang difilter (dengan query)
    const assetsWithSoftwareCount = data.map(asset => ({
        ...asset,
        softwareCount: asset.softwareInstallations?.length || 0
    }));

    // Group data by department untuk data yang difilter
    const groupedData = assetsWithSoftwareCount.reduce((acc, item) => {
        const deptName = item.department?.dept_name || "Unassigned";
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(item);
        return acc;
    }, {} as Record<string, typeof assetsWithSoftwareCount>);

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

    const getSoftwareBadgeVariant = (count: number) => {
        if (count === 0) return "outline";
        if (count <= 2) return "secondary";
        if (count <= 5) return "default";
        return "destructive";
    };

    const getSoftwareBadgeColor = (count: number) => {
        if (count === 0) return "text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
        if (count <= 2) return "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
        if (count <= 5) return "text-green-700 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
        return "text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    };

    return (
        <div className="mt-6 flow-root">
            {/* Detailed Asset Statistics from dataGeneral */}
            <div className="mb-8">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="asset-overview" className="border rounded-lg bg-white/50 dark:bg-slate-800/50">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                                    📈 Asset Overview
                                    <Badge variant="outline" className="ml-2 bg-blue-500 text-white">
                                        General Statistics
                                    </Badge>
                                </h2>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                {statsCards.map((card, index) => (
                                    <Card
                                        key={index}
                                        className={`bg-gradient-to-r ${card.gradient} border ${card.darkGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                                                        {card.title}
                                                    </p>
                                                    <p className={`text-base font-bold ${card.valueColor} mb-1`}>
                                                        {card.value}
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                        {card.description}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center ml-2">
                                                    <span className="text-lg">{card.icon}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Additional Summary Card */}
                            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 dark:from-slate-800/20 dark:to-slate-700/20 dark:border-slate-700">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                    📋 Status Distribution
                                                </p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>In Use:</span>
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {statusCount.inUse} ({totalAssets > 0 ? Math.round((statusCount.inUse / totalAssets) * 100) : 0}%)
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Available:</span>
                                                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                                                            {statusCount.available} ({totalAssets > 0 ? Math.round((statusCount.available / totalAssets) * 100) : 0}%)
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Maintenance:</span>
                                                        <span className="font-semibold text-red-600 dark:text-red-400">
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

                                <Card className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/20 dark:border-cyan-700">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                                                    💾 Software Distribution
                                                </p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Total Software:</span>
                                                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                                                            {totalSoftwareInstallations}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Assets with Software:</span>
                                                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                                                            {assetsData.filter(asset => (asset.softwareInstallations?.length || 0) > 0).length}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Avg per Asset:</span>
                                                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
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
            </div>

            <div className="mb-6">
                <div className="flex flex-col space-y-4">
                    <div className="mb-6">
                        <AssetFilters
                            assetTypes={assetTypes}
                            userNames={userNames}
                            departments={departments}
                            statuses={statuses}
                            locations={locations}
                        />
                    </div>
                </div>
            </div>

            {/* Asset Table Section */}
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {assetsWithSoftwareCount.map((data, index) => (
                        <Card
                            key={data.id}
                            className="bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/80 dark:border-l-blue-400"
                        >
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                #{data.assetNumber}
                                            </Badge>
                                            <Badge variant={getStatusVariant(data.status)} className="text-xs">
                                                {data.status}
                                            </Badge>
                                            <Badge
                                                variant={getSoftwareBadgeVariant(data.softwareCount)}
                                                className={`text-xs ${getSoftwareBadgeColor(data.softwareCount)}`}
                                            >
                                                {data.softwareCount} software
                                            </Badge>
                                        </div>
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-16 h-16 overflow-hidden rounded-lg border border-blue-200 dark:border-blue-800">
                                                <ImageDialog
                                                    src={data.assetImage1 || "/noImage.jpg"}
                                                    alt={`${data.assetNumber} Asset Image`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                                    {data.product.part_name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {data.product.part_number}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Type:</span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.assetType.name}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Life:</span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.usefulLife}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-slate-500 dark:text-slate-400">👤</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {data.employee?.name || 'Unassigned'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-slate-500 dark:text-slate-400">🏢</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {data.department?.dept_name || 'Unassigned'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-slate-500 dark:text-slate-400">📍</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {data.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Cost:</span>
                                                <p className="font-medium text-green-600 dark:text-green-400">
                                                    {formatCurrencyQtt(Number(data.purchaseCost?.toString()))}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.purchaseDate?.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <UpdateAssetLink id={data.id} />
                                        <DeleteAlertProduct id={data.id} />
                                        <Link href={`/dashboard/asset/generate-pdf/${data.id}`} passHref>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-800"
                                            >
                                                <PrinterIcon className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 dark:bg-slate-800/80">
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 dark:from-sky-500 dark:to-indigo-700 dark:hover:from-sky-600 dark:hover:to-indigo-800">
                                    <TableHead className="w-12 text-white font-semibold border-r border-blue-500/30 py-4 text-center">
                                        No
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Asset Number
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Description
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Asset Type
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Useful Life
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        User Name
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Department
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Location
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Cost Purchase
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Date Purchase
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Software
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-blue-500/30 py-4">
                                        Image
                                    </TableHead>
                                    <TableHead className="text-white font-semibold py-4 text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-transparent">
                                {Object.entries(groupedData).map(([deptName, items]) => (
                                    <React.Fragment key={deptName}>
                                        {/* Department Header */}
                                        <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30">
                                            <TableCell
                                                colSpan={14}
                                                className="font-bold text-lg text-blue-900 dark:text-blue-100 py-3 px-6 border-b border-blue-200 dark:border-blue-700"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                                    <span>🏢 {deptName}</span>
                                                    <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                                                        {items.length} assets
                                                    </Badge>
                                                    <Badge variant="outline" className="ml-2 bg-green-500 text-white">
                                                        {items.reduce((sum, item) => sum + item.softwareCount, 0)} total software
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Department Data */}
                                        {items.map((data, index) => (
                                            <TableRow
                                                key={`${deptName}-${data.id}`}
                                                className="bg-white/50 hover:bg-blue-50/80 dark:bg-slate-800/50 dark:hover:bg-blue-900/20 transition-colors duration-200 border-b border-slate-200/50 dark:border-slate-700/50"
                                            >
                                                <TableCell className="text-center font-medium text-slate-600 dark:text-slate-400 py-3">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-blue-700 dark:text-blue-300 py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">🎫</span>
                                                        <span>{data.assetNumber}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {data.product.part_name}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            {data.product.part_number}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                        {data.assetType.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3">
                                                    {data.usefulLife}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-slate-400">👤</span>
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {data.employee?.name || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-700 dark:text-slate-300 py-3">
                                                    {data.department?.dept_name || 'Unassigned'}
                                                </TableCell>
                                                <TableCell className="text-slate-700 dark:text-slate-300 py-3">
                                                    {data.location}
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-600 dark:text-green-400 py-3">
                                                    {formatCurrencyQtt(Number(data.purchaseCost?.toString()))}
                                                </TableCell>
                                                <TableCell className="text-slate-700 dark:text-slate-300 py-3">
                                                    {data.purchaseDate?.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant={getStatusVariant(data.status)}>
                                                        {data.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge
                                                        variant={getSoftwareBadgeVariant(data.softwareCount)}
                                                        className={getSoftwareBadgeColor(data.softwareCount)}
                                                    >
                                                        {data.softwareCount === 0 ? 'No software' : `${data.softwareCount} installed`}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="w-12 h-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                                        <ImageDialog
                                                            src={data.assetImage1 || "/noImage.jpg"}
                                                            alt={`${data.assetNumber} Asset Image`}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <AssetDetailSheet asset={data} />
                                                        <Link href={`/dashboard/asset/asset-software/create/${data.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                Assign Software
                                                            </Button>
                                                        </Link>
                                                        <PrintAssetButton id={data.id} />
                                                        <UpdateAssetLink id={data.id} />
                                                        <DeleteAlertProduct id={data.id} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    );
}