"use client"

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useCollapsible,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
    children?: { name: string; url: string; icon: LucideIcon }[]
  }[]
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    // hide the inline help when navigating to another page
    setShowMore(false)
  }, [pathname])
  
  const isActive = (path: string) => {
    // Parent is active only on exact match
    return pathname === path || pathname === path + "/"
  }

  const isAnyChildActive = (children?: { name: string; url: string }[]) => {
    if (!children || children.length === 0) return false

    return children.some((c) => {
      // If this child URL is a prefix of any other child URL, only match exact path
      const isPrefixOfSibling = children.some((s) => s.url !== c.url && s.url.startsWith(c.url + "/"))
      if (isPrefixOfSibling) {
        return pathname === c.url || pathname === c.url + "/"
      }
      return pathname === c.url || pathname.startsWith(c.url + "/")
    })
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
      {items.map((item) => {
        // If this item has children, render as a collapsible with sub-items
        if (item.children && item.children.length > 0) {
          return (
            <Collapsible
              key={item.name}
              defaultOpen={isActive(item.url) || isAnyChildActive(item.children)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <div className="relative w-full">
                  {/* Whole row toggles the submenu */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isActive(item.url) ? "bg-muted w-full flex items-center gap-2 pr-8" : "w-full flex items-center gap-2 pr-8"}>
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* Chevron reflects open state (visual only) */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronToggle />
                  </div>
                </div>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {(() => {
                      const children = item.children ?? []
                      return children.map((child) => {
                        const isPrefixOfSibling = children.some(
                          (s) => s.url !== child.url && s.url.startsWith(child.url + "/")
                        )

                        const childIsActive = isPrefixOfSibling
                          ? pathname === child.url || pathname === child.url + "/"
                          : pathname === child.url || pathname.startsWith(child.url + "/")

                        return (
                          <SidebarMenuSubItem key={child.url}>
                            <SidebarMenuSubButton asChild isActive={childIsActive}>
                                <Link href={child.url} className="flex items-center gap-2" onClick={() => { if (isMobile) setOpenMobile(false) }}>
                                <child.icon />
                                <span>{child.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })
                    })()}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }

        // default single item
        return (
          <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className={isActive(item.url) ? "bg-muted" : ""}>
                <Link href={item.url} onClick={() => { if (isMobile) setOpenMobile(false) }}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="rounded-sm data-[state=open]:bg-accent"
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-36 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                  <DropdownMenuItem
                    onClick={() => {
                      if (isMobile) setOpenMobile(false)
                      window.location.href = item.url
                    }}
                  >
                  <FolderIcon />
                  <span>Open</span>
                </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      if (isMobile) setOpenMobile(false)
                      const full = window.location.origin + item.url
                      if ((navigator as any).share) {
                        try {
                          await (navigator as any).share({ title: item.name, url: full })
                          toast.success("Shared")
                          return
                        } catch (err) {
                        }
                      }

                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        try {
                          await navigator.clipboard.writeText(full)
                          toast.success("Link copied to clipboard")
                          return
                        } catch (e) {
                        }
                      }

                      try {
                        const ta = document.createElement("textarea")
                        ta.value = full
                        ta.setAttribute("readonly", "")
                        ta.style.position = "absolute"
                        ta.style.left = "-9999px"
                        document.body.appendChild(ta)
                        ta.select()
                        document.execCommand("copy")
                        document.body.removeChild(ta)
                        toast.success("Link copied to clipboard")
                      } catch (err) {
                        console.error("Share/copy failed", err)
                        toast.error("Could not copy or share the link")
                      }
                    }}
                  >
                  <ShareIcon />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        )
      })}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-sidebar-foreground/70"
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
          >
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
          {showMore && (
            <div className="pl-10 pt-1 text-xs text-sidebar-foreground/70">Coming soon</div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function ChevronToggle() {
  const { open } = useCollapsible()
  return (
    <button aria-hidden className="p-2">
      <ChevronRight className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
    </button>
  )
}
