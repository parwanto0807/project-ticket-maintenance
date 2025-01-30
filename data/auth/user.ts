import { db } from "@/lib/db";
// Contoh tipe User

interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null; // Ini bisa null jika pengguna tidak memiliki password
    isTwoFactorEnabled: boolean;
    role: string;
}
// interface Email {
//     id : string;
//     email: string | null; 
// }

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await db.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error("Error while fetching user by email:", error);
        return null;
    }
};


export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        return user;
    } catch {
        return null;
    }
}

export const getEmailMaster = async (email: string) => {
    try {
        const foundEmail = await db.accountEmail.findFirst({ where: { email: email } });
        return foundEmail;
    } catch (error) {
        console.error("Error while fetching user by email:", error);
        return null;
    }
}

