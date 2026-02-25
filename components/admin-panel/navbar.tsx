import { ModeToggle } from "../mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { NotificationBell } from "@/components/NotificationBell";
import { LanguageSwitcher } from "../LanguageSwitcher";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-2 sm:mx-8 flex h-16 sm:h-20 items-center">
        <div className="flex items-center space-x-2 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold text-sm sm:text-lg tracking-tight">{title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <LanguageSwitcher />
          <NotificationBell />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
