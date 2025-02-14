import { db } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE_PRODUCT = 15;
const ITEMS_PER_PAGE_PRODUCT_NAME = 15;

export const getGudangFindAll = async () => {
    try {
        const gudangFind = await db.gudang.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return gudangFind
    } catch {
        return { error: "Filed find data gudang product" }
    }
}

export const getLokasiRakFindAll = async () => {
    try {
        const lokasiRakFind = await db.lokasiRak.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return lokasiRakFind
    } catch {
        return { error: "Filed find lokasi rak product" }
    }
}

export const getRakFindAll = async () => {
    try {
        const rakFind = await db.rak.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return rakFind
    } catch {
        return { error: "Filed find data rak product" }
    }
}

export const getBrandFindAll = async () => {
    try {
        const brandFind = await db.brand.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return brandFind
    } catch {
        return { error: "Filed find data group product" }
    }
}
export const getBrandFindById = async (id:string) => {
    try {
        const brandFind = await db.brand.findUnique({
            where: {
                id:id
            }
        })
        return brandFind
    } catch {
        return { error: "Filed find data group product" }
    }
}

export const getGroupFindAll = async () => {
    try {
        const groupyFind = await db.group.findMany({
            orderBy: {
                updatedAt: 'asc'
            }
        })
        return groupyFind
    } catch {
        return { error: "Filed find data group product" }
    }
}

export const getGroupFindById = async (id : string) => {
    try {
        const groupyFind = await db.group.findUnique({
            where: {
                id:id
            }
        })
        return groupyFind
    } catch {
        return { error: "Filed find data group product" }
    }
}

export const getCategoryFindAll = async () => {
    try {
        const categoryFind = await db.kategoriProduct.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        return categoryFind
    } catch {
        return { error: "Filed find data category product" }
    }
}

export const getCategoryFindById = async (id : string) => {
    try {
        const categoryFind = await db.kategoriProduct.findUnique({
            where: {
                id:id
            }
        })
        return categoryFind
    } catch {
        return { error: "Filed find data category product" }
    }
}

export const getTypeFindAll = async () => {
    try {
        const unitFind = await db.jenisProduct.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        // console.log(unitFind);
        return unitFind;
    } catch (error) {
        console.error("Filed find data unit", error);
        return { error: "Filed find data unit" };
    }
}

export const getTypeById = async (name: string) => {
    noStore();
    try {
        const unitFindById = await db.jenisProduct.findFirst({
            where: { name }
        })
        return unitFindById;
    } catch {
        console.error("Error while fetching type by id")
        return null;
    }
}

export const getUnitFindAll = async () => {
    try {
        const unitFind = await db.unit.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        // console.log(unitFind);
        return unitFind;
    } catch (error) {
        console.error("Filed find data unit", error);
        return { error: "Filed find data unit" };
    }
}

export const getUnitById = async (name: string) => {
    noStore();
    try {
        const unitFindById = await db.unit.findFirst({
            where: { name }
        })
        return unitFindById;
    } catch {
        console.error("Error while fetching unit by id")
        return null;
    }
}


export const getProductById = async (id: string) => {
    noStore();
    try {
        const productFindById = await db.product.findUnique({
            where: { id }
        })
        //console.log("Data Product",productFindById)
        return productFindById;
    } catch {
        console.error("Error while fetching product by id!")
        return null;
    }
}

export async function fetchProductAllData() {
    try {
        const productFindAllData = await db.product.findMany({
            orderBy: {
                part_name: "asc"
            }
        });
        return productFindAllData
    } catch {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}
export async function fetchProducts(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    // Verifikasi perhitungan offset
    //console.log(`Calculated offset: ${offset}`);
    try {
        const productFind = await db.product.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_PRODUCT,
            include: {
                brand: true,
                kategoriproduct: true,
                jenisproduct: true,
                group: true,
            },
            where: {
                OR: [
                    {
                        part_number: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        part_name: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        nick_name: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        group: {
                            name: {
                                contains: query,
                                mode: 'insensitive', // Case-insensitive search
                            }
                        }
                    },
                    {
                        kategoriproduct: {
                            name: {
                                contains: query,
                                mode: 'insensitive', // Case-insensitive search
                            }
                        }
                    },
                    {
                        brand: {
                            name: {
                                contains: query,
                                mode: 'insensitive', // Case-insensitive search
                            }
                        }
                    },
                    {
                        jenisproduct: {
                            name: {
                                contains: query,
                                mode: 'insensitive', // Case-insensitive search
                            }
                        }
                    }
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        //console.log(productFind)
        return productFind;
    } catch  {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}

export async function fetchProductPages(query: string) {
    noStore();
    try {
        const productFind = await db.product.count({
            where: {
                OR: [
                    {
                        part_number: {
                            contains: query,
                        }
                    },
                    {
                        part_name: {
                            contains: query,
                        }
                    },
                    {
                        nick_name: {
                            contains: query,
                        }
                    },
                    {
                        description: {
                            contains: query,
                        }
                    }
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        const totalPagesProduct = Math.ceil(Number(productFind) / ITEMS_PER_PAGE_PRODUCT)
        return totalPagesProduct;
    } catch  {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}

export const getProductNames = async (limit: number) => {
    const productNames = await db.product.findMany({
        select: {
            id: true,
            part_name: true,
            part_number: true,
            satuan_pengeluaran: true,
        },
        where: {
            jenisproduct: {
                name: {
                    equals: "Finished Goods"
                }
            }
        },
        take: limit,
    });

    // console.log(productNames)
    return productNames;
}

export async function fetchProductsByName(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT_NAME;
    try {
        const productNames = await db.product.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_PRODUCT_NAME,
            select: {
                id: true,
                part_name: true,
                part_number: true,
                satuan_pengeluaran: true,
            },
            where: {
                OR: [
                    { part_name: { contains: query, mode: 'insensitive' } },
                    { part_number: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        // console.log("Product by Names", productNames);
        return productNames;
    } catch {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}

export async function fetchProductBynamePages(query: string) {
    noStore();
    try {
        const totalProducts = await db.product.count({
            where: {
                jenisproduct: {
                    name: {
                        equals: "Finished Goods",
                    },
                },
                OR: [
                    { part_name: { contains: query, mode: 'insensitive' } },
                    { part_number: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        const totalPagesProduct = Math.ceil(Number(totalProducts) / ITEMS_PER_PAGE_PRODUCT_NAME)
        return totalPagesProduct;
    } catch  {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}

export async function fetchProductsByNameNoLimit(query: string) {
    noStore();
    try {
        const productNames = await db.product.findMany({
            select: {
                id: true,
                part_name: true,
                part_number: true,
            },
            
            where: {
                jenisproduct: {
                    name: {
                        equals: "Finished Goods",
                    },
                },
                OR: [
                    { part_name: { contains: query, mode: 'insensitive' } },
                    { part_number: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        return productNames;
    } catch {
        console.error('Error Fetching Product')
        throw new Error('Filed to Fetching Product')
    }
}


export const fetchProductBySelect = async (brandId: string, groupId: string, categoryId: string, typeId: string) => {
    try {
        const productNames = await db.product.findMany({
            select: {
                id: true,
                part_name: true,
                part_number: true,
            },
            where: {
                AND: [
                    brandId ? { brandId: { equals: brandId } } : {},
                    groupId ? { groupId: { equals: groupId } } : {},
                    categoryId ? { kategoriId: { equals: categoryId } } : {},
                    typeId ? { jenisId: { equals: typeId } } : {},
                ],
            },
        });

         console.log("Server", productNames)
        return productNames;
    } catch (error) {
        console.error("Error while fetching products by filters:", error);
        return [];
    }
}
