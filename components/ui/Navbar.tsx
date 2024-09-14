import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className="flex flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          className="max-sm:size-10"
          alt="Yapper Logo"
          width={32}
          height={32}
        />
        <p className="text-[26px] font-bold text-white max-sm:hidden">Yapper</p>
      </Link>

      <div className="flex flex-between gap-5">
        {/* CLERK USER MANAGEMENT */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
