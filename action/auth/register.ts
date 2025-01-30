"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
//import { revalidatePath, revalidateTag } from "next/cache";
import { RegisterSchema, RegisterSchemaEmail } from "@/schemas";
import { getUserByEmail } from "@/data/auth/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";


export const registerEmail = async (values: z.infer<typeof RegisterSchemaEmail>) => {
    const validatedFields = RegisterSchemaEmail.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!"};
    }
    const {email} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser){
        return { error: "Email already in use!"};
    }

    await db.accountEmail.create({
        data: {
            email,
        }
    });
    return { success: "Register Email successfully!" };
}

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!"};
    }
    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser){
        return { error: "Email already in use!"};
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });
        // TODO : Send verification token email

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )
    return { success: "Confirmation email sent!" };
}