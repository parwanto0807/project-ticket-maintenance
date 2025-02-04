import { db } from "@/lib/db";
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE_ASSET = 15;

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
            },
            orderBy: {
                updatedAt:'desc'
            },
            where: {
                OR: [
                    { description : { contains: query, mode: 'insensitive' } },
                    { name : { contains: query, mode: 'insensitive' } },
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
                    { description : { contains: query, mode: 'insensitive' } },
                    { name : { contains: query, mode: 'insensitive' } },
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