import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MarketplaceIntegrationPage() {
  const pendingTasks = ["Provider connectors", "One-click OAuth flows", "UI for discoverability"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations Marketplace</h1>
        <p className="text-muted-foreground">One-click connectors for common services.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <CardDescription>Enable Slack, Notion, GitHub, Stripe, Mailchimp integrations.</CardDescription>
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


