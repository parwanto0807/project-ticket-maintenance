import { UserRole, AssetStatus } from "@prisma/client";
import * as z from "zod";

export const SettingSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})

    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }
        return true;
    }, {
        message: "New Password is required",
        path: ["newPassword"]
    })

    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "Password is required",
        path: ["password"]
    })

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum of 6 character required"
    }),
    name: z.string().min(1, {
        message: "Name is required",
    })
})

export const RegisterSchemaEmail = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 character required"
    }),
});


export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});


// PRODUCT SCHEMA 

export const UnitSchema = z.object({
    name: z.string().min(1, {
        message: "Unit name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})

export const TypeSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})

export const CategorySchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})
export const GroupSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})
export const BrandSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})
export const GudangSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})
export const LokasiRakSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})
export const RakSchema = z.object({
    name: z.string().min(1, {
        message: "Type name is required"
    }),
    note: z.string().min(1, {
        message: "Note is required"
    })
})

export const ProductSchema = z.object({
    part_number: z.string().min(1, {
        message: "Part number is required"
    }),
    part_name: z.string().min(1, {
        message: "Part name is required"
    }),
    nick_name: z.string().min(1, {
        message: "Nick name is required"
    }),
    satuan_pemasukan: z.string().min(1, {
        message: "Unit in is required"
    }),
    satuan_penyimpanan: z.string().min(1, {
        message: "Unit stock is required"
    }),
    satuan_pengeluaran: z.string().min(1, {
        message: "Unit out is required"
    }),
    conversi_pemasukan: z.coerce.number().min(1, {
        message: "Conversi unit in is required"
    }),
    conversi_penyimpanan: z.coerce.number().min(1, {
        message: "Conversi unit stock is required"
    }),
    conversi_pengeluaran: z.coerce.number().min(1, {
        message: "Conversi unit out is required"
    }),
    description: z.string().min(5, {
        message: "Minimum 5 character required"
    }),
    minStock: z.coerce.number().min(0),
    maxStock: z.coerce.number().min(0),
    groupId: z.string().min(1, {
        message: "Group is required"
    }),
    brandId: z.string().min(3, {
        message: "Brand is required"
    }),
    kategoriId: z.string().min(3, {
        message: "Category is required"
    }),
    jenisId: z.string().min(3, {
        message: "Type is required"
    }),
    gudangId: z.string().min(3, {
        message: "Gudang is required"
    }),
    rakId: z.string().min(3, {
        message: "Gudang is required"
    }),
    lokasiRakId: z.string().min(3, {
        message: "Gudang is required"
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const EmployeeSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(5, {
        message: "Email id required"
    }),
    address: z.string().min(5, {
        message: "Address is required"
    }),
    picture: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    userDept: z.string().min(3, {
        message: "Depteartment is required"
    }),
})

export const EmployeeSchemaCreate = z.object({
    name: z.string().min(3),
    email: z.string().min(5, {
        message: "Email id required"
    }),
    address: z.string().min(5, {
        message: "Address is required"
    }),
    userDept: z.string().min(3, {
        message: "Depteartment is required"
    }),
    picture:z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
})

export const DeptSchema = z.object({
    dept_name: z.string().min(1),
    note: z.string().min(1)
})

// HARGA SCHEMA
export const PriceSchema = z.object({
    idProduct: z.string().min(3, {
        message: "Product is required",
    }),
    hargaHpp: z
        .union([z.string(), z.number(), z.any()]) // Tambahkan `z.any()` untuk menangani Decimal
        .refine((value) => {
            if (typeof value === 'object' && value !== null && 'toNumber' in value) {
                return true; // Jika Decimal, biarkan lolos
            }
            return typeof value === 'number' || !isNaN(Number(value));
        }, {
            message: "Harga harus berupa angka",
        })
        .transform((value) => {
            if (typeof value === 'object' && value !== null && 'toNumber' in value) {
                return value.toNumber(); // Konversi Decimal ke number
            }
            return typeof value === 'string' ? parseFloat(value) : value;
        }),
    hargaJual: z
        .union([z.string(), z.number(), z.any()]) // Tambahkan `z.any()` untuk menangani Decimal
        .refine((value) => {
            if (typeof value === 'object' && value !== null && 'toNumber' in value) {
                return true;
            }
            return typeof value === 'number' || !isNaN(Number(value));
        }, {
            message: "Harga harus berupa angka",
        })
        .transform((value) => {
            if (typeof value === 'object' && value !== null && 'toNumber' in value) {
                return value.toNumber();
            }
            return typeof value === 'string' ? parseFloat(value) : value;
        }),
    default: z.boolean(),
    idMtUang: z.string().min(1, {
        message: "Mata uang is required",
    }),
});


export const MtUang_Schema = z.object({
    name: z.string().min(1, {
        message: "Name currency is required"
    }),
    note: z.string().min(1, {
        message: "Note / KODE ISO currensi is required"
    })
})
export const Bank_Schema = z.object({
    name: z.string().min(1, { message: "Bank name is required" }),
    account: z.string().min(5, { message: "A/C bank is required" }),
    branch: z.string().min(1, { message: "Branch bank is required" }),
    address: z.string().min(1, { message: "Address is required" })
})

export const Tax_Schema = z.object({
    ppn: z.number(),
    defaultAs: z.boolean(),
})

export const AssetSchema = z.object({
    assetNumber: z.string().nonempty({ message: "Asset number cannot be empty" }),
    status: z.nativeEnum(AssetStatus, { message: "Invalid status" }),
    location: z.string().nullable().optional(),
    purchaseDate: z.date().optional().refine(date => date !== undefined && !isNaN(date.getTime()), { message: "Invalid purchase date" }),
    purchaseCost: z.number().nonnegative({ message: "Purchase cost must be a non-negative number" }).optional(),
    residualValue: z.number().nonnegative({ message: "Residual value must be a non-negative number" }).optional(),
    usefulLife: z.number().int().nonnegative({ message: "Useful life must be a non-negative integer" }).optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()).refine(date => date <= new Date(), { message: "UpdatedAt can't be in the future" }),
    assetTypeId: z.string().nonempty({ message: "Asset type ID cannot be empty" }),
    productId: z.string().nonempty({ message: "Product ID cannot be empty" }),
    departmentId: z.string().nonempty({ message: "Department ID cannot be empty" }),
    employeeId: z.string().nullable().optional().or(z.literal("")),
    assetImage1: z.instanceof(File).refine((file) => file.size > 0, { message: "Asset image is requires" }).refine((file) => file.size === 0 || file.type.startsWith("image/"), { message: "Only Images Allowed", }).refine((file) => file.size < 4000000, { message: "Asset image size is too large" }),
});

export const AssetTypeSchema = z.object({
    name: z.string().min(1, "Nama jenis aset harus diisi"), // Nama aset tidak boleh kosong
    description: z.string().optional().nullable(), // Deskripsi bisa kosong
    kode: z.string().min(1, "Kode aset harus diisi"), // Kode wajib diisi
    createdAt: z.date().optional(), // Nilai default dari database
    updatedAt: z.date().optional(), // Nilai akan diperbarui otomatis
});


// Schema untuk TicketMaintenance
export const CreateTicketMaintenanceSchema = z.object({
    troubleUser: z.string().min(1, "Trouble user is required"), // User yang melaporkan masalah wajib diisi
    analisaDescription: z.string().nullable().optional(), // Opsional
    actionDescription: z.string().nullable().optional(), // Opsional
    priorityStatus: z.enum(["Low", "Medium", "High", "Critical"]).default("Low"), // Enum dengan nilai default
    status: z.enum(["Pending", "Assigned", "In_Progress", "Completed"]).default("Pending"), // Enum dengan nilai default
    createdAt: z.date().default(new Date()), // Tanggal dibuat, default sekarang
    updatedAt: z.date().default(new Date()), // Tanggal diperbarui, default sekarang
    scheduledDate: z.date().optional(), // Opsional
    completedDate: z.date().optional(), // Opsional
    employeeId: z.string().min(1,"User asset is required"), // UUID validasi
    assetId: z.string().min(1, "Asset name is required"), // UUID validasi
    ticketNumber: z.string().min(1, "Ticket number is required"), // ✅ Tambahkan ticketNumber
    countNumber: z.number().int().min(1, "Count number is required"), // ✅ Tambahkan countNumber
    ticketImage1: z.string().nullable().optional(), // Opsional
  });

  export const CreateTicketMaintenanceOnAssignSchema = z.object({
    troubleUser: z.string().min(1, "Trouble user is required"), // User yang melaporkan masalah wajib diisi
    analisaDescription: z.string().nullable().optional(), // Opsional
    actionDescription: z.string().nullable().optional(), // Opsional
    priorityStatus: z.enum(["Low", "Medium", "High", "Critical"]).default("Low"), // Enum dengan nilai default
    status: z.enum(["Pending","Assigned", "In_Progress", "Completed"]).default("Pending"), // Enum dengan nilai default
    createdAt: z.date().default(new Date()), // Tanggal dibuat, default sekarang
    updatedAt: z.date().default(new Date()), // Tanggal diperbarui, default sekarang
    scheduledDate: z.date().optional(), // Opsional
    completedDate: z.date().optional(), // Opsional
    employeeId: z.string().min(1,"User asset is required"), // UUID validasi
    technicianId: z.string().optional(),
    assetId: z.string().min(1, "Asset name is required"), // UUID validasi
    ticketNumber: z.string().min(1, "Ticket number is required"), // ✅ Tambahkan ticketNumber
    countNumber: z.number().int().min(1, "Count number is required"), // ✅ Tambahkan countNumber
  });
  
// Schema untuk memperbarui TicketMaintenance (opsional fields)
export const UpdateTicketMaintenanceSchema = CreateTicketMaintenanceSchema.partial();


// Schema untuk ScheduleMaintenance
export const ScheduleMaintenanceSchema = z.object({
  id: z.string().uuid(), // UUID validasi
  scheduledDate: z.date(), // Tanggal penjadwalan wajib diisi
  completedDate: z.date().optional(), // Opsional
  notes: z.string().optional(), // Opsional
  ticketId: z.string().uuid(), // UUID validasi
});

// Schema untuk membuat ScheduleMaintenance baru (tanpa id)
export const CreateScheduleMaintenanceSchema = ScheduleMaintenanceSchema.omit({
  id: true,
});

// Schema untuk memperbarui ScheduleMaintenance (opsional fields)
export const UpdateScheduleMaintenanceSchema = CreateScheduleMaintenanceSchema.partial();

export const TechnicianSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  phone: z.string().optional().refine((val) => !val || /^[0-9+]{10,15}$/.test(val), {
    message: "Nomor telepon harus valid (10-15 digit angka atau + untuk kode negara)",
  }),
  email: z.string().email("Format email tidak valid").optional(),
  specialization: z.string().min(3, "Spesialisasi minimal 3 karakter").max(200, "Spesialisasi maksimal 200 karakter"),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]),
});
