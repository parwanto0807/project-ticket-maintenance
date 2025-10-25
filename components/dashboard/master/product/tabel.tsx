import { fetchProducts } from "@/data/master/products";
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

export default async function ProductsTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const products = await fetchProducts(query, currentPage);

    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.kategoriproduct.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, typeof products>);

    return (
        <div className="mt-6 flow-root">
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {Object.entries(groupedProducts).map(([categoryName, products]) => (
                        <div key={categoryName}>
                            <div className="flex items-center space-x-2 mb-3 p-3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-lg">
                                <div className="w-1 h-6 bg-white rounded-full"></div>
                                <h2 className="text-lg font-bold text-white">🗃️ {categoryName}</h2>
                                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                    {products.length} items
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {products.map((product, index) => (
                                    <Card 
                                        key={product.id}
                                        className="bg-white/80 backdrop-blur-sm border-l-4 border-l-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/80 dark:border-l-indigo-400"
                                    >
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                {/* Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                            #{index + 1}
                                                        </Badge>
                                                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                            {product.part_number}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="space-y-2">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                                            {product.nick_name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {product.part_name}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Brand:</span>
                                                            <p className="font-medium text-slate-900 dark:text-white">
                                                                {product.brand.name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Type:</span>
                                                            <p className="font-medium text-slate-900 dark:text-white">
                                                                {product.jenisproduct.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Stock Unit:</span>
                                                            <p className="font-medium text-slate-900 dark:text-white">
                                                                {product.satuan_penyimpanan}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Group:</span>
                                                            <p className="font-medium text-slate-900 dark:text-white">
                                                                {product.group.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Min Stock:</span>
                                                            <p className="font-medium text-red-600 dark:text-red-400">
                                                                {product.minStock}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">Max Stock:</span>
                                                            <p className="font-medium text-green-600 dark:text-green-400">
                                                                {product.maxStock}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                                    <UpdateProduct id={product.id} />
                                                    <DeleteAlertProduct id={product.id} />
                                                    <ProductDialog product={product} />
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
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 dark:bg-slate-800/80">
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 dark:from-sky-500 dark:to-indigo-700 dark:hover:from-sky-600 dark:hover:to-indigo-800">
                                    <TableHead className="w-12 text-white font-semibold border-r border-white/30 py-4 text-center">
                                        No
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Part Number
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Part Name
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Entry Unit
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Stock Unit
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Out Unit
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Min Stock
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Max Stock
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Type
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Category
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Group Product
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Brand
                                    </TableHead>
                                    <TableHead className="text-white font-semibold py-4 text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-transparent">
                                {Object.entries(groupedProducts).map(([categoryName, products]) => (
                                    <React.Fragment key={categoryName}>
                                        {/* Category Header */}
                                        <TableRow className="bg-gradient-to-r from-sky-50 to-indigo-100 hover:from-sky-100 hover:to-indigo-200 dark:from-indigo-900/20 dark:to-sky-800/20 dark:hover:from-indigo-800/30 dark:hover:to-sky-700/30">
                                            <TableCell 
                                                colSpan={13} 
                                                className="font-bold text-lg text-indigo-900 dark:text-indigo-100 py-3 px-6 border-b border-indigo-200 dark:border-indigo-700"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                                                    <span>🗃️ {categoryName}</span>
                                                    <Badge variant="secondary" className="ml-2 bg-indigo-500 text-white">
                                                        {products.length} products
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Category Data */}
                                        {products.map((product, index) => (
                                            <TableRow 
                                                key={product.id}
                                                className="bg-white/50 hover:bg-sky-50/80 dark:bg-slate-800/50 dark:hover:bg-indigo-900/20 transition-colors duration-200 border-b border-slate-200/50 dark:border-slate-700/50"
                                            >
                                                <TableCell className="text-center font-medium text-slate-600 dark:text-slate-400 py-3">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold text-indigo-700 dark:text-indigo-300 py-3">
                                                    <ReadMoreText text={product.part_number} />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {product.nick_name}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                                            <ReadMoreText text={product.part_name} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3">
                                                    {product.satuan_pemasukan}
                                                </TableCell>
                                                <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3">
                                                    {product.satuan_penyimpanan}
                                                </TableCell>
                                                <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3">
                                                    {product.satuan_pengeluaran}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold text-red-600 dark:text-red-400 py-3">
                                                    {product.minStock}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold text-green-600 dark:text-green-400 py-3">
                                                    {product.maxStock}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                                                        {product.jenisproduct.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-700 dark:text-slate-300 py-3">
                                                    {product.kategoriproduct.name}
                                                </TableCell>
                                                <TableCell className="text-slate-700 dark:text-slate-300 py-3">
                                                    {product.group.name}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                        {product.brand.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <UpdateProduct id={product.id} />
                                                        <DeleteAlertProduct id={product.id} />
                                                        <ProductDialog product={product} />
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