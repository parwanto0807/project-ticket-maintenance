"use client";

import Link from "next/link";
import { Ellipsis, LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

// Menambahkan prop `role` di sini untuk menerima informasi role
interface MenuProps {
  isOpen: boolean | undefined;
  role: string; // Menambahkan role ke props
}

export function Menu({ isOpen }: MenuProps) { // Menggunakan role dari props
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || 'USER';
  // console.log("Role in getMenuList:", role);

  // Mengambil menu berdasarkan role pengguna
  const menuList = getMenuList(pathname, role); // Menyaring menu berdasarkan role
  // console.log("Role", role);
  return (
    <ScrollArea className="[&>div>div[style]]:!block ">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus, disabled }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "blue" : "ghost"}
                              className={cn(
                                "w-full justify-start h-10 mb-1 transition-all duration-300 group",
                                active
                                  ? "shadow-lg shadow-blue-500/30 text-white"
                                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                              )}
                              asChild
                              disabled={disabled}
                            >
                              <Link href={href} className="flex items-center">
                                <span
                                  className={cn(
                                    "transition-transform duration-300 group-hover:scale-110",
                                    isOpen === false ? "" : "mr-4"
                                  )}
                                >
                                  <Icon width={18} height={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate font-medium",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon as LucideIcon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
