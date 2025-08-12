import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MonitoringIntegrationPage() {
  const pendingTasks = ["Lighthouse scores", "Uptime checks", "Performance alerts"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health & Monitoring</h1>
        <p className="text-muted-foreground">Uptime, performance, and health metrics for your site.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring</CardTitle>
          <CardDescription>Integrate uptime and performance monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm">
            {pendingTasks.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}


