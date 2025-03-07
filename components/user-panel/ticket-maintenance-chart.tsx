"use client";

import React from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dummy data untuk grafik overview dan recent sales
const overviewChartData = [
  { name: "Jan", total: 5000 },
  { name: "Feb", total: 8000 },
  { name: "Mar", total: 7500 },
  { name: "Apr", total: 9000 },
  { name: "May", total: 8500 },
  { name: "Jun", total: 10000 },
  { name: "Jul", total: 9500 },
  { name: "Aug", total: 11000 },
  { name: "Sep", total: 10500 },
  { name: "Oct", total: 11500 },
  { name: "Nov", total: 12000 },
  { name: "Dec", total: 12500 },
];

const salesData = [
  { name: "Alice", email: "alice@example.com", amount: "Rp 1,200,000" },
  { name: "Bob", email: "bob@example.com", amount: "Rp 950,000" },
  { name: "Charlie", email: "charlie@example.com", amount: "Rp 1,500,000" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function DashboardChartSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Card Overview dengan Chart */}
      <Card className="col-span-2 lg:col-span-4 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={overviewChartData}>
              {/* Definisi gradasi warna orange */}
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                  <stop offset="100%" stopColor="#FDBA74" /> {/* Orange-300 */}
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp ${value}`}
              />
              <Bar dataKey="total" fill="url(#orangeGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Card Recent Sales */}
      <Card className="col-span-2 lg:col-span-3 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply mb-20">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>You made 265 sales this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {salesData.map((sale) => (
              <div key={sale.name} className="flex items-center">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(sale.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{sale.email}</p>
                </div>
                <div className="ml-auto font-medium">{sale.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
