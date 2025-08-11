"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSelectedLayoutSegments } from "next/navigation"

export function SiteHeader() {
  const segments = useSelectedLayoutSegments()
  const title = segments.length > 0 ? segments[segments.length - 1] : "dashboard"
  const pretty = title
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pretty}</h1>
      </div>
    </header>
  )
}
