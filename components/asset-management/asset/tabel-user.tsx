"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FaArchive,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaBox,
  FaClock,
  FaToolbox
} from "react-icons/fa";
import {
  HiStatusOnline,
  HiStatusOffline,
} from "react-icons/hi";
import ImageDialog from "./imageDialog";
import { formatCurrencyQtt } from "@/lib/utils";
import Pagination from "@/components/ui/pagination";

interface AssetData {
  id: string;
  assetNumber: string;
  assetImage1?: string;
  product: { part_number: string; part_name: string };
  assetType: { name: string };
  usefulLife: string | number;
  employee?: { name: string };
  department?: { dept_name: string };
  location: string;
  purchaseCost?: number;
  purchaseDate?: Date;
  status: string;
}

interface DashboardDataProps {
  query: string;
  currentPage: number;
}

const ITEMS_PER_PAGE_ASSET = 5;

export default function AssetUserTable({ query, currentPage }: DashboardDataProps) {
  const user = useCurrentUser();
  const email = user?.email || "";
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE_ASSET;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/asset/list?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`
        );
        if (!res.ok) {
          throw new Error("Gagal mengambil data asset");
        }
        const json = await res.json();
        setData(json.assets || []);
        setTotalPages(json.totalPages && json.totalPages > 0 ? json.totalPages : 1);
      } catch (error) {
        console.error("Error fetching asset list:", error);
      } finally {
        setLoading(false);
      }
    }

    if (email) {
      fetchData();
    }
  }, [query, currentPage, email]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_USE":
        return <HiStatusOnline className="w-4 h-4 text-green-500" />;
      case "AVAILABLE":
        return <HiStatusOnline className="w-4 h-4 text-blue-500" />;
      case "UNDER_MAINTENANCE":
        return <FaToolbox className="w-4 h-4 text-yellow-500" />;
      case "DECOMMISSIONED":
        return <HiStatusOffline className="w-4 h-4 text-red-500" />;
      default:
        return <FaToolbox className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-2";

    switch (status) {
      case "IN_USE":
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
      case "AVAILABLE":
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      case "UNDER_MAINTENANCE":
        return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case "DECOMMISSIONED":
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl p-2 md:pt-4 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-lg border border-orange-100 dark:border-slate-700 mx-auto max-w-7xl">

          {/* Mobile View: Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4 p-2">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item) => (
                <Card
                  key={item.id}
                  className="mb-2 rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs uppercase h-7 border-orange-500 bg-orange-50 text-orange-700 flex items-center gap-2"
                        >
                          <FaArchive className="w-3 h-3" />
                          {item.assetNumber}
                        </Badge>
                      </div>
                      <div className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="hidden sm:inline">
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border-2 border-orange-200 dark:border-slate-600">
                        <ImageDialog
                          src={item.assetImage1 || "/noImage.jpg"}
                          alt={`${item.assetNumber} Asset Image`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {item.product.part_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.product.part_number}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <FaBox className="w-3 h-3 text-orange-500" />
                            <span className="text-gray-600 dark:text-gray-300">{item.assetType.name}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <FaMapMarkerAlt className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-300">{item.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <FaUser className="w-3 h-3 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.employee?.name || "Unassigned"}
                            </span>
                          </div>

                          {item.department && (
                            <div className="flex items-center gap-2 text-xs">
                              <FaBuilding className="w-3 h-3 text-purple-500" />
                              <span className="text-gray-600 dark:text-gray-300">{item.department.dept_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No assets found
              </div>
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="pb-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-orange-500 text-white">
                      <FaArchive className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Asset Management
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                    Comprehensive overview of user-assigned assets and equipment
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="rounded-xl border border-orange-100 dark:border-slate-700 overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-500 border-0">
                        <TableHead className="text-white font-bold uppercase text-xs py-4 text-center border-0">
                          #
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 flex items-center gap-2">
                          <FaArchive className="w-3 h-3" />
                          Asset ID
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                          Part Info
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                          <FaBox className="w-3 h-3 inline mr-2" />
                          Type
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                          <FaClock className="w-3 h-3 inline mr-2" />
                          Life
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                          <FaUser className="w-3 h-3 inline mr-2" />
                          User
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                          <FaBuilding className="w-3 h-3 inline mr-2" />
                          Department
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                          <FaMapMarkerAlt className="w-3 h-3 inline mr-2" />
                          Location
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-right">
                          <FaDollarSign className="w-3 h-3 inline mr-2" />
                          Cost
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                          <FaCalendarAlt className="w-3 h-3 inline mr-2" />
                          Date
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                          Image
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white/80 dark:bg-slate-800/80">
                      {Array.isArray(data) && data.length > 0 ? (
                        data.map((item, index) => (
                          <TableRow
                            key={item.id}
                            className="border-b border-orange-50 dark:border-slate-700/50 hover:bg-orange-50/50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <TableCell className="text-center text-sm font-medium text-gray-900 dark:text-white py-4">
                              {offset + index + 1}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <FaArchive className="w-3 h-3 text-orange-500" />
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                  {item.assetNumber}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {item.product.part_name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.product.part_number}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {item.assetType.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center text-sm text-gray-600 dark:text-gray-300 py-4">
                              {item.usefulLife}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <FaUser className="w-3 h-3 text-green-500" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {item.employee?.name || "-"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {item.department ? (
                                <div className="flex items-center gap-2">
                                  <FaBuilding className="w-3 h-3 text-purple-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.department.dept_name}
                                  </span>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="w-3 h-3 text-blue-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {item.location}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium text-gray-900 dark:text-white py-4">
                              {formatCurrencyQtt(Number(item.purchaseCost?.toString()))}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-300 py-4">
                              {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <div className={getStatusBadge(item.status)}>
                                  {getStatusIcon(item.status)}
                                  <span className="hidden lg:inline">
                                    {item.status.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex justify-center">
                                <div className="w-12 h-12 overflow-hidden rounded-lg border-2 border-orange-200 dark:border-slate-600 hover:border-orange-500 transition-colors">
                                  <ImageDialog
                                    src={item.assetImage1 || "/noImage.jpg"}
                                    alt={`${item.assetNumber} Asset Image`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center gap-2">
                              <FaArchive className="w-8 h-8 text-gray-300" />
                              No assets found matching your criteria
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 px-4">
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}