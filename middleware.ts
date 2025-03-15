import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

import { Session } from "next-auth";

interface CustomNextRequest extends NextRequest {
  auth?: Session | null;
}

export default auth(async (req: CustomNextRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isNextAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (isApiAuthRoute || isNextAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isLoggedIn) {
    const userRole = token?.role;
    //  console.log("Login Sebagai", userRole);

    if (userRole === 'USER' && nextUrl.pathname.startsWith('/dashboard')) {
      // console.log("LOGIN SEBAGAI USER",  token?.email);
    }
    else if (userRole === 'ADMIN' && nextUrl.pathname.startsWith('/dashboard')) {
      // console.log("LOGIN SEBAGAI ADMIN", token?.email);
    } else if (userRole === 'TECNICIAN' && nextUrl.pathname.startsWith('/dashboard')) {
      // console.log("LOGIN SEBAGAI ADMIN", token?.email);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
