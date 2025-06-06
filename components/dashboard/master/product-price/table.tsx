
import { FetchPriceAll } from '@/data/master/price';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils";
import DeleteAlertPrice from './delete-alert';
import { UpdatePrice } from './buttons';


const ITEMS_PER_PAGE_PRICE = 30;

const PriceTable = async ({ query, currentPage }: { query: string; currentPage: number }) => {
    const price = await FetchPriceAll(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRICE;

    function formatCurrency(value: number, currency: string) {
        const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(value);
        // Menambahkan spasi antara simbol dan angka
        return formattedValue.replace(/(\D)(\d)/, '$1 $2');
    }
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <div className="md:hidden">
                        {price.map((data) => (
                            <div
                                key={data.id}
                                className="mb-2 w-full rounded-md p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-1">
                                    <div>
                                        <div className="mb-2 flex items-center text-blue-600">
                                            <p>{data.part_number.part_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium pt-1">
                                                {data.hargaHpp.toString()}  &nbsp;
                                                {data.hargaJual.toString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium pb-2">
                                                {formatDate(data.createdAt.toString())}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="flex-1 w-full items-center justify-between pt-4">
                                        <div className="flex justify-end gap-2">
                                            <UpdatePrice id={data.id} />
                                            <DeleteAlertPrice id={data.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-0 grid grid-cols-1 sm:grid-cols-4 items-center justify-center space-between '>
                        <div className="flex pt-2 pb-0 gap-2">
                            <div className="flex-initial w-96 text-xs mb-2 text-blue-700 italic md:text-nowrap">
                                <span>Data Products price</span>
                            </div>
                        </div>
                    </div>

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader className="border text-[12px]">
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead className="px-4 py-4 font-medium items-center uppercase">No</TableHead>
                                <TableHead className="px-2 font-medium uppercase">Part Number</TableHead>
                                <TableHead className="px-2 font-medium uppercase">Group Name</TableHead>
                                <TableHead className="px-2 font-medium text-center uppercase">HPP Price</TableHead>
                                <TableHead className="px-2 py-4 font-medium text-center items-center uppercase">Selling Price</TableHead>
                                <TableHead className="px-2 py-4 font-medium text-center items-center uppercase">Created</TableHead>
                                <TableHead className="px-2 py-4 font-medium text-center items-center uppercase">Updated</TableHead>
                                <TableHead className="px-2 py-4 font-medium text-center items-center uppercase">ACTION</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="rounded-lg text-[12px]">
                            {price.map((data, index) => (
                                <TableRow key={data.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell>{data.part_number.part_name} <br/> 
                                    <span className="text-xs text-gray-500">{data.part_number.part_number}</span>
                                    </TableCell>
                                    <TableCell>{data.part_number.group.name}</TableCell>
                                    <TableCell className='text-right items-center'>{formatCurrency(Number(data.hargaHpp), data.mtUang.note)}</TableCell>
                                    <TableCell className='text-right items-center'>{formatCurrency(Number(data.hargaJual), data.mtUang.note)}</TableCell>
                                    <TableCell className="text-center">{formatDate(data.createdAt.toString())}</TableCell>
                                    <TableCell className="text-center">{formatDate(data.updatedAt.toString())}</TableCell>
                                    <TableCell className="flex items-center justify-center gap-2">
                                        <UpdatePrice id={data.id} />
                                        <DeleteAlertPrice id={data.id}/>
                                    </TableCell>
                                </TableRow >
                            ))}

                    </TableBody>
                </Table>
            </div>
        </div>
        </div >
    )
}

export default PriceTable;