import {
  BarChart,
  Briefcase,
  CheckCircle,
  FolderGit2,
  GanttChartSquare,
  Home,
  Layers,
  MailPlus,
  User,
} from "lucide-react";
type sideLink = { text: string; href: string; icon: React.ReactNode };

export const sidelinks: sideLink[] = [
  {
    text: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    text: "Stats",
    href: "/admin-dashboard",
    icon: <BarChart />,
  },
  {
    text: "Admin",
    href: "/admin-dashboard/manage-admin",
    icon: <User />,
  },
  {
    text: "Projects",
    href: "/admin-dashboard/manage-projects",
    icon: <FolderGit2 />,
  },
  {
    text: "Certification",
    href: "/admin-dashboard/manage-certification",
    icon: <CheckCircle />,
  },
  {
    text: "Experience",
    href: "/admin-dashboard/manage-experience",
    icon: <Briefcase />,
  },
  {
    text: "Techstack",
    href: "/admin-dashboard/manage-techstack",
    icon: <Layers />,
  },
  {
    text: "Contact",
    href: "/admin-dashboard/manage-contact",
    icon: <MailPlus />,
  },
];
