"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  Home,
  ListIcon,
  Mail,
  MailCheck,
  CalendarIcon,
  BellIcon,
  KeyIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Zap,
  Bot,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidelinks } from "@/lib/sidelinks";
import { useUser } from "@clerk/nextjs";
import { LucideIcon } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/site-settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ],
  documents: [
    {
      name: "Contact",
      url: "/dashboard/manage-contact",
      icon: Mail,
    },
    {
      name: "Manage SMTP",
      url: "/dashboard/manage-contact-smtp",
      icon: MailCheck,
    },
    {
      name: "Integration",
      url: "#",
      icon: Zap,
      children: [
        { name: "Overview", url: "/dashboard/integration", icon: LayoutDashboardIcon },
        { name: "Analytics", url: "/dashboard/integration/analytics", icon: BarChartIcon },
        { name: "Backups", url: "/dashboard/integration/backups", icon: DatabaseIcon },
        { name: "Webhooks", url: "/dashboard/integration/webhooks", icon: Zap },
        { name: "AI Assistant", url: "/dashboard/integration/ai-assistant", icon: Bot },
        { name: "Image CDN", url: "/dashboard/integration/image-cdn", icon: CameraIcon },
        { name: "Forms", url: "/dashboard/integration/forms", icon: FileIcon },
        { name: "Scheduling", url: "/dashboard/integration/scheduling", icon: CalendarIcon },
        { name: "Marketplace", url: "/dashboard/integration/marketplace", icon: FolderIcon },
        { name: "Notifications", url: "/dashboard/integration/notifications", icon: BellIcon },
        { name: "CI/CD", url: "/dashboard/integration/ci-cd", icon: FileCodeIcon },
        { name: "Monitoring", url: "/dashboard/integration/monitoring", icon: BarChartIcon },
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user: clerkUser } = useUser();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Dashboard | {clerkUser?.fullName || "Admin"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidelinks.map((link) => ({
            title: link.text,
            url: link.href,
            icon: link.icon
        }))} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
            name: clerkUser?.fullName || "User",
            email: clerkUser?.emailAddresses[0]?.emailAddress || "",
            avatar: clerkUser?.imageUrl || "",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
