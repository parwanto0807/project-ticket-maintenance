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
                            <div className="flex items-center space-x-2 mb-3 p-3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-lg">
                                <div className="w-1 h-6 bg-white rounded-full"></div>
                                <h2 className="text-lg font-bold text-white">🏢 {deptName}</h2>
                                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                    {employees.length} employees
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {employees.map((employee, index) => (
                                    <Card 
                                        key={employee.id}
                                        className="bg-white/80 backdrop-blur-sm border-l-4 border-l-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/80 dark:border-l-indigo-400"
                                    >
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                {/* Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                            #{offset + index + 1}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-16 h-16 overflow-hidden rounded-lg border border-indigo-200 dark:border-indigo-800">
                                                        <ImageDialogEmployee
                                                            src={employee.picture || "/noImage.jpg"}
                                                            alt={`${employee.name} Employee Image`}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                                            {employee.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                            {employee.department.dept_name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">📧 App Email:</span>
                                                            <p className="font-medium text-blue-600 dark:text-blue-400 truncate">
                                                                {employee.email}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 dark:text-slate-400">🏢 Corporate Email:</span>
                                                            <p className="font-medium text-blue-600 dark:text-blue-400 truncate">
                                                                {employee.emailCorporate}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <span className="text-slate-500 dark:text-slate-400">📍 Address:</span>
                                                        <p className="font-medium text-slate-900 dark:text-white line-clamp-2">
                                                            {employee.address}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <span className="text-slate-500 dark:text-slate-400">📅 Created:</span>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {formatDate(employee.createdAt.toString())}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                                    <UpdateEmployee id={employee.id} />
                                                    <DeleteAlert id={employee.id} />
                                                </div>
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
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        Data Master Employee
                                    </Badge>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        Total: {employees.length} employees
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Table className="border-separate border-spacing-0">
                            <TableHeader>
                                <TableRow className="bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 dark:from-sky-500 dark:to-indigo-700 dark:hover:from-sky-600 dark:hover:to-indigo-800">
                                    <TableHead className="w-12 text-white font-semibold border-r border-white/30 py-4 text-center">
                                        No
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Photo
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Employee
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Address
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        App Email
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Corporate Email
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Department
                                    </TableHead>
                                    <TableHead className="text-white font-semibold border-r border-white/30 py-4">
                                        Created
                                    </TableHead>
                                    <TableHead className="text-white font-semibold py-4 text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-transparent">
                                {Object.entries(groupedEmployees).map(([deptName, employees]) => (
                                    <React.Fragment key={deptName}>
                                        {/* Department Header */}
                                        <TableRow className="bg-gradient-to-r from-sky-50 to-indigo-100 hover:from-sky-100 hover:to-indigo-200 dark:from-indigo-900/20 dark:to-sky-800/20 dark:hover:from-indigo-800/30 dark:hover:to-sky-700/30">
                                            <TableCell 
                                                colSpan={9} 
                                                className="font-bold text-lg text-indigo-900 dark:text-indigo-100 py-3 px-6 border-b border-indigo-200 dark:border-indigo-700"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                                                    <span>🏢 {deptName}</span>
                                                    <Badge variant="secondary" className="ml-2 bg-indigo-500 text-white">
                                                        {employees.length} employees
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Department Data */}
                                        {employees.map((employee, index) => (
                                            <TableRow 
                                                key={employee.id}
                                                className="bg-white/50 hover:bg-sky-50/80 dark:bg-slate-800/50 dark:hover:bg-indigo-900/20 transition-colors duration-200 border-b border-slate-200/50 dark:border-slate-700/50"
                                            >
                                                <TableCell className="text-center font-medium text-slate-600 dark:text-slate-400 py-3">
                                                    {offset + index + 1}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="w-12 h-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
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