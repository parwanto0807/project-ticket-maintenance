"use client";

import { Navbar } from "@/components/admin-panel/navbar";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  const { t } = useTranslation();
  const translatedTitle = t(title.toLowerCase().replace(/\s+/g, '_') as TranslationKeys) || title;

  return (
    <div className="overflow-hidden">
      <Navbar title={translatedTitle} />
      <div className="pt-4 sm:pt-8 pb-8 px-1 sm:px-4">{children}</div>
    </div>
  );
}
