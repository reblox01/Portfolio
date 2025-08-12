import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function CiCdIntegrationPage() {
  const pendingTasks = ["Git provider sync", "Auto-deploy pipelines", "Preview builds"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">CI/CD & Git Sync</h1>
        <p className="text-muted-foreground">Automatically deploy portfolio changes from Git.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CI/CD</CardTitle>
          <CardDescription>Connect GitHub/GitLab for auto-deploys.</CardDescription>
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


