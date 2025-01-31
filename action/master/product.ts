"use server"

import *  as z from "zod";
import { db } from "@/lib/db";
import { getProductById } from "@/data/master/products";
import { getUnitById } from "@/data/master/products";


import {
    ProductSchema,
    UnitSchema,
    TypeSchema,
    CategorySchema,
    GroupSchema,
    BrandSchema,
    GudangSchema,
    RakSchema,
    LokasiRakSchema
} from "@/schemas"
import { revalidatePath } from "next/cache";


export const createProduct = async (values: z.infer<typeof ProductSchema>) => {
    const validatedFields = ProductSchema.safeParse(values);
    const now = new Date();

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const {
        part_number,
    } = validatedFields.data;

    const existingProduct = await getProductById(part_number);
    if (existingProduct) {
        return { error: "Product already in use!" };
    }

    try {
        await db.product.create({
            data: {
                part_number: validatedFields.data.part_number,
                part_name: validatedFields.data.part_name,
                nick_name: validatedFields.data.nick_name,
                satuan_pemasukan: validatedFields.data.satuan_pemasukan,
                satuan_penyimpanan: validatedFields.data.satuan_penyimpanan,
                satuan_pengeluaran: validatedFields.data.satuan_pengeluaran,
                conversi_pemasukan: validatedFields.data.conversi_pemasukan,
                conversi_penyimpanan: validatedFields.data.conversi_penyimpanan,
                conversi_pengeluaran: validatedFields.data.conversi_pengeluaran,
                description: validatedFields.data.description,
                minStock: validatedFields.data.minStock,
                maxStock: validatedFields.data.maxStock,
                groupId: validatedFields.data.groupId,
                brandId: validatedFields.data.brandId,
                kategoriId: validatedFields.data.kategoriId,
                jenisId: validatedFields.data.jenisId,
                gudangId: validatedFields.data.gudangId,
                rakId: validatedFields.data.rakId,
                lokasiRakId: validatedFields.data.lokasiRakId,
                createdAt: now,
                updatedAt: now,
            }
        })
        revalidatePath("/dashboard/master/products")
        // redirect("/dashboard/master/products")
        return { success: "Successfully created product" };
    } catch (error) {
        console.error("Error creating product:", error);
        return { message: "Gagal membuat product" }
    }

};

export const updateProduct = async (id: string, values: z.infer<typeof ProductSchema>) => {
    const validatedFields = ProductSchema.safeParse(values);
    const now = new Date();

    if (!validatedFields.success) {
        return { error: "Invalid Fields" }
    }

    try {
        await db.product.update({
            data: {
                part_number: validatedFields.data.part_number,
                part_name: validatedFields.data.part_name,
                nick_name: validatedFields.data.nick_name,
                satuan_pemasukan: validatedFields.data.satuan_pemasukan,
                satuan_penyimpanan: validatedFields.data.satuan_penyimpanan,
                satuan_pengeluaran: validatedFields.data.satuan_pengeluaran,
                conversi_pemasukan: validatedFields.data.conversi_pemasukan,
                conversi_penyimpanan: validatedFields.data.conversi_penyimpanan,
                conversi_pengeluaran: validatedFields.data.conversi_pengeluaran,
                description: validatedFields.data.description,
                minStock: validatedFields.data.minStock,
                maxStock: validatedFields.data.maxStock,
                groupId: validatedFields.data.groupId,
                brandId: validatedFields.data.brandId,
                kategoriId: validatedFields.data.kategoriId,
                jenisId: validatedFields.data.jenisId,
                gudangId: validatedFields.data.gudangId,
                rakId: validatedFields.data.rakId,
                lokasiRakId: validatedFields.data.lokasiRakId,
                updatedAt: now,
            }, where: { id },
        })
        revalidatePath("/dashboard/master/products")
        return { success: "Successfully updated product" }
    } catch {
        return { error: "Filed update product" }
    }
}

export const deleteProduct = async (id: string) => {
    try {
        await db.product.delete({
            where: { id }
        })
        revalidatePath("/dashboard/master/products");
        return { success: "Product deleted successfully" }
    } catch (error) {
        console.error("Error Delete employee:", error);
        return { error: "Filed to delete this product" }
    }
};

export const createUnit = async (values: z.infer<typeof UnitSchema>) => {
    const validatedFields = UnitSchema.safeParse(values);
    const now = new Date()

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }
    const {
        name,
    } = validatedFields.data;

    const existingUnit = await getUnitById(name);
    if (existingUnit) {
        return { error: `Unit ${validatedFields.data.name} alredy in use` }
    }

    try {
        await db.unit.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
                createdAt: now,
                updatedAt: now
            }
        })
        revalidatePath("/dashboard/master/products/create")
        return { success: "Successfully created unit" };
    } catch {
        return { error: "Filed created unit" }
    }
};
export const deleteUnit = async (id: string) => {
    try {
        await db.unit.delete({
            where: { id }
        })
        revalidatePath("/dashboard/products/create");
        //return { success: "Successfull delete unit"}
    } catch {
        return {
            message: "Gagal menghapus Type Product atau  Type ini sudah dipakai di Master Produk"
        }
    }


};

// JENIS PRODUCT
export const createType = async (values: z.infer<typeof UnitSchema>) => {

    const validatedFields = TypeSchema.safeParse(values);
    //console.log(formData);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        //console.error("Validation Errors:", errors);
        return {
            error: "Invalid fields", errors
        };
    }

    const existingUnit = await db.jenisProduct.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Unit dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.jenisProduct.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created type product' };
    } catch {
        return { error: "Filed created type product" }
    }

    // return { success: "Succesfully created type product" }
    // revalidatePath("/dashboard/products/create");
}

export const deleteType = async (id: string) => {
    try {
        await db.jenisProduct.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Gagal menghapus Type Product atau  Type ini sudah dipakai di Master Produk"
        }
    }

    revalidatePath("/dashboard/products/create");
};

// KATEGORI PRODUCT
export const createCategory = async (values: z.infer<typeof CategorySchema>) => {

    const validatedFields = TypeSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }

    const existingUnit = await db.kategoriProduct.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Kategori dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.kategoriProduct.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created category product' };
    } catch {
        return { error: "Filed created category product" }
    }

    // return { success: "Succesfully created type product" }
    // revalidatePath("/dashboard/products/create");
}

export const deleteCategory = async (id: string) => {
    try {
        await db.kategoriProduct.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Filed delete category product"
        }
    }

    revalidatePath("/dashboard/products/create");
};

// GROUP PRODUCT
export const createGroup = async (values: z.infer<typeof GroupSchema>) => {

    const validatedFields = GroupSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }


    const existingUnit = await db.group.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Group dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.group.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created category product' };
    } catch {
        return { error: "Filed created category product" }
    }
}

export const deleteGroup = async (id: string) => {
    try {
        await db.group.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Filed delete category product"
        }
    }
    revalidatePath("/dashboard/products/create");
};

// GROUP PRODUCT
export const createBrand = async (values: z.infer<typeof BrandSchema>) => {

    const validatedFields = BrandSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }

    const existingUnit = await db.brand.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Brand dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.brand.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created category product' };
    } catch {
        return { error: "Filed created category product" }
    }
}

export const deleteBrand = async (id: string) => {
    try {
        await db.brand.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Filed delete category product"
        }
    }
    revalidatePath("/dashboard/products/create");
};

// GUDANG PRODUCT
export const createGudang = async (values: z.infer<typeof GudangSchema>) => {

    const validatedFields = GudangSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }


    const existingUnit = await db.gudang.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Gudang dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.gudang.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created gudang product' };
    } catch  {
        return { error: "Filed created gudang product" }
    }
}

export const deleteGudangWithId = async (id: string) => {
    try {
        await db.gudang.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Filed delete gudang product"
        }
    }
    revalidatePath("/dashboard/products/create");
};

// RAK PRODUCT
export const createRak = async (values: z.infer<typeof RakSchema>) => {

    const validatedFields = RakSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }


    const existingUnit = await db.rak.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Rak dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.rak.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created rak product' };
    } catch {
        return { error: "Filed created rak product" }
    }
}

export const deleteRakWithId = async (id: string) => {
    try {
        await db.rak.delete({
            where: { id }
        })
    } catch  {
        return {
            message: "Filed delete rak product"
        }
    }
    revalidatePath("/dashboard/products/create");
};

// RAK PRODUCT
export const createLokasiRak = async (values: z.infer<typeof LokasiRakSchema>) => {

    const validatedFields = LokasiRakSchema.safeParse(values);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: "Invalid fields", errors
        };
    }


    const existingUnit = await db.lokasiRak.findFirst({
        where: {
            name: validatedFields.data.name
        }
    });

    if (existingUnit) {
        return {
            error: `Lokasi rak dengan nama ${validatedFields.data.name} sudah ada`
        };
    }

    try {
        await db.lokasiRak.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note,
            }
        });
        revalidatePath("/dashboard/products/create");
        return { success: 'Successfully created lokai rak product' };
    } catch {
        return { error: "Filed created lokasi rak product" }
    }
}

export const deleteLokasiRakWithId = async (id: string) => {
    try {
        await db.lokasiRak.delete({
            where: { id }
        })
    } catch {
        return {
            message: "Filed delete lokasi rak product"
        }
    }
    revalidatePath("/dashboard/products/create");
};