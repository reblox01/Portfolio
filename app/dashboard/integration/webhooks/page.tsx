import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function WebhooksIntegrationPage() {
  const pendingTasks = ["Webhook receiver endpoint", "Event filter rules", "Retry/backoff strategy"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-8 w-8" />
          Webhooks
        </h1>
        <p className="text-muted-foreground">Real-time event forwarding to external services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Notifications</CardTitle>
          <CardDescription>Send events (e.g., form submissions) to third-party endpoints.</CardDescription>
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


