import { db } from "@/lib/db";
import { unstable_noStore as no_store } from "next/cache";

const ITEMS_PER_PAGE_TECHNICIANS = 10;

// **2️⃣ Fetch Technician by ID**
export async function getTechnicianById(id: string) {
    no_store(); // Hindari caching data
    try {
        const technician = await db.technician.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                specialization: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!technician) {
            return { message: "Technician not found", error: true };
        }

        return technician;
    } catch (error) {
        return { message: "Failed to fetch Technician", error };
    }
}


// **3️⃣ Fetch All Technicians with Pagination & Search**
export async function getTechnicians(query: string, currentPage: number) {
    no_store(); // Hindari caching data
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TECHNICIANS;

    try {
        const technicians = await db.technician.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TECHNICIANS,
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        specialization: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        return technicians 
    } catch (error) {
        console.error("Error Fetching Technicians:", error);
        throw new Error("Failed to fetch Technicians");
    }
}

export const getTechniciansPages = async (query: string) => {
    no_store();
    try {
        const assetCount = await db.technician.count({
            where: {
                OR: [
                    {
                        name: { contains: query, mode: "insensitive" },
                    },
                    {
                        email: { contains: query, mode: "insensitive" },
                    },
                    {
                        specialization: { contains: query, mode: "insensitive" },
                    },
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        const totalPagesAsset = Math.ceil(assetCount / ITEMS_PER_PAGE_TECHNICIANS);
        return totalPagesAsset;
    } catch (error) {
        console.error('Error fetching asset', error)
        throw new Error('Error fetching asset');
    }
}
