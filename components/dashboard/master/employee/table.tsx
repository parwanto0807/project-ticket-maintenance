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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ITEMS_PER_PAGE_EMPLOYEES = 30;

export default async function EmployeeTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const employees = await getEmployeesFindAll(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_EMPLOYEES;

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
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {Object.entries(groupedEmployees).map(([deptName, employees]) => (
                        <div key={deptName}>
                            <div className="flex items-center space-x-2 mb-3 px-1">
                                <div className="w-1.5 h-5 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">{deptName}</h2>
                                <Badge variant="outline" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700">
                                    {employees.length}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {employees.map((employee, index) => (
                                    <Card
                                        key={employee.id}
                                        className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm shrink-0">
                                                    <ImageDialogEmployee
                                                        src={employee.picture || "/noImage.jpg"}
                                                        alt={`${employee.name} Employee Image`}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 truncate">
                                                            {employee.name}
                                                        </h3>
                                                        <span className="text-[10px] font-bold text-zinc-400">#{offset + index + 1}</span>
                                                    </div>
                                                    <Badge variant="blue" className="text-[9px] h-4 py-0">
                                                        {employee.department.dept_name}
                                                    </Badge>
                                                    <div className="pt-2 space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[150px] text-xs">
                                                                {employee.emailCorporate || employee.email}
                                                            </div>
                                                            <Link
                                                                href={`/dashboard/asset/asset-list?userName=${encodeURIComponent(employee.name)}`}
                                                                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-[10px] border border-blue-100 dark:border-blue-800"
                                                            >
                                                                Assets: {employee._count?.asset || 0}
                                                            </Link>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 italic">
                                                            {employee.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                                                <UpdateEmployee id={employee.id} />
                                                <DeleteAlert id={employee.id} />
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
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="bg-blue-50/50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                        Data Master Employee
                                    </Badge>
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                                        TOTAL: {employees.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-zinc-50 dark:bg-zinc-900 transition-colors">
                                    <TableHead className="w-12 text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4 text-center">
                                        No
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Photo
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Employee
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Address
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        App Email
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Corporate Email
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Department
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4">
                                        Created
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4 text-center">
                                        Assets
                                    </TableHead>
                                    <TableHead className="text-zinc-900 dark:text-zinc-100 font-bold border-b border-zinc-200 dark:border-zinc-800 py-4 text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-transparent">
                                {Object.entries(groupedEmployees).map(([deptName, employees]) => (
                                    <React.Fragment key={deptName}>
                                        {/* Department Header */}
                                        <TableRow className="bg-zinc-100/30 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
                                            <TableCell
                                                colSpan={9}
                                                className="py-3 px-6 border-b border-zinc-200 dark:border-zinc-800"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-1.5 h-6 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                                                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">🏢 {deptName}</span>
                                                    <Badge variant="blue" className="ml-2 font-semibold">
                                                        {employees.length} Members
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Department Data */}
                                        {employees.map((employee, index) => (
                                            <TableRow
                                                key={employee.id}
                                                className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition-all duration-300 border-b border-zinc-100 dark:border-zinc-800/50"
                                            >
                                                <TableCell className="text-center font-medium text-zinc-500 dark:text-zinc-400 py-3">
                                                    {offset + index + 1}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="w-12 h-12 overflow-hidden rounded-xl border-2 border-zinc-100 dark:border-zinc-800 group-hover:border-blue-500/30 transition-colors duration-300 shadow-sm">
                                                        <ImageDialogEmployee
                                                            src={employee.picture || "/noImage.jpg"}
                                                            alt={`${employee.name} Employee Image`}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {employee.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 text-slate-700 dark:text-slate-300 max-w-xs">
                                                    <div className="line-clamp-2">
                                                        {employee.address}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-blue-600 dark:text-blue-400">
                                                        {employee.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-blue-600 dark:text-blue-400">
                                                        {employee.emailCorporate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                                                        {employee.department.dept_name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3 text-slate-700 dark:text-slate-300">
                                                    {formatDate(employee.createdAt.toString())}
                                                </TableCell>
                                                <TableCell className="py-3 text-center">
                                                    <Link
                                                        href={`/dashboard/asset/asset-list?userName=${encodeURIComponent(employee.name)}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 border border-blue-200 dark:border-blue-800 shadow-sm"
                                                    >
                                                        <span>{employee._count?.asset || 0}</span>
                                                        <span className="text-[10px] uppercase opacity-70 font-bold">Asset</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        <UpdateEmployee id={employee.id} />
                                                        <DeleteAlert id={employee.id} />
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