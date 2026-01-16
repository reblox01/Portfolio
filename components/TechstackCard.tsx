import { Techstack } from "@/lib/types/techstack-types";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const TechstackCard = ({ category, imageUrl, title, url }: Techstack) => {
  return (
    <Link
      href={url}
      target="_blank"
      className="group relative flex items-center justify-center gap-4 overflow-hidden rounded-3xl border-[1px] dark:border-card-border border-light-card-border bg-faint-white  p-4 transition duration-300 dark:hover:bg-white/10   md:h-[300px] md:p-6">
      <picture className="relative block h-[60px] w-[60px] origin-bottom transition duration-300 md:h-[100px] md:w-[100px] md:group-hover:-translate-y-1 md:group-hover:scale-[101%]">
        <Image
          src={imageUrl}
          width={200}
          height={200}
          alt={`Logo of ${title}`}
          unoptimized
        />
      </picture>
      <ArrowUp className="absolute right-6 top-6 hidden -translate-x-2 translate-y-2 rotate-45 text-dark-gray opacity-0 transition duration-300 hover:rotate-[405deg] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 dark:text-white md:inline-block w-6 h-6" />
      <div className="relative flex flex-1 items-center justify-between md:absolute md:inset-x-6 md:bottom-6">
        <p className="text-base font-semibold   dark:text-white md:text-xl">
          {title}
        </p>
        <span className="inline-block rounded-full border-[1px] border-light-card-border bg-white/50 px-3 py-[6px] text-xs text-dark-gray dark:border-[#272525] dark:bg-transparent md:text-sm">
          {category}
        </span>
      </div>
    </Link>
  );
};
export default TechstackCard;
