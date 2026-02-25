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
    <div>
      <Navbar title={translatedTitle} />
      <div className="max-h-screen pt-4 sm:pt-8 pb-8 px-0 sm:px-6">{children}</div>
    </div>
  );
}
