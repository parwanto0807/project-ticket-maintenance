"use client";

import { UpdateProduct } from "./buttons";
import DeleteAlertProduct from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ProductDialog } from "./dialog-product-detail";
import ReadMoreText from "@/components/asset-management/maintenance/read-more";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ProductsTable({ products, loading }: { products: any[]; loading: boolean; }) {
    if (loading) {
        return <div className="py-20 text-center font-medium text-slate-500">Loading products...</div>;
    }

    if (!products || products.length === 0) {
        return <div className="py-20 text-center font-medium text-slate-500">No products found.</div>;
    }

    const groupedProducts = products.reduce((acc: Record<string, any[]>, product: any) => {
        const categoryName = product.kategoriproduct?.name || "Uncategorized";
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className={cn("mt-4 lg:mt-6 flow-root", font.className)}>
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-4 px-0">
                    {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                        <div key={categoryName} className="space-y-3">
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                <h2 className="text-[15px] font-semibold text-slate-800 dark:text-white uppercase tracking-tight">
                                    {categoryName}
                                </h2>
                                <Badge variant="outline" className="text-[10px] font-medium border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                    {categoryProducts.length} Items
                                </Badge>
                            </div>
                            <div className="space-y-2.5">
                                {categoryProducts.map((product, index) => (
                                    <Card
                                        key={product.id}
                                        className="bg-white/40 backdrop-blur-md border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 dark:bg-slate-900/40 dark:border-slate-800 rounded-2xl overflow-hidden group"
                                    >
                                        <CardContent className="p-2.5 sm:p-3">
                                            <div className="space-y-2.5">
                                                {/* Header */}
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase">
                                                            #{index + 1}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 tracking-wider">
                                                            {product.part_number}
                                                        </span>
                                                    </div>
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-semibold uppercase tracking-tight dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                                        Ready
                                                    </Badge>
                                                </div>

                                                {/* Content */}
                                                <div className="space-y-2">
                                                    <div>
                                                        <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white leading-tight tracking-tight">
                                                            {product.nick_name}
                                                        </h3>
                                                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                                                            {product.part_name}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 py-1.5 px-2 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                                        <div>
                                                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0">Brand</span>
                                                            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                                {product.brand?.name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0">Stock Unit</span>
                                                            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                                                {product.satuan_penyimpanan}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-slate-400 uppercase tracking-tighter">Min:</span>
                                                            <span className="font-black text-red-600">{product.minStock}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-slate-400 uppercase tracking-tighter">Max:</span>
                                                            <span className="font-black text-emerald-600">{product.maxStock}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-slate-400 uppercase tracking-tighter">Type:</span>
                                                            <span className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[70px]">
                                                                {product.jenisproduct?.name}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/dashboard/asset/asset-list?query=${encodeURIComponent(product.part_number)}`}
                                                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-[10px] border border-blue-100 dark:border-blue-800"
                                                        >
                                                            Assets: {product._count?.assets || 0}
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <ProductDialog product={product} />
                                                    <UpdateProduct id={product.id} />
                                                    <DeleteAlertProduct id={product.id} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block">
                    <Card className="bg-white/40 backdrop-blur-xl shadow-2xl border border-slate-200/50 dark:bg-slate-900/40 dark:border-slate-800 rounded-3xl overflow-hidden">
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <TableHead className="w-12 text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 text-center uppercase text-[11px] tracking-widest">
                                        No
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest">
                                        Part Number
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest">
                                        Part Name
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest text-center">
                                        Stock Unit
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest text-center">
                                        Limit
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest">
                                        Category
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 uppercase text-[11px] tracking-widest">
                                        Brand
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 text-center uppercase text-[11px] tracking-widest">
                                        Asset
                                    </TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400 font-medium border-b border-border py-5 text-center uppercase text-[11px] tracking-widest">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                                    <React.Fragment key={categoryName}>
                                        {/* Category Header */}
                                        <TableRow className="bg-slate-50/30 dark:bg-slate-800/20 backdrop-blur-sm">
                                            <TableCell
                                                colSpan={8}
                                                className="font-semibold text-[13px] text-blue-600 dark:text-blue-400 py-5 px-6 border-b border-slate-100/50 dark:border-slate-800/50 uppercase tracking-tight"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"></div>
                                                    <span>{categoryName}</span>
                                                    <Badge variant="outline" className="ml-3 border-blue-200/50 dark:border-blue-800/50 bg-blue-50/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                                                        {categoryProducts.length} Products
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Category Data */}
                                        {categoryProducts.map((product, index) => (
                                            <TableRow
                                                key={product.id}
                                                className="bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                                            >
                                                <TableCell className="text-center font-medium text-slate-400 py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-blue-600 dark:text-blue-400 py-4 border-b border-slate-50 dark:border-slate-800/50 tracking-tight">
                                                    <ReadMoreText text={product.part_number} />
                                                </TableCell>
                                                <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white tracking-tight">
                                                            {product.nick_name}
                                                        </div>
                                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            <ReadMoreText text={product.part_name} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium text-slate-700 dark:text-slate-300 py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    {product.satuan_penyimpanan}
                                                </TableCell>
                                                <TableCell className="text-center py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] text-red-500 font-semibold uppercase">Min: {product.minStock}</span>
                                                        <span className="text-[10px] text-emerald-500 font-semibold uppercase">Max: {product.maxStock}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-medium">
                                                        {product.kategoriproduct?.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800 font-medium">
                                                        {product.brand?.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/50 text-center">
                                                    <Link
                                                        href={`/dashboard/asset/asset-list?query=${encodeURIComponent(product.part_number)}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 border border-blue-200 dark:border-blue-800 shadow-sm"
                                                    >
                                                        <span>{product._count?.assets || 0}</span>
                                                        <span className="text-[10px] uppercase opacity-70 font-bold">Asset</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/50">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <ProductDialog product={product} />
                                                        <UpdateProduct id={product.id} />
                                                        <DeleteAlertProduct id={product.id} />
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