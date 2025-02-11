"use server";

import * as z from "zod"
import { db } from "@/lib/db";
import { AssetSchema, AssetTypeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export const createAsset = async (formData: FormData) => {
    // Parse FormData
    const rawData = {
      assetNumber: formData.get('assetNumber'),
      status: formData.get('status'),
      location: formData.get('location'),
      purchaseDate: formData.get('purchaseDate'),
      purchaseCost: formData.get('purchaseCost'),
      residualValue: formData.get('residualValue'),
      usefulLife: formData.get('usefulLife'),
      assetTypeId: formData.get('assetTypeId'),
      productId: formData.get('productId'),
      employeeId: formData.get('employeeId'),
      departmentId: formData.get('departmentId'),
      assetImage1: formData.get('assetImage1') as File,
    };
  
    // Convert values to correct types
    const parsedData = {
      ...rawData,
      purchaseDate: new Date(rawData.purchaseDate as string),
      purchaseCost: Number(rawData.purchaseCost),
      residualValue: Number(rawData.residualValue),
      usefulLife: Number(rawData.usefulLife),
    };
  
    // Validate data
    const result = AssetSchema.safeParse(parsedData);
    
    if (!result.success) {
      return { error: "Invalid field data" };
    }
  
    try {
      // Upload image to Vercel Blob
      let imageUrl = "";
      if (result.data.assetImage1) {
        const { url } = await put(
          result.data.assetImage1.name,
          result.data.assetImage1, 
          {
            access: "public",
            contentType: result.data.assetImage1.type,
          }
        );
        imageUrl = url;
      }
  
      // Create asset in database
      await db.asset.create({
        data: {
          ...result.data,
          assetImage1: imageUrl,
          purchaseCost: result.data.purchaseCost,
          residualValue: result.data.residualValue,
        }
      });
  
      revalidatePath("/dashboard/asset/asset-list");
      return { success: "Asset created successfully!" };
    } catch (error) {
      console.error("Error creating asset:", error);
      return { error: "Failed to create asset" };
    }
  };

// export const createAsset = async (values: z.infer<typeof AssetSchema> ) => {
//     const validateFieldAsset = AssetSchema.safeParse(values)

//     if (!validateFieldAsset.success) {
//         return {error: "Invalid Fields"}
//     }

//     const {assetImage1} = validateFieldAsset.data;
//     const {url} = await put(assetImage1.name, assetImage1, { 
//         access: "public",
//         multipart: true
//     });
    
//     try {
//         await db.asset.create({
//             data: {
//                 assetNumber: validateFieldAsset.data.assetNumber, 
//                 status: validateFieldAsset.data.status,
//                 location: validateFieldAsset.data.location,
//                 purchaseDate: validateFieldAsset.data.purchaseDate,
//                 purchaseCost: validateFieldAsset.data.purchaseCost,
//                 residualValue: validateFieldAsset.data.residualValue,
//                 usefulLife: validateFieldAsset.data.usefulLife,
//                 assetTypeId: validateFieldAsset.data.assetTypeId,
//                 productId: validateFieldAsset.data.productId,
//                 employeeId: validateFieldAsset.data.employeeId,
//                 departmentId: validateFieldAsset.data.departmentId,
//                 assetImage1: url,
//             }
//         })
//         revalidatePath("/dashboard/asset/asset-list")
//         return { success: "Successfully creating asset"}
//     } catch (error) {
//         console.error("Error Creating Asset", error);
//         return { message: "Error Creating Asset"}
//     }
// }

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