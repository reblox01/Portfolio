import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* Fixed header */}
        <SiteHeader />
        {/* Scrollable content area - fills remaining height */}
        <div className="flex-1 overflow-auto p-4 md:p-6 dashboard-scrollbar">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
