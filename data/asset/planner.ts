"use server";

import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { ITEMS_PER_PAGE_PLANNER } from "@/lib/constants";

export async function fetchMaintenancePlannerData(year: number, currentPage: number, query: string = "") {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PLANNER;

    try {
        const assets = await db.asset.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_PLANNER,
            where: {
                OR: [
                    { assetNumber: { contains: query, mode: 'insensitive' } },
                    { product: { part_name: { contains: query, mode: 'insensitive' } } },
                    { department: { dept_name: { contains: query, mode: 'insensitive' } } },
                ]
            },
            include: {
                product: {
                    select: {
                        part_name: true,
                        part_number: true,
                    }
                },
                department: {
                    select: {
                        dept_name: true,
                    }
                },
                assetType: {
                    select: {
                        name: true,
                    }
                },
                employee: {
                    select: {
                        name: true,
                    }
                },
                tickets: {
                    where: {
                        scheduledDate: {
                            gte: new Date(`${year}-01-01`),
                            lte: new Date(`${year}-12-31`),
                        },
                        troubleUser: "Preventive Maintenance"
                    },
                    select: {
                        id: true,
                        status: true,
                        scheduledDate: true,
                        completedDate: true,
                        technicianId: true,
                    }
                }
            },
            orderBy: [
                { departmentId: 'asc' },
                { assetNumber: 'asc' }
            ]
        });
        return assets;
    } catch (error) {
        console.error("Failed to fetch planner data", error);
        throw new Error("Failed to fetch planner data");
    }
}

export async function fetchMaintenancePlannerPages(query: string = "") {
    noStore();
    try {
        const count = await db.asset.count({
            where: {
                OR: [
                    { assetNumber: { contains: query, mode: 'insensitive' } },
                    { product: { part_name: { contains: query, mode: 'insensitive' } } },
                    { department: { dept_name: { contains: query, mode: 'insensitive' } } },
                ]
            }
        });

        return Math.ceil(count / ITEMS_PER_PAGE_PLANNER);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of planner pages.");
    }
}
