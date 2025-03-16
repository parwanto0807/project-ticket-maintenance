import { getEmployeesFindAll } from "@/data/master/employee";
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
import ImageDialogEmployee from "./imageDialog";
import React from "react";
import { Card } from "@/components/ui/card";

const ITEMS_PER_PAGE_EMPLOYEES = 30;

export default async function EmployeeTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const employees = await getEmployeesFindAll(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_EMPLOYEES;

    // Group employees by department
    const groupedEmployees = employees.reduce((acc, employee) => {
        const deptName = employee.department.dept_name;
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(employee);
        return acc;
    }, {} as Record<string, typeof employees>);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <div className="md:hidden">
                        {Object.entries(groupedEmployees).map(([deptName, employees]) => (
                            <div key={deptName}>
                                <h2 className="text-lg font-bold mt-4 mb-2 text-left py-2 text-orange-900 dark:text-orange-100 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">{deptName}</h2>
                                {employees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="mb-2 w-full rounded-md p-1"
                                    >
                                        <Card className="grid grid-cols-1 items-center justify-between border-b p-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 overflow-hidden rounded items-center justify-center">
                                                        <ImageDialogEmployee
                                                            src={employee.picture || "/noImage.jpg"}
                                                            alt={`${employee.name} Asset Image`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium pt-2">
                                                        {employee.name}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">{employee.email}</p>
                                                <p className="text-sm text-gray-500">{employee.address}</p>
                                            </div>
                                            <div className="w-full items-center justify-between pt-1">
                                                <div className="flex justify-end gap-2">
                                                    <UpdateEmployee id={employee.id} />
                                                    <DeleteAlert id={employee.id} />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className='mt-0 grid grid-cols-1 sm:grid-cols-4 items-center justify-center space-between '>
                        <div className="flex pt-2 pb-0 gap-4">
                            <div className="flex-initial w-96 text-xs text-blue-700 italic md:text-nowrap">
                                <span>Data master employee</span>
                            </div>
                        </div>
                    </div>

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader className="rounded-lg text-left text-sm font-normal">
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">No</TableHead>
                                <TableHead scope="col" className="px-4 py-5 font-medium sm:pl-6 uppercase"># </TableHead>
                                <TableHead scope="col" className="px-4 py-5 font-medium sm:pl-6 uppercase">Employee </TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Address</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Email For App</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Email Corporate</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Department</TableHead>
                                <TableHead scope="col" className="px-3 py-5 font-medium uppercase">Created</TableHead>
                                <TableHead scope="col" className="relative py-3 pl-6 pr-3 font-medium uppercase"> Action </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="rounded-lg text-[12px]">
                            {Object.entries(groupedEmployees).map(([deptName, employees]) => (
                                <React.Fragment key={deptName}>
                                    {/* Baris untuk judul departemen */}
                                    <TableRow className="bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                        <TableCell colSpan={9} className="font-bold text-lg rounded-md">
                                           🏢 {deptName}
                                        </TableCell>
                                    </TableRow>
                                    {/* Baris untuk setiap karyawan di departemen tersebut */}
                                    {employees.map((employee, index) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="whitespace-nowrap px-3 py-2">{offset + index + 1}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 overflow-hidden rounded">
                                                        <ImageDialogEmployee
                                                            src={employee.picture || "/noImage.jpg"}
                                                            alt={`${employee.name} Asset Image`}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 font-bold">{employee.name}</TableCell>
                                            <TableCell className="whitespace px-3 py-3">{employee.address}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-blue-700 font-bold">{employee.email}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-blue-700 font-bold">{employee.emailCorporate}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3">{employee.department.dept_name}</TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3">{formatDate(employee.createdAt.toString())}</TableCell>
                                            <TableCell className="flex justify-center gap-1 py-3">
                                                <UpdateEmployee id={employee.id} />
                                                <DeleteAlert id={employee.id} />
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