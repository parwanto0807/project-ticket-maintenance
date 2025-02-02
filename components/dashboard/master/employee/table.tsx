import { getEmployeesFindAll } from "@/data/master/employee";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { UpdateEmployee } from "./buttons";
import DeleteAlert from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
const ITEMS_PER_PAGE_EMPLOYEES = 30;

export default async function EmployeeTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const employees = await getEmployeesFindAll(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_EMPLOYEES;

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                    <div className="md:hidden">
                        {Array.isArray(employees) && employees.map((employees) => (
                            <div
                                key={employees.id}
                                className="mb-2 w-full rounded-md p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <Image
                                                src={employees.picture}
                                                className="mr-2 rounded-full"
                                                width={28}
                                                height={28}
                                                alt={`${employees.name}'s profile picture`}
                                            />
                                            <p>{employees.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium pt-2">
                                                {employees.department.dept_name}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">{employees.email}</p>
                                        <p className="text-sm text-gray-500">{employees.address}</p>
                                    </div>


                                    <div className="flex-1 w-full items-center justify-between pt-4">
                                        <div className="flex justify-end gap-2">
                                            <UpdateEmployee id={employees.id} />
                                            <DeleteAlert id={employees.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-0 grid grid-cols-1 sm:grid-cols-4 items-center justify-center space-between '>
                        <div className="flex pt-2 pb-0 gap-4">
                            <div className="flex-initial w-96 text-xs  text-blue-700 italic md:text-nowrap">
                                <span>Data master employee</span>
                            </div>
                        </div>
                    </div>
                    
                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900">
                        <TableHeader className="rounded-lg text-left text-sm font-normal">
                            <TableRow>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">No</TableHead>
                                <TableHead scope="col" className="px-4 py-5 font-medium sm:pl-6 uppercase">Employee </TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Address</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Department</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Created</TableHead>
                                <TableHead scope="col" className="relative py-3 pl-6 pr-3 font-medium uppercase"> Action </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(employees) && employees.map((employees, index) => (
                                <TableRow key={employees.id}>
                                    <TableCell className="whitespace-nowrap px-3 py-2">{offset + index + 1}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-2">
                                        <div className="flex item-center gap-2">
                                            <Image
                                                src={employees.picture || "/noavatar.png"}
                                                alt={`${employees.name}'s profile picture`}
                                                width={50}
                                                height={30}
                                                className="rounded-lg mr-2"
                                            />
                                            <div>
                                                <p>{employees.name}</p><br />
                                                <p>{employees.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{employees.address}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{employees.department.dept_name}</TableCell>
                                    <TableCell className="whitespace-nowrap px-3 py-3">{formatDate(employees.createdAt.toString())}</TableCell>
                                    <TableCell className=" flex justify-center gap-1 py-3">
                                        <UpdateEmployee id={employees.id} />
                                        <DeleteAlert id={employees.id} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
