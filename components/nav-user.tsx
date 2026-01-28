"use client"

import {
  Laptop,
  Moon,
  Sun,
  Sparkles,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  Keyboard,
  Zap,
  Briefcase,
  CheckCircle,
  FolderGit2,
  GraduationCap,
  Layers,
  User,
  Settings,
  Mail,
  Shield,
  Palette,
  Search,
  Bell,
  Puzzle,
  LayoutDashboard,
} from "lucide-react"
import { useUser, useClerk, SignOutButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { user: clerkUser } = useUser();
  const { openUserProfile } = useClerk();
  const { isMobile } = useSidebar()
  const { setTheme } = useTheme()
  const [openShortcuts, setOpenShortcuts] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenShortcuts((open) => !open)
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenShortcuts((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName || "User"} />
                <AvatarFallback className="rounded-lg">{clerkUser?.fullName?.charAt(0) || "CN"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{clerkUser?.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {clerkUser?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName || "User"} />
                  <AvatarFallback className="rounded-lg">{clerkUser?.fullName?.charAt(0) || "CN"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{clerkUser?.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {clerkUser?.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  // open Clerk's user profile modal
                  try {
                    openUserProfile?.()
                  } catch (e) {
                    // fallback to account page
                    window.location.href = "#"
                  }
                }}
              >
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sparkles />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => setOpenShortcuts(true)}>
                <Keyboard />
                Command Menu
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CommandDialog open={openShortcuts} onOpenChange={setOpenShortcuts}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-projects" }}>
              <FolderGit2 className="mr-2 h-4 w-4" />
              <span>Manage Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-admin" }}>
              <User className="mr-2 h-4 w-4" />
              <span>Manage Admin</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/settings/seo" }}>
              <Search className="mr-2 h-4 w-4" />
              <span>SEO Settings</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-techstack" }}>
              <Layers className="mr-2 h-4 w-4" />
              <span>Manage Techstack</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Management">
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-certifications" }}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Manage Certifications</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-education" }}>
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>Manage Education</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-experience" }}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Manage Experience</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/manage-contact" }}>
              <Mail className="mr-2 h-4 w-4" />
              <span>Contact Messages</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings & Integrations">
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/settings/ui" }}>
              <Palette className="mr-2 h-4 w-4" />
              <span>UI Features</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/settings/notifications" }}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notification Settings</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/integration" }}>
              <Puzzle className="mr-2 h-4 w-4" />
              <span>Integrations Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); window.location.href = "/dashboard/integration/webhooks" }}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Webhooks</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="System">
            <CommandItem onSelect={() => { setOpenShortcuts(false); setTheme("light") }}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); setTheme("dark") }}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); setTheme("system") }}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => { setOpenShortcuts(false); openUserProfile?.() }}>
              <UserCircleIcon className="mr-2 h-4 w-4" />
              <span>Account Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarMenu>
  )
}
