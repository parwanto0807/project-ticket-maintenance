import {  UserRole } from "@prisma/client";
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
    picture: z.string().min(3),
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
        .union([z.string(), z.number()]) // Menerima string atau number
        .refine((value) => typeof value === 'number' || !isNaN(Number(value)), {
            message: "Harga harus berupa angka",
        })
        .transform((value) => typeof value === 'string' ? parseFloat(value) : value), // Hanya parse string, biarkan number
    hargaJual: z
        .union([z.string(), z.number()]) // Menerima string atau number
        .refine((value) => typeof value === 'number' || !isNaN(Number(value)), {
            message: "Harga harus berupa angka",
        })
        .transform((value) => typeof value === 'string' ? parseFloat(value) : value), // Hanya parse string, biarkan number
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
    name: z.string().min(1, {
        message: "Bank name is required"
    }),
    account: z.string().min(5, {
        message: "A/C bank is required"
    }),
    branch: z.string().min(1, {
        message: "Branch bank is required"
    }),
    address: z.string().min(1, {
        message: "Address is required"
    })
})

export const Tax_Schema = z.object({
    ppn: z.number(),
    defaultAs: z.boolean(),
})