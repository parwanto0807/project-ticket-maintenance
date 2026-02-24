import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";

const ITEMS_PER_PAGE = 10;

// Types berdasarkan model Prisma - FIX: gunakan Date bukan string
export interface Software {
  id: string;
  name: string;
  vendor?: string | null;
  category?: string | null;
  licenseType?: string | null;
  defaultExpiry?: number | null;
  website?: string | null;
  description?: string | null;
  createdAt: Date; // FIX: Changed from string to Date
  updatedAt: Date; // FIX: Changed from string to Date
}

export interface SoftwareInstallation {
  id: string;
  assetId: string;
  softwareId: string;
  installDate?: Date | null; // FIX: Changed from string to Date
  licenseKey?: string | null;
  licenseExpiry?: Date | null; // FIX: Changed from string to Date
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
  installDate?: Date | string; // FIX: Bisa Date atau string
  licenseKey?: string;
  licenseExpiry?: Date | string; // FIX: Bisa Date atau string
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

// Software CRUD Operations
export const softwareApi = {
  // Get all software
  getAll: async (): Promise<Software[]> => {
    noStore();
    try {
      const software = await db.software.findMany({
        orderBy: { name: "asc" },
      });
      console.log("Fetched all software:", software);

      return software;
    } catch (error) {
      console.error("Error fetching all software:", error);
      throw new Error("Gagal mengambil data software");
    }
  },

  // Get software by ID
  getById: async (id: string): Promise<Software> => {
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
  },

  // Create new software
  // create: async (data: CreateSoftwareData): Promise<Software> => {
  //   noStore();
  //   try {
  //     console.log("Creating software with data:", data);

  //     // Pastikan field required ada
  //     if (!data.name) {
  //       throw new Error("Software name is required");
  //     }

  //     const software = await db.software.create({
  //       data: {
  //         name: data.name,
  //         vendor: data.vendor,
  //         category: data.category,
  //         licenseType: data.licenseType,
  //         defaultExpiry: data.defaultExpiry,
  //         website: data.website,
  //         description: data.description,
  //       },
  //     });

  //     console.log("Software created successfully:", software);
  //     return software;
  //   } catch (error) {
  //     console.error("Error creating software:", error);

  //     // Berikan error message yang lebih spesifik
  //     if (error instanceof Error) {
  //       throw new Error(`Gagal membuat software baru: ${error.message}`);
  //     }

  //     throw new Error(
  //       "Gagal membuat software baru karena error tidak diketahui"
  //     );
  //   }
  // },

  // Update software
  update: async (id: string, data: UpdateSoftwareData): Promise<Software> => {
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
  },

  // Delete software
  delete: async (id: string): Promise<void> => {
    noStore();
    try {
      await db.software.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting software with id ${id}:`, error);
      throw new Error("Gagal menghapus software");
    }
  },

  // Search software by name or vendor
  search: async (query: string): Promise<Software[]> => {
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
  },

  // Get software by category
  getByCategory: async (category: string): Promise<Software[]> => {
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
  },
};

// Software Installation CRUD Operations
export const softwareInstallationApi = {
  // Get all installations
  getAll: async (): Promise<SoftwareInstallation[]> => {
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
  },

  // Get installation by ID
  getById: async (id: string): Promise<SoftwareInstallation> => {
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
  },

  // Get installations by asset ID
  getByAssetId: async (assetId: string): Promise<SoftwareInstallation[]> => {
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
      console.error(
        `Error fetching installations for asset ${assetId}:`,
        error
      );
      throw new Error("Gagal mengambil data instalasi untuk asset");
    }
  },

  // Get installations by software ID
  getBySoftwareId: async (
    softwareId: string
  ): Promise<SoftwareInstallation[]> => {
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
      console.error(
        `Error fetching installations for software ${softwareId}:`,
        error
      );
      throw new Error("Gagal mengambil data instalasi untuk software");
    }
  },

  // Create new installation
  create: async (
    data: CreateInstallationData
  ): Promise<SoftwareInstallation> => {
    noStore();
    try {
      // Handle date conversion if string is provided
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
      };

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
  },

  // Update installation
  update: async (
    id: string,
    data: UpdateInstallationData
  ): Promise<SoftwareInstallation> => {
    noStore();
    try {
      // Build data object separately
      const updateData: {
        assetId?: string;
        softwareId?: string;
        installDate?: Date;
        licenseKey?: string;
        licenseExpiry?: Date;
        version?: string;
        isActive?: boolean;
      } = {};

      // Only include fields that are provided
      if (data.assetId !== undefined) updateData.assetId = data.assetId;
      if (data.softwareId !== undefined)
        updateData.softwareId = data.softwareId;
      if (data.licenseKey !== undefined)
        updateData.licenseKey = data.licenseKey;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      // Handle date conversions
      if (data.installDate) {
        updateData.installDate =
          typeof data.installDate === "string"
            ? new Date(data.installDate)
            : data.installDate;
      }

      if (data.licenseExpiry) {
        updateData.licenseExpiry =
          typeof data.licenseExpiry === "string"
            ? new Date(data.licenseExpiry)
            : data.licenseExpiry;
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
  },

  // Delete installation
  delete: async (id: string): Promise<void> => {
    noStore();
    try {
      await db.softwareInstallation.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting installation with id ${id}:`, error);
      throw new Error("Gagal menghapus instalasi");
    }
  },

  // Toggle installation active status
  toggleActive: async (
    id: string,
    isActive: boolean
  ): Promise<SoftwareInstallation> => {
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
      console.error(
        `Error toggling active status for installation ${id}:`,
        error
      );
      throw new Error("Gagal mengubah status aktif instalasi");
    }
  },

  // Get expiring installations
  getExpiring: async (days: number = 30): Promise<SoftwareInstallation[]> => {
    noStore();
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);

      const installations = await db.softwareInstallation.findMany({
        where: {
          licenseExpiry: {
            lte: targetDate,
            gte: new Date(), // hanya yang belum kadaluarsa
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
      console.error(
        `Error fetching expiring installations for ${days} days:`,
        error
      );
      throw new Error("Gagal mengambil data instalasi yang akan kadaluarsa");
    }
  },
};

// Utility functions - FIX: handle Date objects
export const softwareUtils = {
  // Format license expiry date - FIX: handle Date objects
  formatExpiryDate: (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return "Tidak ada tanggal";

    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return `Kadaluarsa ${Math.abs(diffDays)} hari yang lalu`;
      } else if (diffDays === 0) {
        return "Kadaluarsa hari ini";
      } else {
        return `${diffDays} hari lagi`;
      }
    } catch (error) {
      console.error("Error formatting expiry date:", error);
      return "Format tanggal tidak valid";
    }
  },

  // Get license status - FIX: handle Date objects
  getLicenseStatus: (
    expiryDate: Date | string | null | undefined
  ): "active" | "expiring" | "expired" => {
    if (!expiryDate) return "active";

    try {
      const expiry =
        expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "expired";
      if (diffDays <= 30) return "expiring";
      return "active";
    } catch (error) {
      console.error("Error calculating license status:", error);
      return "active";
    }
  },

  // Calculate expiry date from installation date - FIX: handle Date objects
  calculateExpiryDate: (
    installDate: Date | string,
    defaultExpiryMonths?: number
  ): Date | null => {
    if (!defaultExpiryMonths) return null;

    try {
      const install =
        installDate instanceof Date ? installDate : new Date(installDate);
      install.setMonth(install.getMonth() + defaultExpiryMonths);
      return install;
    } catch (error) {
      console.error("Error calculating expiry date:", error);
      return null;
    }
  },

  // Get license status color
  getLicenseStatusColor: (
    status: "active" | "expiring" | "expired"
  ): string => {
    switch (status) {
      case "active":
        return "green";
      case "expiring":
        return "orange";
      case "expired":
        return "red";
      default:
        return "gray";
    }
  },

  // Convert Date to string for display - NEW: helper untuk formatting
  formatDateForDisplay: (date: Date | null | undefined): string => {
    if (!date) return "-";
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Convert Date to ISO string for forms - NEW: helper untuk form input
  formatDateForInput: (date: Date | null | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  },
};

// Export sebagai named object untuk menghindari eslint error
const apiExports = {
  software: softwareApi,
  installation: softwareInstallationApi,
  utils: softwareUtils,
};

export default apiExports;

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

export const fetchSoftwareById = async (id: string) => {
  noStore();
  try {
    const software = await db.software.findUnique({
      where: { id },
    });
    return software;
  } catch (error) {
    console.error("Error fetching software by id:", error);
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
