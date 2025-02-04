"use server";

import * as z from "zod"
import { db } from "@/lib/db";
import { AssetSchema } from "@/schemas";
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
                name: validateFieldAsset.data.name,
                description: validateFieldAsset.data.description,
                category: validateFieldAsset.data.category,
                status: validateFieldAsset.data.status,
                location: validateFieldAsset.data.location,
                purchaseDate: validateFieldAsset.data.purchaseDate,
                purchaseCost: validateFieldAsset.data.purchaseCost,
                residualValue: validateFieldAsset.data.residualValue,
                usefulLife: validateFieldAsset.data.usefulLife,
                assetTypeId: validateFieldAsset.data.assetTypeId,
                productId: validateFieldAsset.data.productId,
                employeeId: validateFieldAsset.data.employeeId,
            }
        })
        revalidatePath("/dashboard/asset/asset-list")
        return { success: "Successfully creating asset"}
    } catch (error) {
        console.error("Error Creating Asset", error);
        return { message: "Error Creating Asset"}
    }
}