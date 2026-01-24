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
  Palette,
  User,
  Shield,
  Puzzle,
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
      name: "Settings",
      url: "#",
      icon: SettingsIcon,
      children: [
        { name: "SEO", url: "/dashboard/settings/seo", icon: SearchIcon },
        { name: "UI Features", url: "/dashboard/settings/ui", icon: Palette },
        { name: "Account", url: "/dashboard/settings/account", icon: User },
        { name: "Notifications", url: "#", icon: BellIcon, disabled: true },
        { name: "Security", url: "#", icon: Shield, disabled: true },
        { name: "API Keys", url: "#", icon: KeyIcon, disabled: true },
      ],
    },
    {
      name: "Integration",
      url: "#",
      icon: Puzzle,
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
  const { user: clerkUser, isLoaded } = useUser();

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
                <span className="text-base font-semibold">
                  {isLoaded ? (
                    `Dashboard | ${clerkUser?.fullName || "Admin"}`
                  ) : (
                    <span className="inline-block h-4 w-32 bg-sidebar-accent animate-pulse rounded" />
                  )}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!isLoaded ? (
          // Loading skeleton
          <>
            <div className="px-2 py-2">
              <div className="space-y-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                    <div className="h-4 w-4 bg-sidebar-accent animate-pulse rounded" />
                    <div className="h-4 w-24 bg-sidebar-accent animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-2 py-2 mt-4">
              <div className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                    <div className="h-4 w-4 bg-sidebar-accent animate-pulse rounded" />
                    <div className="h-4 w-20 bg-sidebar-accent animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Actual content
          <>
            <NavMain items={sidelinks.map((link) => ({
              title: link.text,
              url: link.href,
              icon: link.icon
            }))} />
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        {!isLoaded ? (
          // Footer skeleton
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 bg-sidebar-accent animate-pulse rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 bg-sidebar-accent animate-pulse rounded" />
              <div className="h-2 w-32 bg-sidebar-accent animate-pulse rounded" />
            </div>
          </div>
        ) : (
          <NavUser user={{
            name: clerkUser?.fullName || "User",
            email: clerkUser?.emailAddresses[0]?.emailAddress || "",
            avatar: clerkUser?.imageUrl || "",
          }} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
