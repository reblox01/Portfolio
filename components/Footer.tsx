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
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6 max-w-screen-2xl">
        {/* Main Footer Content */}
        <div className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Navigation Column */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                  Navigation
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">About</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Contact</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Portfolio Column */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                  Portfolio
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/projects" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Projects</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/experience" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Experience</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/certification" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Certifications</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Skills Column */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                  Skills
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/techstack" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Tech Stack</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect Column */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
                  Connect
                </h3>
                <ul className="space-y-3">
                  {data?.github && (
                    <li>
                      <a 
                        href={socialUrl("github", data?.github)!} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">GitHub</span>
                      </a>
                    </li>
                  )}
                  {data?.linkedIn && (
                    <li>
                      <a 
                        href={socialUrl("linkedIn", data?.linkedIn)!} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">LinkedIn</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">© {new Date().getFullYear()} {data?.name || "Your Name"}</span>
                {" "}•{" "}
                <span>All rights reserved</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground mr-2 hidden md:inline">Follow me</span>
                {data?.gitlab && socialUrl("gitlab", data?.gitlab) && (
                  <Link
                    target="_blank" 
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("gitlab", data?.gitlab)!}
                  >
                    <IconBrandGitlab className="w-4 h-4" />
                    <span className="sr-only">GitLab</span>
                  </Link>
                )}
                {data?.github && socialUrl("github", data?.github) && (
                  <Link
                    target="_blank" 
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("github", data?.github)!}
                  >
                    <GitHubLogoIcon className="w-4 h-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                )}
                {data?.linkedIn && socialUrl("linkedIn", data?.linkedIn) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("linkedIn", data?.linkedIn)!}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {data?.twitter && socialUrl("twitter", data?.twitter) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("twitter", data?.twitter)!}
                  >
                    <TwitterLogoIcon className="w-4 h-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {data?.whatsapp && socialUrl("whatsapp", data?.whatsapp) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("whatsapp", data?.whatsapp)!}
                  >
                    <IconBrandWhatsapp className="w-4 h-4" />
                    <span className="sr-only">WhatsApp</span>
                  </Link>
                )}
                {data?.discord && socialUrl("discord", data?.discord) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("discord", data?.discord)!}
                  >
                    <DiscordLogoIcon className="w-4 h-4" />
                    <span className="sr-only">Discord</span>
                  </Link>
                )}
                {data?.instagram && socialUrl("instagram", data?.instagram) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("instagram", data?.instagram)!}
                  >
                    <InstagramLogoIcon className="w-4 h-4" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                )}
                {data?.facebook && socialUrl("facebook", data?.facebook) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("facebook", data?.facebook)!}
                  >
                    <IconBrandFacebook className="w-4 h-4" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                )}
                {data?.youtube && socialUrl("youtube", data?.youtube) && (
                  <Link
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={socialUrl("youtube", data?.youtube)!}
                  >
                    <IconBrandYoutubeFilled className="w-4 h-4" />
                    <span className="sr-only">YouTube</span>
                  </Link>
                )}
                {data?.email && (
                  <Link
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    href={`mailto:${data?.email}`}
                  >
                    <EnvelopeClosedIcon className="w-4 h-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
      </div>
    </footer>
  );
};
export default Footer;
