"use client";

import Link from "next/link";
import { SignedOut, useAuth, useUser } from "@clerk/nextjs";
import {
  Home,
  Layers,
  FolderGit2,
  GraduationCap,
  Mail,
  Menu,
  X,
  User,
  LayoutDashboard,
  ScanFace
} from "lucide-react";
import { useMyContext } from "@/app/MyContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const links: {
  title: string;
  href: string;
  icon?: any;
  isOpenIcon?: any;
}[] = [
    {
      title: "Techstack",
      href: "/techstack",
      icon: <Layers className="w-6 h-6 text-faint-white dark:text-white" />,
      isOpenIcon: <Layers className="w-6 h-6 text-faint-white dark:text-white" />,
    },
    {
      title: "About",
      href: "/about",
      icon: <User className="w-6 h-6 text-faint-white dark:text-white" />,
      isOpenIcon: <User className="w-6 h-6 text-faint-white dark:text-white" />,
    },
    {
      title: "Home",
      href: "/",
      icon: <Home className="w-6 h-6 text-faint-white dark:text-white" />,
      isOpenIcon: <Home className="w-6 h-6 text-faint-white dark:text-white" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <FolderGit2 className="w-6 h-6 text-faint-white dark:text-white" />,
      isOpenIcon: <FolderGit2 className="w-6 h-6 text-faint-white dark:text-white" />,
    },
  ];
const MobileNavbar = () => {
  const { userId } = useAuth();
  const data = useMyContext();
  const pathname = usePathname();
  const isActive = (path: any) => path === pathname;
  //copy
  const [isOpen, setIsOpen] = useState(false);
  //copy
  return (
    <div className="fixed inset-x-0 bottom-0 z-[99999] block px-4 pb-6 lg:hidden">
      <div className="flex h-16 w-full items-center justify-between rounded-2xl border-[1px] border-onyx/30 bg-onyx/30 px-4 backdrop-blur-md dark:border-card-border/60 dark:bg-[#18181D]/30">
        <nav className="w-full">
          <ul className="flex items-center justify-between gap-4">
            {links.map((link) => {
              return (
                <li
                  className="group flex flex-1 items-center justify-center rounded-lg bg-transparent  text-light-gray hover:bg-black/10 dark:hover:bg-white/10 "
                  key={link.title}>
                  <Link
                    onClick={() => setIsOpen(false)}
                    className={
                      isActive(link?.href)
                        ? "flex w-full  items-center justify-center py-2 bg-black/30 dark:bg-white/10 rounded-lg "
                        : "flex w-full  items-center justify-center py-2"
                    }
                    href={link.href}>
                    {isActive(link?.href) ? link?.isOpenIcon : link?.icon}
                  </Link>
                </li>
              );
            })}
            <li className="group flex flex-1 items-center justify-center rounded-lg bg-transparent  text-light-gray hover:bg-black/10 dark:hover:bg-white/10">
              <button
                className={"flex w-full  items-center justify-center py-2"}
                onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                  <X className="w-6 h-6 text-faint-white dark:text-white" />
                ) : (
                  <>
                    <Menu className="w-6 h-6 text-faint-white dark:text-white" />
                  </>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ul
        className={cn(
          "absolute inset-x-0 bottom-0 z-[-1] flex flex-col gap-2 rounded-t-2xl border-[1px] border-onyx/30 dark:border-card-border/60 bg-onyx/30 dark:bg-[#18181D]/90 p-4 backdrop-blur-xl transition-all duration-300 pt-6 max-h-[80vh] overflow-y-auto pb-24",
          !isOpen && "translate-y-[500px]"
        )}>
        <li>
          <Link
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            href="/certification">
            <GraduationCap className="w-6 h-6 opacity-70" />
            Certification
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            href="/experience">
            <Layers className="w-6 h-6 opacity-70" />
            Experience
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            href="/education">
            <GraduationCap className="w-6 h-6 opacity-70" />
            Education
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            href="/contact">
            <Mail className="w-6 h-6 opacity-70" />
            Contact
          </Link>
        </li>
        <SignedOut>
          <li className=" ">
            <Link
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              href="/sign-in">
              <ScanFace className="w-6 h-6 opacity-70" />
              Access
            </Link>
          </li>
        </SignedOut>
        {data?.adminUserId === userId && (
          <li>
            <Link
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg justify-start items-center font-medium transition flex w-full gap-4 bg-onyx/30 px-4 py-4 text-black dark:text-white hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              href="/dashboard">
              <LayoutDashboard className="w-6 h-6 opacity-70" />
              Dashboard
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
export default MobileNavbar;
