import NextAuth, { User as NextAuthUser } from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserByEmail, getUserById, getEmailMaster } from "@/data/auth/user";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";
import { getAccountByUserId } from "./data/auth/account";
import { LoginSchema } from "@/schemas";

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: string;
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
  }
}

const { providers: authConfigProviders, ...restAuthConfig } = authConfig;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            console.log('Pengguna tidak ditemukan atau tidak memiliki password');
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      }
    }),
    ...(authConfigProviders || [])
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    signOut: "/auth/logout",
    verifyRequest: "/auth/verify-request",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
    }
  },

  callbacks: {
    async signIn({ user, account }) {
      const email = user.email;

      if (!email || typeof email !== "string") {
        console.error("User Email is missing or invalid");
        return false;
      }
      const existingEmail = await getEmailMaster(email);
      if (!existingEmail) {
        console.log("User not found, redirecting to login with error");
        return "/auth/login?error=NotRegistered";
      }

      if (!user.id || typeof user.id !== "string") {
        console.error("User ID is missing or invalid");
        return false;
      }

      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        console.error("User email not verified");
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) {
          console.error("Two-factor confirmation not found");
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }
      return true;
    },

    async session({ token, session }: { token: any; session: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.role = token.role as UserRole;
      }
      return session;
    },


    async jwt({ token }: { token: any }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  ...restAuthConfig,
});
