"use client"

import {
  Sparkles,
  Laptop,
  Moon,
  Sun,
  BellIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useUser, useClerk, SignOutButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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
              <DropdownMenuItem
                onClick={() => {
                  // open in-place notifications dialog
                  setNotificationsOpen(true)
                }}
              >
                <BellIcon />
                Notifications
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
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <div className="inline-flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                <BellIcon />
              </div>
              <div className="text-lg font-medium">Coming soon</div>
              <div className="text-sm text-muted-foreground">Notifications will appear here in future updates.</div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
