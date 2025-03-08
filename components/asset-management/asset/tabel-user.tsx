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
import { FaArchive } from "react-icons/fa";
import ImageDialog from "./imageDialog";
import { formatCurrencyQtt } from "@/lib/utils";

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
const ITEMS_PER_PAGE_ASSET = 10;

export default function AssetUserTable({ query, currentPage }: DashboardDataProps) {
  const user = useCurrentUser();
  const email = user?.email || "";
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_ASSET;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/asset/list?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data asset");
        }
        const json = await res.json();
        setData(json);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-0 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-0 md:pt-0 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
          {/* Mobile View: Setiap item tampil sebagai Card individual */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {Array.isArray(data) &&
              data.map((item) => (
                <Card key={item.id} className="mb-0 rounded-md border bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-left justify-start gap-4">
                        <Badge
                          variant="secondary"
                          className="font-mono tracking-widest text-[10px] uppercase h-8 border-orange-500 flex items-center gap-2"
                        >
                          <FaArchive className="w-4 h-4" />
                          {item.assetNumber}
                        </Badge>
                      </div>
                      {/* Status di paling kanan */}
                      <div
                        className={`px-2 py-1 text-xs rounded-md
                        ${
                          item.status === "DECOMMISSIONED"
                            ? "bg-red-100 text-red-500"
                            : item.status === "AVAILABLE"
                            ? "bg-blue-100 text-blue-500"
                            : item.status === "IN_USE"
                            ? "bg-green-100 text-green-500"
                            : item.status === "UNDER_MAINTENANCE"
                            ? "bg-red-100 text-red-500"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-start pt-2 pb-2">
                      <div className="max-w-16 max-h-16 overflow-hidden rounded">
                        <ImageDialog
                          src={item.assetImage1 || "/noImage.jpg"}
                          alt={`${item.assetNumber} Asset Image`}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {item.product.part_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.location}</p>
                      <p className="text-sm font-bold text-gray-500">{item.assetType.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-gray-500">{item.employee?.name || "No Name"}</p>
                      <p className="text-sm text-gray-500">{item.department?.dept_name || ""}</p>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">

                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Desktop View: Tabel */}
          <div className="hidden md:block">
            <Card className="bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black dark:text-white text-center">
                  Asset Management
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Data asset user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table className="w-full mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black py-2 dark:text-white font-bold uppercase">No</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Asset Number</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Part Number</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Part Name</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Asset Type</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Useful Life</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">User Name</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Department</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Location</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Cost Purchase</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Date Purchase</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Status</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Asset Image</TableHead>
                      <TableHead className="text-black dark:text-white font-bold uppercase">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[12px]">
                    {data.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{offset + index + 1}</TableCell>
                        <TableCell className="text-center font-bold">{item.assetNumber}</TableCell>
                        <TableCell>{item.product.part_number}</TableCell>
                        <TableCell>{item.product.part_name}</TableCell>
                        <TableCell className="text-center">{item.assetType.name}</TableCell>
                        <TableCell className="text-center">{item.usefulLife}</TableCell>
                        <TableCell className="text-left">{item.employee?.name || "-"}</TableCell>
                        <TableCell className="text-left">{item.department?.dept_name || "-"}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{formatCurrencyQtt(Number(item.purchaseCost?.toString()))}</TableCell>
                        <TableCell>{item.purchaseDate ? new Date(item.purchaseDate).toDateString() : "-"}</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 text-xs rounded-md inline-block
                              ${
                                item.status === "DECOMMISSIONED"
                                  ? "bg-red-100 text-red-500"
                                  : item.status === "AVAILABLE"
                                  ? "bg-blue-100 text-blue-500"
                                  : item.status === "IN_USE"
                                  ? "bg-green-100 text-green-500"
                                  : item.status === "UNDER_MAINTENANCE"
                                  ? "bg-red-100 text-red-500"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {item.status}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 overflow-hidden rounded">
                              <ImageDialog
                                src={item.assetImage1 || "/noImage.jpg"}
                                alt={`${item.assetNumber} Asset Image`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
