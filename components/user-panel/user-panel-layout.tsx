"use client";

import React, { useEffect, useState } from "react";
import BottomNav from "./bottom-nav";
import { getMenuList } from "@/lib/menu-list";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function UserPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  const [clientPathname, setClientPathname] = useState("");

  // Hindari akses `window.location.pathname` di SSR
  useEffect(() => {
    setClientPathname(window.location.pathname);
  }, []);

  const role = user?.role || "USER";
  // Dapatkan daftar menu berdasarkan path yang sudah diperbaiki
  const menuGroups = getMenuList(clientPathname, role);
  const allMenus = menuGroups.flatMap((group) => group.menus);

  return (
    <div className="min-h-screen flex flex-col bg-orange-50 dark:bg-gradient-to-t from-slate-800 to-slate-900">
        <main className="flex-grow">{children}</main>
      <BottomNav menus={allMenus} />
    </div>
  );
}
