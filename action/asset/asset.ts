"use server";

import * as z from "zod"
import { db } from "@/lib/db";
import { AssetSchema, AssetTypeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";


export const createAsset = async ( values: z.infer<typeof AssetSchema> ) => {
    const validateFieldAsset = AssetSchema.safeParse(values)

    if (!validateFieldAsset.success) {
        return {error: "Invalid Fields"}
    }
    try {
        await db.asset.create({
            data: {
                assetNumber: validateFieldAsset.data.assetNumber, 
                status: validateFieldAsset.data.status,
                location: validateFieldAsset.data.location,
                purchaseDate: validateFieldAsset.data.purchaseDate,
                purchaseCost: validateFieldAsset.data.purchaseCost,
                residualValue: validateFieldAsset.data.residualValue,
                usefulLife: validateFieldAsset.data.usefulLife,
                assetTypeId: validateFieldAsset.data.assetTypeId,
                productId: validateFieldAsset.data.productId,
                employeeId: validateFieldAsset.data.employeeId,
                departmentId: validateFieldAsset.data.departmentId,
                assetImage1: validateFieldAsset.data.assetImage1,
                assetImage2: validateFieldAsset.data.assetImage2,
                assetImage3: validateFieldAsset.data.assetImage3,
            }
        })
        revalidatePath("/dashboard/asset/asset-list")
        return { success: "Successfully creating asset"}
    } catch (error) {
        console.error("Error Creating Asset", error);
        return { message: "Error Creating Asset"}
    }
}

export const createAssetType = async ( values: z.infer<typeof AssetTypeSchema> ) => {
    const validateFieldAsset = AssetTypeSchema.safeParse(values)

    if (!validateFieldAsset.success) {
        return {error: "Invalid Fields"}
    }
    try {
        await db.assetType.create({
            data: {
                name: validateFieldAsset.data.name,
                description: validateFieldAsset.data.description,
                kode: validateFieldAsset.data.kode,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
        revalidatePath("/dashboard/asset/asset-list/create")
        return { success: "Successfully creating asset type"}
    } catch (error) {
        console.error("Error Creating Asset Type", error);
        return { message: "Error Creating Asset Type"}
    }
}

export const deleteAssetType = async (id: string) => {
    try {
        await db.assetType.delete({
            where : {
                id: id
            }
        })
        revalidatePath("/dashboard/asset/asset-list/create")
        return {message: "Delete type asset successfull"}
    } catch {
        return {message: "Delete type asset Filed!"}  
    }
}