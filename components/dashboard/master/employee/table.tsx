"use client";

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

export default function EmployeeTable({ employees, loading, currentPage }: { employees: any[]; loading: boolean; currentPage: number; }) {
    if (loading) {
        return <div className="py-20 text-center font-medium text-slate-500">Loading employees...</div>;
    }

    if (!employees || employees.length === 0) {
        return <div className="py-20 text-center font-medium text-slate-500">No employees found.</div>;
    }

    const offset = (currentPage - 1) * ITEMS_PER_PAGE_EMPLOYEES;

    const groupedEmployees = employees.reduce((acc: Record<string, any[]>, employee: any) => {
        const deptName = employee.department.dept_name;
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(employee);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="mt-6 flow-root">
            <div className="min-w-full align-middle">
                {/* Mobile View */}
                <div className="lg:hidden space-y-6">
                    {Object.entries(groupedEmployees).map(([deptName, deptEmployees]) => (
                        <div key={deptName} className="px-2">
                            <div className="flex items-center space-x-2 mb-4 px-1">
                                <div className="w-1.5 h-6 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{deptName}</h2>
                                <Badge variant="outline" className="text-[10px] font-bold bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-sm">
                                    {deptEmployees.length}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {deptEmployees.map((employee, index) => (
                                    <Card
                                        key={employee.id}
                                        className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                                    >
                                        <CardContent className="p-0 flex-1 flex flex-col">
                                            {/* Header Section: Avatar & Basic Info */}
                                            <div className="pt-5 pb-3 flex flex-col items-center gap-2.5 relative">
                                                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-[9px] font-black text-zinc-400">{(offset + index + 1).toString().padStart(2, '0')}</span>
                                                </div>
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full border-2 border-blue-100 dark:border-blue-900/50 group-hover:border-blue-500 transition-colors duration-300 shadow-sm bg-zinc-50 dark:bg-zinc-900">
                                                    <ImageDialogEmployee
                                                        src={employee.picture || "/noImage.jpg"}
                                                        alt={`${employee.name} Employee Image`}
                                                    />
                                                </div>
                                                <div className="text-center px-3 w-full">
                                                    <h3 className="font-bold text-[13px] sm:text-sm text-zinc-900 dark:text-zinc-50 leading-tight line-clamp-2 min-h-[32px] flex items-center justify-center tracking-tight">
                                                        {employee.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center justify-center gap-1">
                                                        <Badge variant="blue" className="text-[8px] h-4 py-0 px-1.5 leading-none uppercase tracking-tighter bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                                            {employee.department.dept_name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Section */}
                                            <div className="px-3 pb-4 flex-grow space-y-3">
                                                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                                                    <div className="flex flex-col items-center">
                                                        <div className="font-semibold text-blue-600 dark:text-blue-400 text-[10px] break-all text-center leading-none">
                                                            {employee.emailCorporate || employee.email}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Link
                                                            href={`/dashboard/asset/asset-list?userName=${encodeURIComponent(employee.name)}`}
                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-[10px] border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                                        >
                                                            <span className="opacity-70 uppercase tracking-tighter">Assets</span>
                                                            <span className="text-xs">{employee._count?.asset || 0}</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions footer */}
                                            <div className="grid grid-cols-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
                                                <UpdateEmployee id={employee.id} className="rounded-none border-0 border-r border-zinc-100 dark:border-zinc-800 h-10 bg-transparent dark:bg-transparent" />
                                                <DeleteAlert id={employee.id} className="rounded-none border-0 h-10 bg-transparent dark:bg-transparent" />
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
                                {Object.entries(groupedEmployees).map(([deptName, deptEmployees]) => (
                                    <React.Fragment key={deptName}>
                                        {/* Department Header */}
                                        <TableRow className="bg-zinc-100/30 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
                                            <TableCell
                                                colSpan={10}
                                                className="py-3 px-6 border-b border-zinc-200 dark:border-zinc-800"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-1.5 h-6 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                                                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">🏢 {deptName}</span>
                                                    <Badge variant="blue" className="ml-2 font-semibold">
                                                        {deptEmployees.length} Members
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Department Data */}
                                        {deptEmployees.map((employee, index) => (
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