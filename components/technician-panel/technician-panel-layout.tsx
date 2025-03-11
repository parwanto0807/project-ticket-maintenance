"use client";

import React from "react";

export default function TechnicianPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col bg-orange-50 dark:bg-gradient-to-t from-slate-800 to-slate-900">
        <main className="flex-grow">{children}</main>
    </div>
  );
}
