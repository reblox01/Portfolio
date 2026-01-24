import { useMyContext } from "@/app/MyContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const ContactMe = () => {
  const data = useMyContext();
  return (
    <div className="max-w-8xl mx-auto px-8 relative   my-10 flex flex-col items-center justify-between gap-10 lg:flex-row">
      <div className="">
        <h2 className="text-center text-3xl font-bold text-onyx dark:text-white lg:text-left lg:text-5xl">
          Let’s work together
        </h2>
        <p className="mt-4 text-center text-lg md:text-xl text-onyx lg:text-left">
          Want to discuss an opportunity to create something great?{" "}
          <br className="hidden lg:inline-block" /> I’m ready when you are.
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="group relative overflow-hidden bg-primary px-8 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-primary/25"
      >
        <Link href="/contact" className="flex items-center gap-2">
          <div className="relative z-10 flex items-center gap-2">
            <Sparkles className="h-6 w-6 transition-transform" />
            <span className="font-semibold">Get in Touch</span>
          </div>
          <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
        </Link>
      </Button>
    </div>
  );
};
export default ContactMe;
