// action/asset/software-installation.ts
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createSoftwareInstallation(data: {
    assetId: string
    softwareId: string
    licenseKey?: string
    version?: string
    installDate?: Date
    licenseExpiry?: Date
    isActive?: boolean
}) {
    try {
        const installation = await db.softwareInstallation.create({
            data: {
                assetId: data.assetId,
                softwareId: data.softwareId,
                licenseKey: data.licenseKey,
                version: data.version,
                installDate: data.installDate || new Date(),
                licenseExpiry: data.licenseExpiry,
                isActive: data.isActive ?? true,
            },
            include: {
                software: true,
                asset: {
                    select: {
                        assetNumber: true
                    }
                }
            }
        })

        revalidatePath("/dashboard/asset/asset-list")
        return { success: true, installation }
    } catch (error) {
        console.error("Error creating software installation:", error)
        return { error: "Failed to assign software" }
    }
}