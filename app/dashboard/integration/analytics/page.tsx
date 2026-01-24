import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

export default function AnalyticsIntegrationPage() {
  const pendingTasks = ["Privacy-first provider selection (Plausible/Umami)", "Event tracking endpoints", "Dashboard metrics UI"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className=" flex items-center gap-2">
          <Zap className="h-8 w-8" />
          Analytics
        </h1>
        <p className="text-muted-foreground">Site visitor metrics, top pages, and traffic sources.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Integration</CardTitle>
          <CardDescription>Options: Google Analytics, Plausible, Umami (privacy-first)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Badge>Planned</Badge>
            <ul className="list-disc list-inside text-sm mt-2">
              {pendingTasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


