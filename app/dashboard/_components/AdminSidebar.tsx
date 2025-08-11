"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card } from "@/components/ui/card"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getAllStats } from "@/actions/stats.action"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { User } from "lucide-react"

interface Route {
  label: string
  href: string
  icon: React.ReactNode
}

const routes: Route[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
  },
  {
    label: "Projects",
    href: "/dashboard/manage-projects",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
  },
  {
    label: "Tech Stack",
    href: "/dashboard/manage-techstack",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="m10 12 2 2 4-4" /></svg>
  },
  {
    label: "Experience",
    href: "/dashboard/manage-experience",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  },
  {
    label: "Certifications",
    href: "/dashboard/manage-certification",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" /><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" /></svg>
  },
  {
    label: "Contact Messages",
    href: "/dashboard/manage-contact",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  },
  {
    label: "Site Settings",
    href: "/dashboard/site-settings",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
  }
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-4 z-50 block md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            </div>
            <div className="flex-1">
              <SidebarContent isMobile={true} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="fixed top-0 bottom-0 left-0 z-30 hidden w-72 border-r bg-background md:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <div className="flex-1">
            <SidebarContent isMobile={false} />
          </div>
        </div>
      </div>
    </>
  )
}

function SidebarContent({
  isMobile,
  onNavigate
}: {
  isMobile?: boolean
  onNavigate?: () => void 
}) {
  const { user } = useUser();
  const pathname = usePathname()

  const { data: stats } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getAllStats(),
  })


  return (
    <Card className="rounded-lg border bg-background font-sans">
      <div className="h-full px-3 py-4">
        <h2 className="mb-3 px-3 text-lg font-semibold tracking-tight">
          Overview
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={onNavigate}>
              <Button
                variant="ghost"
                className={
                  `w-full justify-start ${pathname === route.href ? "bg-muted" : ""}`
                }
              >
                {route.icon}
                {route.label}
              </Button>
            </Link>
          ))}
          <div className="pt-6">
            <Link href="/user-profile" onClick={onNavigate}>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user?.fullName}</span>
                  <span className="text-xs text-gray-500">{user?.emailAddresses[0]?.emailAddress}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
} 