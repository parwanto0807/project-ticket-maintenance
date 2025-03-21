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
import { Card } from "@/components/ui/card";
import React from "react";

// const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function ProductsTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const products = await fetchProducts(query, currentPage);

    // Group products by category
    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.kategoriproduct.name;
        console.log(categoryName);
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, typeof products>);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {Object.entries(groupedProducts).map(([categoryName, products]) => (
                            <div key={categoryName}>
                                <h2 className="text-lg font-bold mt-4 mb-2">{categoryName}</h2>
                                {products.map((product, index) => (
                                    <Card
                                        key={product.id}
                                        className="grid grid-cols-1 gap-1 mb-2 w-full border-b pb-1 rounded-md p-2 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="mb-1 flex items-center text-black font-bold dark:text-white">
                                                    <p>{index + 1}. {product.nick_name}</p> {/* Nomor urut di sini */}
                                                </div>
                                                <div>
                                                    <p className="text-sm pt-1">
                                                        {product.part_number}  &nbsp;
                                                        {product.part_name}
                                                    </p>
                                                </div>
                                                <div className="flex flex-row">
                                                    <p className="text-sm pb-2">
                                                        {product.brand.name}
                                                    </p> &nbsp;
                                                    <p className="text-sm text-gray-500">{product.kategoriproduct.name}</p> &nbsp;
                                                    <p className="text-sm text-gray-500">{product.jenisproduct.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 w-full items-center justify-between">
                                            <div className="flex justify-end gap-2">
                                                <UpdateProduct id={product.id} />
                                                <DeleteAlertProduct id={product.id} />
                                                <ProductDialog product={product} />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader>
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead className="text-black py-8 items-center dark:text-white font-bold uppercase">No</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Part Number</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Part Name</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Entry Unit</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Stock Unit</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Out Unit</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Min Stock</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Max Stock</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Type</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Category</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Group Product</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Brand</TableHead>{/* */}
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="text-[12px] border-none">
                            {Object.entries(groupedProducts).map(([categoryName, products]) => (
                                <React.Fragment key={categoryName}>
                                    {/* Baris untuk judul kategori */}
                                    <TableRow className="bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                        <TableCell colSpan={13} className="font-bold text-lg">🗃️ {categoryName}</TableCell>
                                    </TableRow>
                                    {/* Baris untuk setiap produk di kategori tersebut */}
                                    {products.map((product, index) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="text-center">{index + 1}</TableCell>{/* */}
                                            <TableCell><ReadMoreText text={product.part_number} /></TableCell>{/* */}
                                            <TableCell><ReadMoreText text={product.part_name} /></TableCell>{/* */}
                                            <TableCell className="text-center">{product.satuan_pemasukan}</TableCell>{/* */}
                                            <TableCell className="text-center">{product.satuan_penyimpanan}</TableCell>{/* */}
                                            <TableCell className="text-center">{product.satuan_pengeluaran}</TableCell>{/* */}
                                            <TableCell className="text-center">{product.minStock}</TableCell>{/* */}
                                            <TableCell className="text-center">{product.maxStock}</TableCell>{/* */}
                                            <TableCell>{product.jenisproduct.name}</TableCell>{/* */}
                                            <TableCell>{product.kategoriproduct.name}</TableCell>{/* */}
                                            <TableCell>{product.group.name}</TableCell>{/* */}
                                            <TableCell>{product.brand.name}</TableCell>{/* */}
                                            <TableCell className="flex items-center justify-center object-center gap-2">
                                                <UpdateProduct id={product.id} />{/* */}
                                                <DeleteAlertProduct id={product.id} />{/* */}
                                                <ProductDialog product={product} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </div>
        </div>
    );
}