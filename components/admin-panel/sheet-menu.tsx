import { Sheet, SheetHeader, SheetContent, SheetTrigger,SheetTitle,SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "@/components/admin-panel/menu";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
        <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/Saitec.png"
                alt="SAITEC Prima Mandiri"
                width={60}
                height={40}
                className="w-auto h-auto"
              />
            </Link>
          </Button>
        <SheetTitle className="text-orange-600">SAITEC Prima Mandiri</SheetTitle>
          <SheetDescription>
            To get more smart a meter
          </SheetDescription>
        </SheetHeader>
        <Menu isOpen role="ADMIN" />
      </SheetContent>
    </Sheet>
  );
}
