
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
import { formatCurrencyQtt } from "@/lib/utils";
import ImageDialog from "./imageDialog";

const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function AssetTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchAssetList(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <div className="md:hidden">
                        {Array.isArray(data) && data.map((data) => (
                            <div
                                key={data.id}
                                className="mb-2 w-full rounded-md p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-1">
                                    <div>
                                        <div className="mb-2 flex items-center font-bold text-black dark:text-white">
                                            <p>{data.assetNumber}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 overflow-hidden rounded">
                                                <ImageDialog
                                                    src={data.assetImage1 || "/noImage.jpg"}
                                                    alt={`${data.assetNumber} Asset Image`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm pt-1">
                                                {data.product.part_name}  &nbsp;
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="flex-none text-sm pb-2"> {data.location}</p>  &nbsp;
                                            <p className="flex-none text-sm font-bold text-gray-500">{data.assetType.name}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <p className="flex-none text-sm font-bold text-gray-500">{data.employee?.name}</p> &nbsp;
                                            <p className="flex-nonetext-sm text-gray-500">{data.status}</p>
                                        </div>
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

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black py-8 items-center dark:text-white font-bold uppercase">No</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Asste Number</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Part Name</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Description</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Asset type</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Usefull Life</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">User Name</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Location</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Cost Purchase </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Date Purchase</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Status</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Asset Image</TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Array.isArray(data) && data.map((data, index) => (
                                <TableRow key={data.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell className="text-center font-bold text-nowrap">{data.assetNumber}</TableCell>
                                    <TableCell>{data.product.part_number}</TableCell>
                                    <TableCell>{data.product.part_name}</TableCell>
                                    <TableCell className="text-center">{data.assetType.name}</TableCell>
                                    <TableCell className="text-center">{data.usefulLife}</TableCell>
                                    <TableCell className="text-left">{data.employee?.name}</TableCell>
                                    <TableCell >{data.location}</TableCell>
                                    <TableCell >{formatCurrencyQtt(Number(data.purchaseCost?.toString()))}</TableCell>
                                    <TableCell >{data.purchaseDate?.toDateString()}</TableCell>
                                    <TableCell >{data.status}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 overflow-hidden rounded">
                                                <ImageDialog
                                                    src={data.assetImage1 || "/noImage.jpg"}
                                                    alt={`${data.assetNumber} Asset Image`}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
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