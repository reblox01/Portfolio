import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import DynamicSectionCards from "@/components/dynamic-section-cards"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import Link from "next/link"
import ProjectCard from "@/components/Card"
import ProjectList from "@/components/ProjectList"
import Image from "next/image"
import { getAllTechstacksAction } from "@/actions/techstack.actions"
import { getAllStats } from "@/actions/stats.action"
import { getRandomProjectsAction } from "@/actions/project.actions"
import { getVisitorsForRange } from "@/actions/visitors.action"
import { getHourlyVisitorsLast24Hours } from "@/actions/hourly-visitors.action"

export default async function Page() {
  const { stats } = await getAllStats()
  const projects = await getRandomProjectsAction()
  const visitors = await getVisitorsForRange(90)
  const hourlyVisitors = await getHourlyVisitorsLast24Hours()
  const { techstacks } = await getAllTechstacksAction()
  
  // Log visitor data for debugging
  console.log('Visitors data count:', visitors?.length)
  console.log('Hourly visitors count:', hourlyVisitors?.length)
  if (visitors && visitors.length > 0) {
    console.log('First visitor date:', visitors[0].date)
    console.log('Last visitor date:', visitors[visitors.length - 1].date)
  }

  return (
    <div className="space-y-6">
      <DynamicSectionCards stats={stats} />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive initialData={visitors} hourlyData={hourlyVisitors} />
      </div>

      <section className="px-4 lg:px-6">
        <h3 className="text-lg font-medium mb-3">Recent Projects</h3>
        <ProjectList projects={projects.map((p) => ({ title: p.title, link: p.link, thumbnail: p.thumbnail, source: p.source, oneLiner: (p as any).oneLiner }))} />
      </section>

      <section className="px-4 lg:px-6 pb-8">
        <h3 className="text-lg font-medium mb-3">Suggested Techstacks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {techstacks
            .slice()
            .sort((a, b) => b.id.localeCompare(a.id))
            .slice(0, 9)
            .map((t) => (
              <Link key={t.id} href={`/dashboard/manage-techstack/${t.id}`} className="rounded-lg border p-4 flex items-center gap-4 hover:shadow">
                <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                  <Image src={t.imageUrl || "/placeholder.png"} alt={t.title} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{t.category}</div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
