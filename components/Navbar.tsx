"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NavbarLinks } from "./NavbarLinks";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "./ThemeToggler";
import { useMyContext } from "@/app/MyContext";
import { motion } from "framer-motion";

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Navbar = () => {
  const data = useMyContext();
  return (
    <header className="fixed z-50 dark:bg-black top-0 flex h-14 w-full items-center border-b bg-white px-4 shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-screen-2xl">
        <motion.div
          className="flex-shrink-0"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Logo name={data?.name || ""} />
        </motion.div>
        <motion.div
          className="flex flex-grow items-center justify-center"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NavbarLinks />
        </motion.div>
        <div className="flex items-center justify-between space-x-4 md:block md:w-auto">
          <div className="flex gap-2 items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <ThemeToggler />
            <SignedOut>
              <Button
                className="hidden md:flex"
                size="default"
                variant="default"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};
