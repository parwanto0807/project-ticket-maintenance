"use server";

import * as z from "zod"
import { db } from "@/lib/db";
import { AssetSchema, AssetTypeSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { fetchAssetById } from "@/data/asset/asset";
import { generateAssetNumber } from "@/data/asset/asset";

export const updateAsset = async (id: string, formData: FormData) => {
  if (!id) return { error: "Asset ID is required" };
  // Parse FormData
  const rawData = {
    assetNumber: formData.get("assetNumber"),
    status: formData.get("status"),
    location: formData.get("location"),
    purchaseDate: formData.get("purchaseDate"),
    purchaseCost: formData.get("purchaseCost"),
    residualValue: formData.get("residualValue"),
    usefulLife: formData.get("usefulLife"),
    assetTypeId: formData.get("assetTypeId"),
    productId: formData.get("productId"),
    employeeId: formData.get("employeeId"),
    departmentId: formData.get("departmentId"),
    assetImage1: formData.get("assetImage1") as File | null, // Bisa null jika tidak ada perubahan gambar
  };

  // Convert values to correct types
  const parsedData = {
    ...rawData,
    purchaseDate: rawData.purchaseDate ? new Date(rawData.purchaseDate as string) : undefined,
    purchaseCost: Number(rawData.purchaseCost),
    residualValue: Number(rawData.residualValue),
    usefulLife: Number(rawData.usefulLife),
  };

  // Validate data
  const result = AssetSchema.safeParse(parsedData);
  
  if (!result.success) {
    return { error: "Invalid field data" };
  }
  const data = await fetchAssetById(id);

  if (!data || 'error' in data) {
    return { message: "No data found" };
  }

  if ('assetImage1' in data) {
    const assetImage1 = data.assetImage1;
    if (assetImage1) {
      await del(assetImage1);
    } else {
      return { message: "assetImage1 is null" };
    }
  } else {
    return { message: "Property assetImage1 does not exist on data" };
  }

  try {
    let imageUrl = "";

    // Ambil data lama dari database
    const existingAsset = await db.asset.findUnique({
      where: { id },
      select: { assetImage1: true },
    });

    if (!existingAsset) return { error: "Asset not found" };

    // Upload image only if a new image is provided
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
    } else {
      imageUrl = existingAsset.assetImage1 ?? ""; // Gunakan gambar lama jika tidak ada yang baru
    }
    //memastikan bahwa assetNumber adalah Number yang terakhir di panggil, sehingga tidak bentrok dengan pengguna lain. 

    // Update asset in database
    await db.asset.update({
      where: { id },
      data: {
        ...result.data,
        assetImage1: imageUrl,
        purchaseCost: result.data.purchaseCost,
        residualValue: result.data.residualValue,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/asset/asset-list");
    return { success: "Asset updated successfully!" };
  } catch (error) {
    console.error("Error updating asset:", error);
    return { error: "Failed to update asset" };
  }
};


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

    const {assetNumber, countNumber} = await generateAssetNumber(result.data.assetTypeId);
    // Create asset in database
    await db.asset.create({
      data: {
        ...result.data,
        assetNumber,
        countNumber,
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

export const createAssetType = async (values: z.infer<typeof AssetTypeSchema>) => {
  const validateFieldAsset = AssetTypeSchema.safeParse(values)

  if (!validateFieldAsset.success) {
    return { error: "Invalid Fields" }
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
    return { success: "Successfully creating asset type" }
  } catch (error) {
    console.error("Error Creating Asset Type", error);
    return { message: "Error Creating Asset Type" }
  }
}

export const deleteAssetType = async (id: string) => {
  try {
    await db.assetType.delete({
      where: {
        id: id
      }
    })
    revalidatePath("/dashboard/asset/asset-list/create")
    return { message: "Delete type asset successfull" }
  } catch {
    return { message: "Delete type asset Filed!" }
  }
}

export const deleteAssetById = async (id: string) => {
  const data = await fetchAssetById(id);

  if (!data || 'error' in data) {
    return { message: "No data found" };
  }

  if ('assetImage1' in data) {
    const assetImage1 = data.assetImage1;
    if (assetImage1) {
      await del(assetImage1);
    } else {
      return { message: "assetImage1 is null" };
    }
  } else {
    return { message: "Property assetImage1 does not exist on data" };
  }

  try {
    await db.asset.delete({
      where: {
        id: id
      }
    })
    revalidatePath("/dashboard/asset/asset-list")
    return { message: "Delete asset successfull" }
  } catch {
    return { message: "Delete asset Filed!" }
  }
}

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