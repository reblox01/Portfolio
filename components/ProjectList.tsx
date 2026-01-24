"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Project = {
  title: string
  link: string
  thumbnail?: string
  source?: string
  oneLiner?: string
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [sort, setSort] = React.useState("recent")

  const sorted = React.useMemo(() => {
    const copy = [...projects]
    if (sort === "title-asc") return copy.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === "title-desc") return copy.sort((a, b) => b.title.localeCompare(a.title))
    return copy
  }, [projects, sort])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Sort</label>
          <Select onValueChange={(v) => setSort(v)} value={sort}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="title-asc">Title A → Z</SelectItem>
              <SelectItem value="title-desc">Title Z → A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Link href="/dashboard/manage-projects">
            <Button variant="outline" size="sm">View all projects</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.slice(0, 6).map((p) => (
          <div key={p.title} className="flex flex-col sm:flex-row gap-4 items-start rounded-lg border p-3">
            <div className="w-full sm:w-56 h-40 sm:h-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <Link href={p.link} target="_blank" className="block w-full h-full">
                <Image src={p.thumbnail || "/placeholder.png"} alt={p.title} width={560} height={280} className="object-cover w-full h-full" unoptimized />
              </Link>
            </div>

            <div className="flex-1 min-w-0">
              <div>
                <h4 className="font-semibold text-lg truncate">{p.title}</h4>
                {p.oneLiner && <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.oneLiner}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


