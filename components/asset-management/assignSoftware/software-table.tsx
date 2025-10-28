// components/asset-management/asset-software-table.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal,
    Trash2,
    Edit,
    ArrowLeft,
    Package,
    Calendar,
    Key,
    Code,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    LucideIcon,
} from "lucide-react"
import { AssetSoftwareInstallation } from "@/types/software"
import Link from "next/link"

interface AssetSoftwareTableProps {
    softwareInstallations: AssetSoftwareInstallation[];
    assetNumber: string;
    onEdit?: (softwareInstallation: AssetSoftwareInstallation) => void;
    onDelete?: (installationId: string) => void;
}

export const AssetSoftwareTable = ({
    softwareInstallations,
    assetNumber,
    onEdit,
    onDelete
}: AssetSoftwareTableProps) => {
    if (!softwareInstallations || softwareInstallations.length === 0) {
        return (
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" className="flex items-center gap-2">
                        <Link href="/dashboard/asset/asset-list">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Asset List</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    </Button>
                </div>

                {/* Empty State */}
                <div className="text-center py-12 sm:py-16 border-2 border-dashed rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Software Assigned
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 px-4">
                        This asset doesnt have any software installed yet. Click the button below to assign software.
                    </p>
                </div>
            </div>
        )
    }

    const getStatusBadge = (isActive: boolean, licenseExpiry: Date | null) => {
        const now = new Date();
        if (!isActive) {
            return (
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                </Badge>
            );
        }
        if (licenseExpiry && new Date(licenseExpiry) < now) {
            return (
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Expired
                </Badge>
            );
        }
        if (licenseExpiry) {
            const daysUntilExpiry = Math.ceil((new Date(licenseExpiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 30) {
                return (
                    <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Expiring Soon
                    </Badge>
                );
            }
        }
        return (
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
            </Badge>
        );
    }

    const formatDate = (date: Date | string | null) => {
        if (!date) return (
            <span className="text-gray-400 dark:text-gray-500 italic">Not set</span>
        );
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const maskLicenseKey = (key: string | null) => {
        if (!key) return (
            <span className="text-gray-400 dark:text-gray-500 italic">Not provided</span>
        );
        if (key.length <= 8) return key;
        return `${key.substring(0, 4)}****${key.substring(key.length - 4)}`;
    }

    const getLicenseType = (installation: AssetSoftwareInstallation) => {
        const licenseType = installation.software.licenseType || "Unknown";
        const licenseTypes: Record<string, { color: string; icon: LucideIcon | null }> = {
            'Perpetual': { color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800', icon: null },
            'Subscription': { color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800', icon: null },
            'Volume': { color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800', icon: null },
            'Trial': { color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800', icon: null },
            'Free': { color: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600', icon: null }
        };

        const config = licenseTypes[licenseType] || { color: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600', icon: null };

        return (
            <Badge variant="outline" className={config.color}>
                {licenseType}
            </Badge>
        );
    }

    const getVersion = (installation: AssetSoftwareInstallation) => {
        const version = installation.version || installation.software.version;
        if (!version) return (
            <span className="text-gray-400 dark:text-gray-500 italic">Unknown</span>
        );
        return (
            <div className="flex items-center gap-1">
                <Code className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <span className="hidden sm:inline">{version}</span>
                <span className="sm:hidden text-xs">{version}</span>
            </div>
        );
    }

    const getLicenseKey = (installation: AssetSoftwareInstallation) => {
        return installation.licenseKey || installation.software.licenseKey;
    }

    const isLicenseExpiringSoon = (expiryDate: Date | null) => {
        if (!expiryDate) return false;
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) > now;
    }

    const isLicenseExpired = (expiryDate: Date | null) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Summary Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                    <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>{softwareInstallations.length} software installed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>
                            {softwareInstallations.filter(si => si.isActive && !isLicenseExpired(si.licenseExpiry)).length} active
                        </span>
                    </div>
                </div>

                <Button asChild variant="outline" className="flex items-center gap-2 w-fit">
                    <Link href="/dashboard/asset/asset-list">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Asset List</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </Button>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-4">
                <div className="p-4 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-4">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Software on {assetNumber}
                    </h3>

                    <div className="space-y-4">
                        {softwareInstallations.map((installation) => {
                            const isExpiringSoon = isLicenseExpiringSoon(installation.licenseExpiry);
                            const isExpired = isLicenseExpired(installation.licenseExpiry);

                            return (
                                <div
                                    key={installation.id}
                                    className={`
                                        p-4 border rounded-lg space-y-3
                                        ${isExpired ? 'bg-red-50/30 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ''}
                                        ${isExpiringSoon ? 'bg-yellow-50/30 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : ''}
                                        ${!isExpired && !isExpiringSoon ? 'border-gray-200 dark:border-gray-700' : ''}
                                    `}
                                >
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {installation.software.name}
                                            </div>
                                            {installation.software.vendor && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {installation.software.vendor}
                                                </div>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => onEdit?.(installation)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <span>Edit Software</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete?.(installation.id)}
                                                    className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Remove Software</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Version</div>
                                            <div className="text-gray-900 dark:text-gray-100">
                                                {getVersion(installation)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">License Type</div>
                                            <div className="text-gray-900 dark:text-gray-100">
                                                {getLicenseType(installation)}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">License Key</div>
                                            <div className="text-gray-900 dark:text-gray-100 font-mono text-sm flex items-center gap-1">
                                                <Key className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                                {maskLicenseKey(getLicenseKey(installation))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">Install Date</div>
                                            <div className="text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                                {formatDate(installation.installDate)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 dark:text-gray-400 text-xs">License Expiry</div>
                                            <div className="text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                                {formatDate(installation.licenseExpiry)}
                                            </div>
                                            {isExpiringSoon && (
                                                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                    Expires soon
                                                </div>
                                            )}
                                            {isExpired && (
                                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                    License expired
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        {getStatusBadge(installation.isActive, installation.licenseExpiry)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                <div className="p-4 border-b bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Software Installed on {assetNumber}
                    </h3>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 dark:from-sky-500 dark:to-indigo-700 dark:hover:from-sky-600 dark:hover:to-indigo-800">
                            <TableHead className="font-semibold py-4 text-gray-100 ">Software</TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">Version</TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">License Type</TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">
                                <Key className="h-4 w-4 inline mr-1" />
                                License Key
                            </TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                Install Date
                            </TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                License Expiry
                            </TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100">Status</TableHead>
                            <TableHead className="font-semibold py-4 text-gray-100 w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {softwareInstallations.map((installation) => {
                            const isExpiringSoon = isLicenseExpiringSoon(installation.licenseExpiry);
                            const isExpired = isLicenseExpired(installation.licenseExpiry);

                            return (
                                <TableRow
                                    key={installation.id}
                                    className={`
                                        border-gray-200 dark:border-gray-700
                                        ${isExpired ? 'bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50 dark:hover:bg-red-900/20' : ''}
                                        ${isExpiringSoon ? 'bg-yellow-50/30 dark:bg-yellow-900/10 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20' : ''}
                                        ${!isExpired && !isExpiringSoon ? 'hover:bg-gray-50/50 dark:hover:bg-slate-700/50' : ''}
                                    `}
                                >
                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                        <div className="font-medium">
                                            {installation.software.name}
                                        </div>
                                        {installation.software.vendor && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {installation.software.vendor}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-900 dark:text-gray-100">{getVersion(installation)}</TableCell>
                                    <TableCell>{getLicenseType(installation)}</TableCell>
                                    <TableCell className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center gap-1">
                                            <Key className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                            {maskLicenseKey(getLicenseKey(installation))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                            {formatDate(installation.installDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                            {formatDate(installation.licenseExpiry)}
                                        </div>
                                        {isExpiringSoon && (
                                            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                Expires soon
                                            </div>
                                        )}
                                        {isExpired && (
                                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                License expired
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(installation.isActive, installation.licenseExpiry)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                                                <DropdownMenuItem
                                                    onClick={() => onEdit?.(installation)}
                                                    className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                >
                                                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <span>Edit Software</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete?.(installation.id)}
                                                    className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Remove Software</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Footer Summary */}
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <span>Showing {softwareInstallations.length} installed software</span>
                    <div className="flex items-center gap-2">
                        {softwareInstallations.some(si => isLicenseExpiringSoon(si.licenseExpiry)) && (
                            <span className="text-yellow-600 dark:text-yellow-400">
                                • Some licenses are expiring soon
                            </span>
                        )}
                        {softwareInstallations.some(si => isLicenseExpired(si.licenseExpiry)) && (
                            <span className="text-red-600 dark:text-red-400">
                                • Some licenses have expired
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}