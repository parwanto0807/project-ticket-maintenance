import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";
import FloatingBackButton from "@/components/backToHome";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

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
    <html lang="en" suppressHydrationWarning>
      <body className="relative">
        <ThemeProvider>
          <SessionProvider session={session ?? null}>
            {children}
            <FloatingBackButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}