import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { fetchTicketAnalistAll } from "@/data/asset/ticket"; // Gunakan fungsi yang sudah ada
import { subMonths, startOfMonth } from "date-fns";

export async function GET() {
    noStore();
    try {
        // Hitung tanggal mulai dari 12 bulan terakhir
        const startDate = startOfMonth(subMonths(new Date(), 11)); // Ambil data dari 12 bulan terakhir

        // Ambil data tiket yang sudah dikelompokkan berdasarkan group.name dan jenisProduct.name
        const tickets = await fetchTicketAnalistAll();

        // Filter hanya tiket yang dibuat dalam 12 bulan terakhir
        const filteredGroupData = tickets.groupData.filter((group) => 
            new Date(group.createdAt) >= startDate
        );

        const filteredJenisProductData = tickets.jenisProductData.filter((jenisProduct) =>
            new Date(jenisProduct.createdAt) >= startDate
        );

        const filteredCategoryProductData = tickets.cetgoriProductData.filter((categoryProduct) =>
            new Date(categoryProduct.createdAt) >= startDate
        );
        const filteredDepartmentData = tickets.departmentTicketData.filter((departmentData) =>
            new Date(departmentData.createdAt) >= startDate
        );

        return NextResponse.json({
            groupData: filteredGroupData,
            jenisProductData: filteredJenisProductData,
            categoryProductData: filteredCategoryProductData,
            departmentTicketData: filteredDepartmentData,
        });
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
