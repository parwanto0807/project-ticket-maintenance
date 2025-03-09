export const runtime = "nodejs";

import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { getUserByEmail } from "@/data/auth/user";
import { LoginSchema } from "@/schemas";


// console.log("auth.config.ts: Starting configuration");

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET || !process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  console.error("auth.config.ts: Missing environment variables");
} else {
  console.log("auth.config.ts: All environment variables are present");
}

export default {
    providers: [
        Github({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        
        Google({ 
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        Credentials({
            async authorize(credentials) {
                // console.log('Kredensial diterima:', credentials);
                const validatedFields = LoginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    // console.log('Pengguna ditemukan:', user);

                    if (!user || !user.password) {
                        console.log('Pengguna tidak ditemukan atau tidak memiliki password');
                    return null;
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    // console.log('Password cocok:', passwordMatch);

                    if (passwordMatch) 
                        // console.log('Validasi berhasil Auth-Config.ts', user);    
                    return user;
                }
                return null;
            }
        })
    ],
    trustHost: true,  // Add this line to trust the host
} satisfies NextAuthConfig;