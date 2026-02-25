"use server";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";

const ITEMS_PER_PAGE = 10;

// Types berdasarkan model Prisma
export interface Software {
  id: string;
  name: string;
  vendor?: string | null;
  category?: string | null;
  licenseType?: string | null;
  defaultExpiry?: number | null;
  website?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftwareInstallation {
  id: string;
  assetId: string;
  softwareId: string;
  installDate?: Date | null;
  licenseKey?: string | null;
  licenseExpiry?: Date | null;
  version?: string | null;
  isActive: boolean;
  asset?: {
    id: string;
    assetNumber: string;
  };
  software?: Software;
}

export interface CreateSoftwareData {
  name: string;
  vendor?: string;
  category?: string;
  licenseType?: string;
  defaultExpiry?: number;
  website?: string;
  description?: string;
}

export interface UpdateSoftwareData {
  name?: string;
  vendor?: string;
  category?: string;
  licenseType?: string;
  defaultExpiry?: number;
  website?: string;
  description?: string;
}

export interface CreateInstallationData {
  assetId: string;
  softwareId: string;
  installDate?: Date | string;
  licenseKey?: string;
  licenseExpiry?: Date | string;
  version?: string;
  isActive?: boolean;
}

export interface UpdateInstallationData {
  assetId?: string;
  softwareId?: string;
  installDate?: Date | string;
  licenseKey?: string;
  licenseExpiry?: Date | string;
  version?: string;
  isActive?: boolean;
}

// --- Software Operations ---

export async function fetchSoftwareAll(): Promise<Software[]> {
  noStore();
  try {
    const software = await db.software.findMany({
      orderBy: { name: "asc" },
    });
    return software;
  } catch (error) {
    console.error("Error fetching all software:", error);
    throw new Error("Gagal mengambil data software");
  }
}

export async function fetchSoftwareById(id: string): Promise<Software> {
  noStore();
  try {
    const software = await db.software.findUnique({
      where: { id },
    });

    if (!software) {
      throw new Error("Software tidak ditemukan");
    }

    return software;
  } catch (error) {
    console.error(`Error fetching software with id ${id}:`, error);
    throw new Error("Gagal mengambil data software");
  }
}

export async function updateSoftware(id: string, data: UpdateSoftwareData): Promise<Software> {
  noStore();
  try {
    const software = await db.software.update({
      where: { id },
      data,
    });
    return software;
  } catch (error) {
    console.error(`Error updating software with id ${id}:`, error);
    throw new Error("Gagal mengupdate software");
  }
}

export async function deleteSoftware(id: string): Promise<void> {
  noStore();
  try {
    await db.software.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting software with id ${id}:`, error);
    throw new Error("Gagal menghapus software");
  }
}

export async function searchSoftware(query: string): Promise<Software[]> {
  noStore();
  try {
    const software = await db.software.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { vendor: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });
    return software;
  } catch (error) {
    console.error(`Error searching software with query ${query}:`, error);
    throw new Error("Gagal mencari software");
  }
}

export async function fetchSoftwareByCategory(category: string): Promise<Software[]> {
  noStore();
  try {
    const software = await db.software.findMany({
      where: { category },
      orderBy: { name: "asc" },
    });
    return software;
  } catch (error) {
    console.error(`Error fetching software by category ${category}:`, error);
    throw new Error("Gagal mengambil software berdasarkan kategori");
  }
}

// --- Installation Operations ---

export async function fetchInstallationsAll(): Promise<SoftwareInstallation[]> {
  noStore();
  try {
    const installations = await db.softwareInstallation.findMany({
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
      orderBy: { installDate: "desc" },
    });
    return installations;
  } catch (error) {
    console.error("Error fetching all installations:", error);
    throw new Error("Gagal mengambil data instalasi software");
  }
}

export async function fetchInstallationById(id: string): Promise<SoftwareInstallation> {
  noStore();
  try {
    const installation = await db.softwareInstallation.findUnique({
      where: { id },
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
    });

    if (!installation) {
      throw new Error("Instalasi tidak ditemukan");
    }

    return installation;
  } catch (error) {
    console.error(`Error fetching installation with id ${id}:`, error);
    throw new Error("Gagal mengambil data instalasi");
  }
}

export async function fetchInstallationsByAssetId(assetId: string): Promise<SoftwareInstallation[]> {
  noStore();
  try {
    const installations = await db.softwareInstallation.findMany({
      where: { assetId },
      include: {
        software: true,
      },
      orderBy: { installDate: "desc" },
    });
    return installations;
  } catch (error) {
    console.error(`Error fetching installations for asset ${assetId}:`, error);
    throw new Error("Gagal mengambil data instalasi untuk asset");
  }
}

export async function fetchInstallationsBySoftwareId(softwareId: string): Promise<SoftwareInstallation[]> {
  noStore();
  try {
    const installations = await db.softwareInstallation.findMany({
      where: { softwareId },
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
      },
      orderBy: { installDate: "desc" },
    });
    return installations;
  } catch (error) {
    console.error(`Error fetching installations for software ${softwareId}:`, error);
    throw new Error("Gagal mengambil data instalasi untuk software");
  }
}

export async function createInstallation(data: CreateInstallationData): Promise<SoftwareInstallation> {
  noStore();
  try {
    const processedData = {
      ...data,
      installDate: data.installDate
        ? typeof data.installDate === "string"
          ? new Date(data.installDate)
          : data.installDate
        : new Date(),
      licenseExpiry: data.licenseExpiry
        ? typeof data.licenseExpiry === "string"
          ? new Date(data.licenseExpiry)
          : data.licenseExpiry
        : undefined,
    } as any;

    const installation = await db.softwareInstallation.create({
      data: processedData,
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
    });
    return installation;
  } catch (error) {
    console.error("Error creating installation:", error);
    throw new Error("Gagal membuat instalasi baru");
  }
}

export async function updateInstallation(id: string, data: UpdateInstallationData): Promise<SoftwareInstallation> {
  noStore();
  try {
    const updateData: any = {};

    if (data.assetId !== undefined) updateData.assetId = data.assetId;
    if (data.softwareId !== undefined) updateData.softwareId = data.softwareId;
    if (data.licenseKey !== undefined) updateData.licenseKey = data.licenseKey;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.installDate) {
      updateData.installDate = typeof data.installDate === "string" ? new Date(data.installDate) : data.installDate;
    }

    if (data.licenseExpiry) {
      updateData.licenseExpiry = typeof data.licenseExpiry === "string" ? new Date(data.licenseExpiry) : data.licenseExpiry;
    }

    const installation = await db.softwareInstallation.update({
      where: { id },
      data: updateData,
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
    });
    return installation;
  } catch (error) {
    console.error(`Error updating installation with id ${id}:`, error);
    throw new Error("Gagal mengupdate instalasi");
  }
}

export async function deleteInstallation(id: string): Promise<void> {
  noStore();
  try {
    await db.softwareInstallation.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting installation with id ${id}:`, error);
    throw new Error("Gagal menghapus instalasi");
  }
}

export async function toggleInstallationActive(id: string, isActive: boolean): Promise<SoftwareInstallation> {
  noStore();
  try {
    const installation = await db.softwareInstallation.update({
      where: { id },
      data: { isActive },
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
    });
    return installation;
  } catch (error) {
    console.error(`Error toggling active status for installation ${id}:`, error);
    throw new Error("Gagal mengubah status aktif instalasi");
  }
}

export async function fetchExpiringInstallations(days: number = 30): Promise<SoftwareInstallation[]> {
  noStore();
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const installations = await db.softwareInstallation.findMany({
      where: {
        licenseExpiry: {
          lte: targetDate,
          gte: new Date(),
        },
        isActive: true,
      },
      include: {
        asset: {
          select: { id: true, assetNumber: true },
        },
        software: true,
      },
      orderBy: { licenseExpiry: "asc" },
    });
    return installations;
  } catch (error) {
    console.error(`Error fetching expiring installations for ${days} days:`, error);
    throw new Error("Gagal mengambil data instalasi yang akan kadaluarsa");
  }
}

// --- Original Exports ---

export const fetchSoftwarePages = async (query: string) => {
  noStore();
  try {
    const count = await db.software.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { vendor: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Error fetching software pages:", error);
    throw new Error("Gagal mengambil jumlah halaman software");
  }
};

export const fetchFilteredSoftware = async (
  query: string,
  currentPage: number
) => {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const software = await db.software.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { vendor: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        installations: {
          include: { software: { select: { name: true, vendor: true } } },
        },
      },
      orderBy: { name: "asc" },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return software;
  } catch (error) {
    console.error("Error fetching filtered software:", error);
    throw new Error("Gagal mengambil data software");
  }
};

export const fetchSoftwareOverviewStats = async () => {
  noStore();
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const [totalSoftware, totalInstallations, expiringLicenses, inactiveInstallations] = await Promise.all([
      db.software.count(),
      db.softwareInstallation.count(),
      db.softwareInstallation.count({
        where: {
          licenseExpiry: {
            lte: targetDate,
            gte: new Date(),
          },
          isActive: true,
        }
      }),
      db.softwareInstallation.count({
        where: { isActive: false }
      })
    ]);

    return {
      totalSoftware,
      totalInstallations,
      expiringLicenses,
      inactiveInstallations,
    };
  } catch (error) {
    console.error("Error fetching software stats:", error);
    return {
      totalSoftware: 0,
      totalInstallations: 0,
      expiringLicenses: 0,
      inactiveInstallations: 0,
    };
  }
};

// Memberikan alias untuk kompatibilitas lama (opsional, tapi sebaiknya dihindari di "use server")
// Kita tidak bisa export object, jadi kita harus update pemanggilnya.
