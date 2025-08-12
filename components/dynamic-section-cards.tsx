import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DynamicSectionCards({
  stats,
}: {
  stats: { title: string; count: number }[]
}) {
  const items = stats.slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {items.map((s, idx) => {
        const up = idx % 2 === 0

        return (
          <Card key={s.title} className="p-4">
            <CardHeader className="relative">
              <CardDescription className="capitalize text-sm">{s.title}</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">{s.count}</CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex items-center gap-2 rounded-lg text-xs">
                  {up ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />} 
                  <span>{up ? "+12.5%" : "-20%"}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
              <div className="font-medium">{up ? "Trending up this month" : "Down this period"}</div>
              <div className="text-muted-foreground">Auto-generated from your portfolio database</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}


