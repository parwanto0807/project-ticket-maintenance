
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
import { fetchAssetList } from "@/data/asset/asset";


const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function AssetTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchAssetList(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    //console.log(data)
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                    <div className="md:hidden">
                        {Array.isArray(data) && data.map((data) => (
                            <div
                                key={data.id}
                                className="mb-2 w-full rounded-md p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-1">
                                    <div>
                                        <div className="mb-2 flex items-center text-black dark:text-white">
                                            <p>{data.assetNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm pt-1">
                                                {data.product.part_name}  &nbsp;
                                                {data.description}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm pb-2">
                                                {data.location}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">{data.assetType.name}</p>
                                        <p className="text-sm text-gray-500">{data.employee?.name}</p>
                                        <p className="text-sm text-gray-500">{data.status}</p>
                                    </div>
                                    <div className="flex-1 w-full items-center justify-between pt-4">
                                        <div className="flex justify-end gap-2">
                                            <UpdateProduct id={data.id} />
                                            <DeleteAlertProduct id={data.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black py-8 items-center dark:text-white font-bold uppercase">No</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Asste Number</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Part Number</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Part Name</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Description</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Asset type</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Category</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">UsefullLife</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">User Name</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Location</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Cost Purchase </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Date Purchase</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Status</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Array.isArray(data) && data.map((data, index) => (
                                <TableRow key={data.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell className="text-center font-bold">{data.assetNumber}</TableCell>
                                    <TableCell>{data.product.part_number}</TableCell>
                                    <TableCell>{data.product.part_name}</TableCell>
                                    <TableCell>{data.description}</TableCell>
                                    <TableCell className="text-center">{data.assetType.name}</TableCell>
                                    <TableCell className="text-center">{data.category}</TableCell>
                                    <TableCell className="text-center">{data.usefulLife}</TableCell>
                                    <TableCell className="text-center">{data.employee?.name}</TableCell>
                                    <TableCell >{data.location}</TableCell>
                                    <TableCell >{data.purchaseCost}</TableCell>
                                    <TableCell >{data.purchaseDate?.toDateString()}</TableCell>
                                    <TableCell >{data.status}</TableCell>
                                    <TableCell className="flex items-center justify-center object-center gap-2">
                                        <UpdateProduct id={data.id} />
                                        <DeleteAlertProduct id={data.id} />
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