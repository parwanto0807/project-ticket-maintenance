"use server"

import * as z from "zod";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { MtUang_Schema, PriceSchema } from "@/schemas";

export const createPrice = async (values: z.infer<typeof PriceSchema>) => {
    const validatedFields = PriceSchema.safeParse(values);
    const now = new Date();

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        console.error("Validation Error", errors)
        return {
            Error: errors
        }
    }
    try {
        await db.harga.create({
            data: {
                idProduct: validatedFields.data.idProduct,
                hargaHpp: validatedFields.data.hargaHpp,
                hargaJual: validatedFields.data.hargaJual,
                default: validatedFields.data.default,
                idMtUang: validatedFields.data.idMtUang,
                createdAt: now,
                updatedAt: now
            }
        })
        revalidatePath("/dashboard/master/price-product")
        return { success: "Succesfull created price product" }
    } catch  {
        return { error: "Filed created price product" }
    }
}

export const updatePrice = async (id: string, values: z.infer<typeof PriceSchema>) => {
    const validatedFields = PriceSchema.safeParse(values);
    const now = new Date();

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        console.error("Validation Error", errors)
        return {
            Error: errors
        }
    }
    try {
        await db.harga.update({
            data: {
                idProduct: validatedFields.data.idProduct,
                hargaHpp: validatedFields.data.hargaHpp,
                hargaJual: validatedFields.data.hargaJual,
                default: validatedFields.data.default,
                idMtUang: validatedFields.data.idMtUang,
                updatedAt: now
            },
            where: {
                id
            }
        })
        revalidatePath("/dashboard/master/price-product")
        return { success: "Succesfull updated price product" }
    } catch {
        return { error: "Filed updated price product" }
    }
}

export const deletePrice = async (id: string) => {
    try {
        await db.harga.delete({
            where: {
                id
            }
        });
        revalidatePath("/dashboard/master/price-product")
        return {success: "Delete price product successfull"}
    } catch{
        return {error: "Delete price product Filed!"}        
    }
}

export const createMtUang = async (values: z.infer<typeof MtUang_Schema>) => {
    const validatedFields = MtUang_Schema.safeParse(values)

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors
        return {
            Error: errors
        }
    }
    try {
        await db.mataUang.create({
            data: {
                name: validatedFields.data.name,
                note: validatedFields.data.note
            }
        });
        revalidatePath('/dahsboard/master/price-product')
        return { success: "Succesfull created currency" }
    } catch {
        return { error: "Filed create currency" }
    }
}

export const deleteMtuang = async (id: string) => {
    try {
        await db.mataUang.delete({
            where: {
                id
            }
        });
        revalidatePath('/dashboard/master/price-product')
        return { success: "Successfull delete currency" }
    } catch {
        return { error: "Filed delete currency" }
    }
}
