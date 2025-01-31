import { fetchProducts } from "@/data/master/products";
// import { formatDate } from "@/lib/utils";
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
const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function ProductsTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const products = await fetchProducts(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    //console.log(products)
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                    <div className="md:hidden">
                        {products.map((products) => (
                            <div
                                key={products.id}
                                className="mb-2 w-full rounded-md p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-1">
                                    <div>
                                        <div className="mb-2 flex items-center text-black dark:text-white">
                                            <p>{products.nick_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm pt-1">
                                                {products.part_number}  &nbsp;
                                                {products.part_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm pb-2">
                                                {products.brand.name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">{products.kategoriproduct.name}</p>
                                        <p className="text-sm text-gray-500">{products.jenisproduct.name}</p>
                                        <p className="text-sm text-gray-500">{products.description}</p>
                                    </div>
                                    <div className="flex-1 w-full items-center justify-between pt-4">
                                        <div className="flex justify-end gap-2">
                                            <UpdateProduct id={products.id} />
                                            <DeleteAlertProduct id={products.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                        <TableHeader className="rounded-lg text-[14px]">
                            <TableRow>
                                <TableHead className="py-8 items-center dark:text-white font-bold">No</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Part Number</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Part Name</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Description</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Entry Unit</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Stock Unit</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Out Unit</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Min Stock</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Max Stock</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Type </TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Category</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Group Product</TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Brand </TableHead>
                                <TableHead className="items-center dark:text-white font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {products.map((products, index) => (
                                <TableRow key={products.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell>{products.part_number}</TableCell>
                                    <TableCell>{products.part_name}</TableCell>
                                    <TableCell>{products.description}</TableCell>
                                    <TableCell className="text-center">{products.satuan_pemasukan}</TableCell>
                                    <TableCell className="text-center">{products.satuan_penyimpanan}</TableCell>
                                    <TableCell className="text-center">{products.satuan_pengeluaran}</TableCell>
                                    <TableCell className="text-center">{products.minStock}</TableCell>
                                    <TableCell className="text-center">{products.maxStock}</TableCell>
                                    <TableCell >{products.jenisproduct.name}</TableCell>
                                    <TableCell >{products.kategoriproduct.name}</TableCell>
                                    <TableCell >{products.group.name}</TableCell>
                                    <TableCell >{products.brand.name}</TableCell>
                                    <TableCell className="flex items-center justify-center object-center gap-2">
                                        <UpdateProduct id={products.id} />
                                        <DeleteAlertProduct id={products.id} />
                                    </TableCell>
                                </TableRow >
                            ))}

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}