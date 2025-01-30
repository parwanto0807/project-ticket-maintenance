"use server"
import moment from "moment-timezone";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/auth/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";

export const newVerification = async (token: string) => { 
    const jakartaTime = moment.tz('Asia/jakarta').toDate();

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return  { error: "Token does not exist!"};
    };

    const hasExpired = new Date(existingToken.expires) < new Date(jakartaTime);

    if (hasExpired) {
        return { error: "Token has expired"};
    };

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: "Email does not exist!"};
    };

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(jakartaTime),
            email: existingToken.email
        }
    });

    await db.verificationToken.delete({
        where: {id: existingToken.id }
    });

    return { success: "Email verified!"};
};