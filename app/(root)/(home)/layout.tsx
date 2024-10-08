import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Yapper",
  description: "A Video Conferencing App",
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative">
      {/* NAVIGATION */}
      <Navbar />
      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full ">{children}</div>
        </section>
      </div>
      {/* FOOTER */}
      Footer
    </main>
  );
};
export default HomeLayout;
