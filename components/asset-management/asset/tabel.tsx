import React from "react"; // Pastikan React di-import
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
import { Card } from "@/components/ui/card";

export default async function AssetTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const data = await fetchAssetList(query, currentPage);
    // Handle error jika data bukan array
    if (!Array.isArray(data)) {
        console.error("Failed to fetch asset list:", data.error);
        return <div>Error: {data.error}</div>; // Tampilkan pesan error
    }

    // Kelompokkan data berdasarkan departemen
    const groupedData = data.reduce((acc, item) => {
        const deptName = item.department?.dept_name || "Unassigned"; // Jika tidak ada departemen, masukkan ke grup 'Unassigned'
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(item);
        return acc;
    }, {} as Record<string, typeof data>);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    {/* Tampilan Mobile */}
                    <div className="md:hidden">
                        {Array.isArray(data) &&
                            data.map((data) => (
                                <Card
                                    key={data.id}
                                    className="mb-2 w-full rounded-md p-4 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
                                >
                                    <div className="grid grid-cols-1 items-center justify-between border-b pb-1">
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
                                                    {data.product.part_name} &nbsp;
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="flex-none text-sm pb-2"> {data.location}</p>{" "}
                                                &nbsp;
                                                <p className="flex-none text-sm font-bold text-gray-500">
                                                    {data.assetType.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="flex-none text-sm font-bold text-gray-500">
                                                    {data.employee?.name}
                                                </p>{" "}
                                                &nbsp;
                                                <p className="flex-nonetext-sm text-gray-500">
                                                    {data.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full items-center justify-between pt-2">
                                            <div className="flex items-center justify-end gap-2 ">
                                                <UpdateAssetLink id={data.id} />
                                                <DeleteAlertProduct id={data.id} />
                                                <Link
                                                    href={`/dashboard/asset/generate-pdf/${data.id}`}
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="text-green-700 rounded-md border p-2 hover:bg-green-800 h-8 text-center hover:text-white flex justify-center items-center"
                                                    >
                                                        <PrinterIcon className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>

                    {/* Tampilan Desktop */}
                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader>
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead className="text-black py-8 items-center dark:text-white font-bold uppercase">
                                    No
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Asset Number
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Description
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Asset Type
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Useful Life
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    User Name
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Department
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Location
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Cost Purchase
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Date Purchase
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Status
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Asset Image
                                </TableHead>
                                <TableHead className="text-black items-center dark:text-white font-bold uppercase">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Object.entries(groupedData).map(([deptName, items]) => {

                                return (
                                    <React.Fragment key={deptName}>
                                        {/* Header untuk grup departemen */}
                                        <TableRow className="bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                            <TableCell colSpan={13} className="font-bold text-lg text-left py-2 text-orange-900 dark:text-orange-100">
                                                🏤 {deptName}
                                            </TableCell>
                                        </TableRow>

                                        {/* Data untuk setiap departemen */}
                                        {items.map((data, index) => {
                                            const groupItemIndex = index + 1; // Nomor urut dalam grup

                                            return (
                                                <TableRow key={`${deptName}-${data.id}`}>
                                                    <TableCell className="text-left text-nowrap">
                                                        {groupItemIndex} {/* Format: Global - [Grup] */}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-nowrap">
                                                        🎫 {data.assetNumber}
                                                    </TableCell>
                                                    <TableCell>{data.product.part_number}</TableCell>
                                                    <TableCell className="text-center">
                                                        🚪 {data.assetType.name}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {data.usefulLife}
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        👨‍💻 {data.employee?.name}
                                                    </TableCell>
                                                    <TableCell className="text-left">
                                                        {data.department?.dept_name}
                                                    </TableCell>
                                                    <TableCell>{data.location}</TableCell>
                                                    <TableCell>
                                                        {formatCurrencyQtt(Number(data.purchaseCost?.toString()))}
                                                    </TableCell>
                                                    <TableCell>
                                                        {data.purchaseDate?.toDateString()}
                                                    </TableCell>
                                                    <TableCell>{data.status}</TableCell>
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
                                                        <UpdateAssetLink id={data.id} />
                                                        <DeleteAlertProduct id={data.id} />
                                                        <Link
                                                            href={`/dashboard/asset/generate-pdf/${data.id}`}
                                                            passHref
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="text-green-700 rounded-md border p-2 hover:bg-green-800 h-8 text-center hover:text-white flex justify-center items-center"
                                                            >
                                                                <PrinterIcon className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}