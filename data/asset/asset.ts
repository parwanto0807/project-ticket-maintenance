import { db } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE_ASSET = 15;

export async function generateAssetNumber(id: string) {
    try {
        // Ambil kode dari tabel AssetType
        const assetType = await db.assetType.findUnique({
            where: { id: id },
            select: { kode: true },
        });

        if (!assetType || !assetType.kode) {
            throw new Error("Asset type not found or has no kode");
        }

        // Ambil assetNumber terakhir dari tabel Asset
        const lastAsset = await db.asset.findFirst({
            where: { id }, // Ambil hanya yang sesuai dengan tipe aset
            orderBy: { id: 'desc' },
            select: { assetNumber: true },
        });

        // Generate ID baru
        let newIdNumber = 1;
        if (lastAsset?.assetNumber) {
            const lastIdNumber = parseInt(lastAsset.assetNumber.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        // Gunakan kode dari AssetType sebagai prefix
        const newAssetNumber = `${assetType.kode}-${String(newIdNumber).padStart(6, '0')}`;
        return newAssetNumber;
    } catch (error) {
        console.error("Failed to generate asset number", error);
        throw new Error("Failed to fetch asset number");
    }
}

export const fetchAssetList = async(query: string, currentPage: number) => {
noStore();
const offset = (currentPage - 1) * ITEMS_PER_PAGE_ASSET;
    try {
        const assetFind = await db.asset.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_ASSET,
            include: {
                employee: true,
                product: true,
                assetType: true,
                department: true,
            },
            orderBy: {
                updatedAt:'desc'
            },
            where: {
                OR: [
                    // { description : { contains: query, mode: 'insensitive' } },
                    // { name : { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                ]
            }
        })
        return assetFind;
    } catch (error) {
        console.error('Can not find Asset List', error);
        return { error: 'Can not find Asset List' };
    }
}

export const fetchAssetListPages = async(query: string) => {
    noStore();

    try {
        const assetCount = await db.asset.count({
            where: { 
                OR: [

                    { location: { contains: query, mode: 'insensitive' } },
                ]
            }, 
            orderBy: {
                updatedAt:'desc'
            }
        });
        const totalPagesAsset = Math.ceil(assetCount / ITEMS_PER_PAGE_ASSET);
        return totalPagesAsset;
    } catch (error) {
        console.error('Error fetching asset', error)
        throw new Error('Error fetching asset');
    }
}

export const fetchAssetType = async() => {
    noStore();
    try {
        const assetTypeFind = await db.assetType.findMany({
            orderBy:{
                name:'asc'
            }
        })
        return assetTypeFind;
    } catch (error) {
        console.error('Error fetching asset type', error);
        return { error: 'Error fetching asset type' };
    }
}