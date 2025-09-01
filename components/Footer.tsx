"use client";
import { useMyContext } from "@/app/MyContext";
import {
  DiscordLogoIcon,
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { IconBrandFacebook, IconBrandGitlab, IconBrandWhatsapp, IconBrandYoutube, IconBrandYoutubeFilled } from "@tabler/icons-react";
import { LinkedinIcon } from "lucide-react";
import Link from "next/link";
import { socialUrl } from "@/lib/utils/social-utils";

const Footer = () => {
  const data = useMyContext();
  return (
    <footer className="w-full min-h-48 md:min-h-20 border-t shadow-sm py-6">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:gap-4 md:flex-row md:justify-between lg:px-6">
        <div className="order-2 flex items-center gap-2 text-sm md:order-1 md:gap-4 lg:text-base">
          <span className="font-semibold">
           Copyright © {new Date().getFullYear()} {data?.name || "Your Logo"}.
          </span>
          <span className="text-gray-500 dark:text-gray-400">
          All rights reserved.
          </span>
        </div>

        <div className="order-3 flex items-center gap-4 md:order-3 md:gap-6">
          {data?.gitlab && socialUrl("gitlab", data?.gitlab) && (
            <Link
              target="_blank" 
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("gitlab", data?.gitlab)!}>
              <span className="sr-only">Gitlab</span>
              <IconBrandGitlab className="w-6 h-4 fill-current" />
            </Link>
          )}
          {data?.github && socialUrl("github", data?.github) && (
            <Link
              target="_blank" 
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("github", data?.github)!}>
              <span className="sr-only">GitHub</span>
              <GitHubLogoIcon className="w-4 h-4 fill-current" />
            </Link>
          )}
          {data?.linkedIn && socialUrl("linkedIn", data?.linkedIn) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("linkedIn", data?.linkedIn)!}>
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="w-4 h-4 fill-current" />
            </Link>
          )}
          {data?.twitter && socialUrl("twitter", data?.twitter) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("twitter", data?.twitter)!}>
              <span className="sr-only">Twitter</span>
              <TwitterLogoIcon className="w-4 h-4 fill-current" />
            </Link>
          )}
          {data?.whatsapp && socialUrl("whatsapp", data?.whatsapp) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("whatsapp", data?.whatsapp)!}>
              <span className="sr-only">WhatsApp</span>
              <IconBrandWhatsapp className="w-4 h-4" />
            </Link>
          )}
          {data?.discord && socialUrl("discord", data?.discord) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("discord", data?.discord)!}>
              <span className="sr-only">Discord</span>
              <DiscordLogoIcon />
            </Link>
          )}
          {data?.instagram && socialUrl("instagram", data?.instagram) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("instagram", data?.instagram)!}>
              <span className="sr-only">Instagram</span>
              <InstagramLogoIcon />
            </Link>
          )}
          {data?.facebook && socialUrl("facebook", data?.facebook) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("facebook", data?.facebook)!}>
              <span className="sr-only">facebook</span>
              <IconBrandFacebook className="w-4 h-4 fill-current" />
            </Link>
          )}
          {data?.youtube && socialUrl("youtube", data?.youtube) && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={socialUrl("youtube", data?.youtube)!}>
              <span className="sr-only">youtube</span>
              <IconBrandYoutubeFilled className="w-4 h-4 fill-current" />
            </Link>
          )}
          {data?.email && (
            <Link
              className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href={`mailto:${data?.email}`}>
              <span className="sr-only">Mail</span>
              <EnvelopeClosedIcon />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
