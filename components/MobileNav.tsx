"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathName = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="Hamburger Menu"
            width={36}
            height={36}
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              className="max-sm:size-10"
              alt="Yapper Logo"
              width={32}
              height={32}
            />
            <p className="text-[26px] font-bold text-white max-sm:hidden">
              Yapper
            </p>
          </Link>

          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex flex-col h-full gap-6 pt-6 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathName === item.route && pathName.startsWith(item.route);

                  return (
                    <SheetClose key={item.label} asChild>
                      <Link
                        href={item.route}
                        className={cn(
                          "flex gap-4 items-center p-4 rounded-lg justify-start max-w-60",
                          { "bg-blue-1": isActive }
                        )}
                      >
                        <Image
                          src={item.imgUrl}
                          alt={`${item.label} icon`}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
