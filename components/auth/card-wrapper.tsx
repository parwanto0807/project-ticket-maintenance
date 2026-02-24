// components/auth/card-wrapper.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string | React.ReactNode;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md shadow-2xl bg-white/70 backdrop-blur-xl border-white/40 mx-auto">
      <CardHeader className="space-y-1 pt-6 sm:pt-8 px-4 sm:px-6">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="pb-6 sm:pb-8 px-4 sm:px-6">
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter className="pb-6 sm:pb-8 px-4 sm:px-6">
          <Social />
        </CardFooter>
      )}
      {backButtonLabel && backButtonHref && (
        <CardFooter className="pb-4 sm:pb-8 px-4 sm:px-6 border-t border-slate-100">
          <BackButton
            label={backButtonLabel}
            href={backButtonHref}
          />
        </CardFooter>
      )}
    </Card>
  );
};