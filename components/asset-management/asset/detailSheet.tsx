"use client";

import React from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    EyeIcon,
    DocumentTextIcon,
    UserIcon,
    //   BuildingOfficeIcon, 
    //   MapPinIcon, 
    //   CalendarIcon, 
    CurrencyDollarIcon,
    ComputerDesktopIcon,
    TagIcon,
    CubeIcon,
    //   ClockIcon, 
    //   ShieldCheckIcon,
    // KeyIcon,
    // CheckCircleIcon,
    // XCircleIcon
} from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyQtt } from "@/lib/utils";
import ImageDialog from "./imageDialog";
import { Package, TrendingDown, Info, ShieldCheck } from "lucide-react";
import { calculateAssetDepreciation } from "@/lib/finance";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface AssetDetailSheetProps {
    asset: {
        id: string;
        assetNumber: string;
        product: {
            id: string;
            group: {
                name: string;
            };
            brand: {
                name: string;
            };
            gudang: {
                name: string;
            };
            part_number: string;
            part_name: string;
            nick_name: string;
            satuan_penyimpanan: string;
            satuan_pengeluaran: string;
            description: string | null;
            jenisproduct: {
                name: string;
            };
            kategoriproduct: {
                name: string;
            };
        };
        assetType: {
            id: string;
            name: string;
        };
        location: string | null;
        purchaseCost?: number | null;
        purchaseDate?: Date | string | null;
        residualValue?: number | null;
        usefulLife: number | null;
        employee: {
            name: string;
            id: string;
            email: string;
        } | null;
        department: {
            id: string;
            dept_name: string;
        } | null;
        status: string;
        assetImage1?: string | null;
        softwareInstallations: {
            id: string;
            assetId: string;
            softwareId: string;
            installDate: Date | null;
            licenseKey: string | null;
            licenseExpiry: Date | null;
            version: string | null;
            isActive: boolean;
            software?: { // Ubah menjadi object, bukan array
                name: string;
                vendor?: string | null;
            };
        }[];
        description?: string | null;
        serialNumber?: string | null;
        warrantyExpiry?: Date | null;
        softwareCount: number;
        employeeId: string | null;
    };
}

export function AssetDetailSheet({ asset }: AssetDetailSheetProps) {
    //   const getStatusVariant = (status: string) => {
    //     switch (status?.toLowerCase()) {
    //       case 'active': return 'default';
    //       case 'inactive': return 'secondary';
    //       case 'maintenance': return 'destructive';
    //       case 'retired': return 'outline';
    //       default: return 'secondary';
    //     }
    //   };

    // console.log("Asset in DetailSheet:", asset);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
            case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
            case 'retired': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    // Format values untuk handle null/undefined
    const formatUsefulLife = (life: number | null) => {
        return life !== null ? `${life} years` : 'Not specified';
    };

    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'N/A';
        try {
            const dateObj = new Date(date);
            return isNaN(dateObj.getTime()) ? 'N/A' : dateObj.toLocaleDateString();
        } catch {
            return 'N/A';
        }
    };

    const formatCurrency = (amount: number | null | undefined) => {
        return amount !== null && amount !== undefined ? formatCurrencyQtt(amount) : 'N/A';
    };

    const softwareCount = asset.softwareInstallations?.length || 0;

    const dep = React.useMemo(() => calculateAssetDepreciation(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife,
        asset.residualValue
    ), [asset.purchaseCost, asset.purchaseDate, asset.usefulLife, asset.residualValue]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200 group"
                >
                    <EyeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
                <SheetHeader className="border-b border-slate-200 pb-4 dark:border-slate-700">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                        Asset Details
                    </SheetTitle>
                    <SheetDescription>
                        Complete information about {asset.product.part_name}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Header Section */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-lg border-2 border-blue-300 dark:border-blue-600 overflow-hidden bg-white dark:bg-slate-800">
                                        <ImageDialog
                                            src={asset.assetImage1 || "/noImage.jpg"}
                                            alt={`${asset.assetNumber} Asset Image`}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {asset.product.part_name}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                                            {asset.product.part_number} • {asset.product.nick_name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                #{asset.assetNumber}
                                            </Badge>
                                            <Badge className={`${getStatusColor(asset.status)} border`}>
                                                {asset.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Information */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <CubeIcon className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Product Information</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Brand</span>
                                        <Badge variant="outline">{asset.product.brand.name}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Category</span>
                                        <span className="font-medium">{asset.product.kategoriproduct.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Type</span>
                                        <span className="font-medium">{asset.product.jenisproduct.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Group</span>
                                        <span className="font-medium">{asset.product.group.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Warehouse</span>
                                        <span className="font-medium">{asset.product.gudang.name}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Asset Information */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <TagIcon className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Asset Information</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Asset Type</span>
                                        <Badge variant="secondary">{asset.assetType.name}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Useful Life</span>
                                        <span className="font-medium">{formatUsefulLife(asset.usefulLife)}</span>
                                    </div>
                                    {asset.serialNumber && (
                                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                            <span className="text-slate-600 dark:text-slate-400">Serial Number</span>
                                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
                                                {asset.serialNumber}
                                            </code>
                                        </div>
                                    )}
                                    {asset.description && (
                                        <div className="py-2">
                                            <span className="text-slate-600 dark:text-slate-400 block mb-2">Description</span>
                                            <p className="text-slate-900 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                {asset.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assignment Information */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <UserIcon className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Assignment</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Assigned To</span>
                                        <span className="font-medium text-right">
                                            {asset.employee?.name || 'Unassigned'}
                                            {asset.employee?.email && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {asset.employee.email}
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Department</span>
                                        <span className="font-medium">{asset.department?.dept_name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                                        <span className="text-slate-600 dark:text-slate-400">Location</span>
                                        <span className="font-medium">{asset.location || 'Not specified'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Information */}
                        <Card className="overflow-hidden border-amber-200/50 dark:border-amber-900/30">
                            <CardContent className="p-0">
                                <div className="p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 border-b border-amber-100 dark:border-amber-900/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CurrencyDollarIcon className="w-5 h-5 text-amber-600" />
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Financial & Depreciation</h3>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-4 h-4 text-slate-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">Method: Straight-Line Depreciation</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {/* Health Meter */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Asset Value Health</span>
                                            <span className={`text-sm font-bold ${dep.percentRemaining > 50 ? 'text-green-600' : dep.percentRemaining > 20 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {dep.percentRemaining.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={dep.percentRemaining}
                                            className="h-2 bg-slate-100 dark:bg-slate-800"
                                        // indicatorClassName dibaca sebagai prop di shadcn UI standard, tapi di sini kita pakai div style jika tidak ada
                                        />
                                        <p className="text-[10px] text-slate-400 italic">
                                            Estimated {dep.totalMonths - dep.monthsElapsed > 0 ? `${dep.totalMonths - dep.monthsElapsed} months` : '0 months'} of useful life remaining
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Purchase Cost</span>
                                            <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(asset.purchaseCost)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Current Book Value</span>
                                            <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(dep.bookValue)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Accumulated Depr.</span>
                                            <p className="font-medium text-red-600/80 dark:text-red-400/80">-{formatCurrency(dep.accumulatedDepreciation)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Residual Value</span>
                                            <p className="font-medium text-slate-600">{formatCurrency(asset.residualValue)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Purchase Date</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(asset.purchaseDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">Useful Life</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatUsefulLife(asset.usefulLife)}</span>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Software Information */}
                        <Card className="lg:col-span-2">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <ComputerDesktopIcon className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Installed Software ({softwareCount})
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {asset.softwareInstallations && asset.softwareInstallations.length > 0 ? (
                                        asset.softwareInstallations.map((installation) => (
                                            <div
                                                key={installation.id}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                                            >
                                                <div className="md:col-span-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {installation.software?.name || 'Unknown Software'} {/* Hapus [0] */}
                                                        </span>
                                                        {installation.version && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                v{installation.version}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {installation.software?.vendor && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Vendor: {installation.software.vendor}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        Installed: {installation.installDate ? new Date(installation.installDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                    {installation.licenseExpiry && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Expires: {new Date(installation.licenseExpiry).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${installation.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {installation.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                            <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                            <p>No software installed</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </SheetContent>
        </Sheet >
    );
}