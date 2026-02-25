"use server";

import { db } from "@/lib/db";
import { unstable_noStore as no_store } from "next/cache";
const ITEMS_PER_PAGE_PRICE = 30;

export async function FetchPriceAll(query: string, currentPage: number) {
    no_store();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRICE
    try {
        const priceFindAll = await db.harga.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_PRICE,
            include: {
                part_number: {
                    include: {
                        group: true,
                    }
                },
                mtUang: true,
            },
            where: {
                OR: [
                    {
                        part_number: {
                            part_name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        part_number: {
                            part_number: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        part_number: {
                            group: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive'
                                }
                            }
                        }
                    },
                    {
                        mtUang: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
        return priceFindAll;
    } catch {
        console.error('Error Fetching Price Product')
        throw new Error('Filed to Fetching Price Product')
    }
}

export async function FetchPriceAllPages(query: string) {
    no_store();
    try {
        const priceFindAllPages = await db.harga.count({
            where: {
                OR: [
                    {
                        part_number: {
                            part_name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        part_number: {
                            part_number: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        mtUang: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
        const totalPagePrice = Math.ceil(Number(priceFindAllPages) / ITEMS_PER_PAGE_PRICE)
        return totalPagePrice;
    } catch {
        console.error('Error Fetching Price Product')
        throw new Error('Filed to Fetching Price Product')
    }
}

export async function fetchPriceById(id: string) {
    no_store()

    try {
        const fetchPriceById = await db.harga.findUnique({
            include: {
                part_number: true,
                mtUang: true,
            },
            where: {
                id
            }
        });
        // Convert Decimal to number if price is found
        if (fetchPriceById) {
            return {
                ...fetchPriceById,
                hargaHpp: fetchPriceById.hargaHpp.toNumber(), // Ensure hargaHpp is a number
                hargaJual: fetchPriceById.hargaJual.toNumber(), // Ensure hargaJual is a number
            };
        } else {
            // Handle case where no price is found
            throw new Error('Price not found');
        }
    } catch {
        console.error('Error Fetching Price Product')
        throw new Error('Filed to Fetching Price Product')
    }
}

export async function fetchMtUang() {
    no_store()
    try {
        const findMtUang = await db.mataUang.findMany({
            orderBy: {
                name: "asc"
            }
        });
        return findMtUang
    } catch {
        console.error('Error Fetching mata uang')
        throw new Error('Filed to Fetching mata uang')

    }
}