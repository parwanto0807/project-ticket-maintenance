import { db } from "@/lib/db";
import { Prisma, AssetStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export const ITEMS_PER_PAGE_ASSET = 5;
export const ITEMS_PER_PAGE_ASSET_ADMIN = 15;

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
      where: { assetTypeId: id },
      orderBy: { countNumber: "desc" },
      select: { assetNumber: true },
    });

    // Generate ID baru
    let newIdNumber = 1;
    if (lastAsset?.assetNumber) {
      const lastIdNumber = parseInt(
        lastAsset?.assetNumber?.split("-").pop() || "0",
        10
      );
      newIdNumber = lastIdNumber + 1;
    }

    // Gunakan kode dari AssetType sebagai prefix
    const newAssetNumber = `${assetType.kode}-${String(newIdNumber).padStart(
      6,
      "0"
    )}`;
    return { assetNumber: newAssetNumber, countNumber: newIdNumber };
  } catch (error) {
    console.error("Failed to generate asset number", error);
    throw new Error("Failed to fetch asset number");
  }
}

export const fetchAssetList = async (query: string, currentPage: number) => {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_ASSET_ADMIN;

  try {
    // 🧩 Dapatkan semua enum AssetStatus (misalnya: ACTIVE, INACTIVE, MAINTENANCE)
    const validStatuses = Object.values(AssetStatus);

    // Buat array filter OR
    const orFilters: Prisma.AssetWhereInput[] = [
      { assetNumber: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
      { assetType: { name: { contains: query, mode: "insensitive" } } },
      { department: { dept_name: { contains: query, mode: "insensitive" } } },
      { employee: { name: { contains: query, mode: "insensitive" } } },

      // Product fields
      { product: { part_name: { contains: query, mode: "insensitive" } } },
      { product: { part_number: { contains: query, mode: "insensitive" } } },
      { product: { nick_name: { contains: query, mode: "insensitive" } } },
      { product: { description: { contains: query, mode: "insensitive" } } },
      {
        product: {
          satuan_penyimpanan: { contains: query, mode: "insensitive" },
        },
      },
      {
        product: {
          satuan_pengeluaran: { contains: query, mode: "insensitive" },
        },
      },
      {
        product: { brand: { name: { contains: query, mode: "insensitive" } } },
      },
      {
        product: {
          jenisproduct: { name: { contains: query, mode: "insensitive" } },
        },
      },
      {
        product: {
          kategoriproduct: { name: { contains: query, mode: "insensitive" } },
        },
      },
      {
        product: { group: { name: { contains: query, mode: "insensitive" } } },
      },
      {
        product: { gudang: { name: { contains: query, mode: "insensitive" } } },
      },
    ];

    // 🧩 Tambahkan filter status HANYA jika query cocok dengan salah satu enum
    const upperQuery = query.toUpperCase();
    if (validStatuses.includes(upperQuery as AssetStatus)) {
      orFilters.push({
        status: { equals: upperQuery as AssetStatus },
      });
    }

    const assetFind = await db.asset.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE_ASSET_ADMIN,
      include: {
        employee: { select: { id: true, name: true, email: true } },
        product: {
          select: {
            id: true,
            part_number: true,
            part_name: true,
            nick_name: true,
            satuan_penyimpanan: true,
            satuan_pengeluaran: true,
            description: true,
            brand: { select: { name: true } },
            jenisproduct: { select: { name: true } },
            kategoriproduct: { select: { name: true } },
            group: { select: { name: true } },
            gudang: { select: { name: true } },
          },
        },
        assetType: { select: { id: true, name: true } },
        department: { select: { id: true, dept_name: true } },
        softwareInstallations: { include: { software: true } },
      },
      where: { OR: orFilters },
      orderBy: [{ departmentId: "asc" }, { createdAt: "desc" }],
    });

    return assetFind;
  } catch (error) {
    console.error("Can not find Asset List", error);
    return { error: "Can not find Asset List" };
  }
};

export const fetchAssetListForData = async () => {
  noStore();
  try {
    const assetFind = await db.asset.findMany({
      include: {
        employee: true,
        product: true,
        assetType: true,
        department: true,
      },
      orderBy: {
        assetNumber: "desc",
      },
    });
    return assetFind;
  } catch (error) {
    console.error("Can not find Asset List", error);
    return { error: "Can not find Asset List" };
  }
};

export const fetchAssetListPages = async (query: string) => {
  noStore();

  try {
    const assetCount = await db.asset.count({
      where: {
        OR: [
          { assetNumber: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { assetType: { name: { contains: query, mode: "insensitive" } } },
          {
            department: { dept_name: { contains: query, mode: "insensitive" } },
          },
          { employee: { name: { contains: query, mode: "insensitive" } } },

          // === FIELD DARI PRODUCT ===
          { product: { part_name: { contains: query, mode: "insensitive" } } },
          {
            product: { part_number: { contains: query, mode: "insensitive" } },
          },
          { product: { nick_name: { contains: query, mode: "insensitive" } } },
          {
            product: { description: { contains: query, mode: "insensitive" } },
          },
          {
            product: {
              satuan_penyimpanan: { contains: query, mode: "insensitive" },
            },
          },
          {
            product: {
              satuan_pengeluaran: { contains: query, mode: "insensitive" },
            },
          },

          // === RELASI DARI PRODUCT ===
          {
            product: {
              brand: { name: { contains: query, mode: "insensitive" } },
            },
          },
          {
            product: {
              jenisproduct: { name: { contains: query, mode: "insensitive" } },
            },
          },
          {
            product: {
              kategoriproduct: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
          {
            product: {
              group: { name: { contains: query, mode: "insensitive" } },
            },
          },
          {
            product: {
              gudang: { name: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      },
    });

    const totalPagesAsset = Math.ceil(assetCount / ITEMS_PER_PAGE_ASSET_ADMIN);
    return totalPagesAsset;
  } catch (error) {
    console.error("Error fetching asset pages", error);
    throw new Error("Error fetching asset pages");
  }
};

export const fetchAssetType = async () => {
  noStore();
  try {
    const assetTypeFind = await db.assetType.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return assetTypeFind;
  } catch (error) {
    console.error("Error fetching asset type", error);
    return { error: "Error fetching asset type" };
  }
};

// data/asset/asset.ts
export const fetchAssetById = async (id: string) => {
  noStore();
  try {
    const findAssetById = await db.asset.findUnique({
      where: { id: id },
      include: {
        assetType: true,
        department: true,
        product: true,
        employee: true,
        softwareInstallations: {
          include: {
            software: true, // Include software details
          },
        },
      },
    });
    return findAssetById;
  } catch (error) {
    console.error("Error fetch asset by ID", error);
    return { error: "Error fetching asset by ID" };
  }
};

export const fetchAssetListByEmail = async (
  query: string,
  currentPage: number,
  email: string
) => {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_ASSET;

  try {
    // 🔹 1. Hitung total jumlah aset yang cocok dengan filter
    const assetCount = await db.asset.count({
      where: {
        AND: [
          { employee: { email: email } },
          {
            OR: [
              { location: { contains: query, mode: "insensitive" } },
              { assetNumber: { contains: query, mode: "insensitive" } },
              {
                product: {
                  part_name: { contains: query, mode: "insensitive" },
                },
              },
              {
                product: {
                  part_number: { contains: query, mode: "insensitive" },
                },
              },
              { assetType: { name: { contains: query, mode: "insensitive" } } },
              { employee: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
        ],
      },
    });

    // 🔹 2. Hitung total halaman
    const totalPagesAsset = Math.ceil(assetCount / ITEMS_PER_PAGE_ASSET);

    // 🔹 3. Ambil daftar aset untuk halaman saat ini
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
        updatedAt: "desc",
      },
      where: {
        AND: [
          { employee: { email: email } },
          {
            OR: [
              { location: { contains: query, mode: "insensitive" } },
              { assetNumber: { contains: query, mode: "insensitive" } },
              {
                product: {
                  part_name: { contains: query, mode: "insensitive" },
                },
              },
              {
                product: {
                  part_number: { contains: query, mode: "insensitive" },
                },
              },
              { assetType: { name: { contains: query, mode: "insensitive" } } },
              { employee: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
        ],
      },
    });

    // console.log("Total Assets:", assetCount, "| Total Pages:", totalPagesAsset);

    return { assets: assetFind, totalPages: totalPagesAsset };
  } catch (error) {
    console.error("❌ Error fetching Asset List:", error);
    return { error: "Can not find Asset List" };
  }
};

export const fetchAssetListPagesByEmail = async (
  query: string,
  email: string
) => {
  noStore();

  try {
    if (!email) {
      console.warn("⚠️ Email kosong! Tidak dapat mengambil data aset.");
      return 0;
    }
    const assetCount = await db.asset.count({
      where: {
        AND: [
          { employee: { email: email } },
          {
            OR: [{ location: { contains: query, mode: "insensitive" } }],
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const totalPagesAsset = Math.ceil(assetCount / ITEMS_PER_PAGE_ASSET);
    // console.log("Total Backend", totalPagesAsset);
    // console.log("Email yang dicari:", email);
    // console.log("Query pencarian:", query);
    // console.log("Jumlah data ditemukan:", assetCount);

    return totalPagesAsset;
  } catch (error) {
    console.error("Error fetching asset", error);
    throw new Error("Error fetching asset");
  }
};
