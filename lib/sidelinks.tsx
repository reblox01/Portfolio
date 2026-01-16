import {
  BarChart,
  Briefcase,
  CheckCircle,
  FolderGit2,
  GraduationCap,
  Layers,
  LucideIcon,
  User,
} from "lucide-react";

type sideLink = { text: string; href: string; icon: LucideIcon };

export const sidelinks: sideLink[] = [
  {
    text: "Dashboard",
    href: "/dashboard",
    icon: BarChart,
  },
  {
    text: "Admin",
    href: "/dashboard/manage-admin",
    icon: User,
  },
  {
    text: "Projects",
    href: "/dashboard/manage-projects",
    icon: FolderGit2,
  },
  {
    text: "Certifications",
    href: "/dashboard/manage-certifications",
    icon: CheckCircle,
  },
  {
    text: "Education",
    href: "/dashboard/manage-education",
    icon: GraduationCap,
  },
  {
    text: "Experience",
    href: "/dashboard/manage-experience",
    icon: Briefcase,
  },
  {
    text: "Techstack",
    href: "/dashboard/manage-techstack",
    icon: Layers,
  },
];
