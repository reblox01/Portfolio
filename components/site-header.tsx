"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSelectedLayoutSegments, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getSingleProjectAction } from "@/actions/project.actions"

export function SiteHeader() {
  const segments = useSelectedLayoutSegments()
  const pathname = usePathname()
  const title = segments.length > 0 ? segments[segments.length - 1] : "dashboard"
  
  // Check if we're on a project edit page
  const isProjectEdit = pathname?.includes('/manage-projects/') && segments[segments.length - 2] === 'manage-projects'
  const projectId = isProjectEdit ? title : null
  
  // Fetch project data if we're editing a project
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getSingleProjectAction(projectId!),
    enabled: !!projectId && projectId.length > 20, // Only fetch if it looks like a MongoDB ID
  })
  
  // Determine what to display
  let displayTitle = title
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  
  let tooltipText: string | undefined = undefined
  
  if (project?.title) {
    displayTitle = project.title
    tooltipText = `Project ID: ${projectId}`
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 
          className={`text-base font-medium ${tooltipText ? 'cursor-help hover:opacity-80 transition-opacity' : ''}`}
          title={tooltipText}
        >
          {displayTitle}
        </h1>
      </div>
    </header>
  )
}
