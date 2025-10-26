"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CreateSoftwareData, UpdateSoftwareData } from "@/schemas/software";

// Types

// Create Software
export async function createSoftware(formData: CreateSoftwareData) {
  try {
    // Validate required fields
    if (!formData.name || formData.name.trim() === "") {
      return {
        success: false,
        error: "Software name is required",
      };
    }

    // Create software in database
    const software = await db.software.create({
      data: {
        name: formData.name.trim(),
        vendor: formData.vendor?.trim() || null,
        category: formData.category?.trim() || null,
        licenseType: formData.licenseType || "Proprietary",
        defaultExpiry: formData.defaultExpiry || null,
        website: formData.website?.trim() || null,
        description: formData.description?.trim() || null,
      },
    });

    // Revalidate the software list page
    revalidatePath("/dashboard/master/software");

    return {
      success: true,
      data: software,
      message: "Software created successfully",
    };
  } catch (error) {
    console.error("Error creating software:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error: "Software with this name already exists",
        };
      }

      return {
        success: false,
        error: `Failed to create software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while creating software",
    };
  }
}

// Update Software
export async function updateSoftware(id: string, formData: UpdateSoftwareData) {
  try {
    // Validate required fields
    if (formData.name && formData.name.trim() === "") {
      return {
        success: false,
        error: "Software name cannot be empty",
      };
    }

    // Check if software exists
    const existingSoftware = await db.software.findUnique({
      where: { id },
    });

    if (!existingSoftware) {
      return {
        success: false,
        error: "Software not found",
      };
    }

    // Update software in database
    const software = await db.software.update({
      where: { id },
      data: {
        name: formData.name?.trim(),
        vendor: formData.vendor?.trim(),
        category: formData.category?.trim(),
        licenseType: formData.licenseType,
        defaultExpiry: formData.defaultExpiry,
        website: formData.website?.trim(),
        description: formData.description?.trim(),
      },
    });

    // Revalidate the software list page and detail page
    revalidatePath("/dashboard/master/software");
    revalidatePath(`/dashboard/master/software/${id}`);

    return {
      success: true,
      data: software,
      message: "Software updated successfully",
    };
  } catch (error) {
    console.error("Error updating software:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error: "Software with this name already exists",
        };
      }

      return {
        success: false,
        error: `Failed to update software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while updating software",
    };
  }
}

// Delete Software
export async function deleteSoftware(id: string) {
  try {
    const existingSoftware = await db.software.findUnique({
      where: { id },
      include: {
        installations: true,
      },
    });

    if (!existingSoftware) {
      return {
        success: false,
        error: "Software not found",
      };
    }

    // Check if software has installations
    if (existingSoftware.installations.length > 0) {
      return {
        success: false,
        error:
          "Cannot delete software that has installations. Please remove all installations first.",
      };
    }

    // Delete software from database
    await db.software.delete({
      where: { id },
    });

    // Revalidate the software list page
    revalidatePath("/dashboard/master/software");

    return {
      success: true,
      message: "Software deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting software:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to delete software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while deleting software",
    };
  }
}

// Get Software by ID
export async function getSoftwareById(id: string) {
  try {
    const software = await db.software.findUnique({
      where: { id },
    });

    if (!software) {
      return {
        success: false,
        error: "Software not found",
      };
    }

    return {
      success: true,
      data: software,
    };
  } catch (error) {
    console.error("Error fetching software:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to fetch software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching software",
    };
  }
}

// Get All Software
export async function getAllSoftware() {
  try {
    const software = await db.software.findMany({
      orderBy: { name: "asc" },
    });

    return {
      success: true,
      data: software,
    };
  } catch (error) {
    console.error("Error fetching all software:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to fetch software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching software",
    };
  }
}

// Search Software
export async function searchSoftware(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const skip = (page - 1) * limit;

    const [software, totalCount] = await Promise.all([
      db.software.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { vendor: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      db.software.count({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { vendor: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: {
        software,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error searching software:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to search software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while searching software",
    };
  }
}

// Get Software Count for Pagination
export async function getSoftwareCount(query: string = "") {
  try {
    const count = await db.software.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { vendor: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return {
      success: true,
      data: count,
    };
  } catch (error) {
    console.error("Error counting software:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: `Failed to count software: ${error.message}`,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while counting software",
    };
  }
}
