import React from "react";
import { UpdateAssetLink } from "./buttons";
import DeleteAlertProduct from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchAssetList } from "@/data/asset/asset";
import { formatCurrencyQtt } from "@/lib/utils";
import ImageDialog from "./imageDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AssetTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const data = await fetchAssetList(query, currentPage);

    if (!Array.isArray(data)) {
        console.error("Failed to fetch asset list:", data.error);
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                Error: {data.error}
            </div>
        );
    }

    const groupedData = data.reduce((acc, item) => {
        const deptName = item.department?.dept_name || "Unassigned";
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(item);
        return acc;
    }, {} as Record<string, typeof data>);

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
        <div className="mt-6 flow-root">
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {Array.isArray(data) && data.map((data, index) => (
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
                                                colSpan={13}
                                                className="font-bold text-lg text-blue-900 dark:text-blue-100 py-3 px-6 border-b border-blue-200 dark:border-blue-700"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                                    <span>🏢 {deptName}</span>
                                                    <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                                                        {items.length} assets
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
                                                    <div className="w-12 h-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                                        <ImageDialog
                                                            src={data.assetImage1 || "/noImage.jpg"}
                                                            alt={`${data.assetNumber} Asset Image`}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center justify-center space-x-1">
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