import Image from "next/image";
import Link from "next/link";
import { VscSourceControl } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa";
import { AiFillGitlab } from "react-icons/ai";

type Prop = {
  title: string;
  OneLiner: string;
  screenshot: string;
  source: string | null;
  href: string;
};

const Card = ({ OneLiner, screenshot, title, href, source }: Prop) => {
  // Function to determine the icon based on the source URL
  const getSourceIcon = (url: string) => {
    if (url.includes("github.com")) {
      return <FaGithub size={20} />;
    } else if (url.includes("gitlab.com")) {
      return <AiFillGitlab size={22} />;
    } else {
      return <VscSourceControl size={16} />;
    }
  };

  return (
    <div className="relative flex flex-col justify-between h-full rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border">
      <Link href={href}>
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 rounded-xl border overflow-hidden">
            <Image
              className="object-cover rounded-xl"
              src={screenshot}
              alt={title}
              width={400}
              height={300}
            />
          </div>
          <div className="flex-grow mt-2 group-hover/bento:translate-x-2 transition duration-200">
            <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2">
              {title}
            </div>
            <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
              {OneLiner}
            </div>
          </div>
        </div>
      </Link>
      {source && (
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-4 text-neutral-600 dark:text-neutral-200"
        >
          {getSourceIcon(source)}
        </a>
      )}
    </div>
  );
};

export default Card;
