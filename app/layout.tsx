import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Asset Management",
  description: "To get protect your asset",
  manifest: "/manifest.json",
};
export const viewport = {
  themeColor: "#ffffff",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
       <SessionProvider session={session ?? null}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
