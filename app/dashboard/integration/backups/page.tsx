import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function BackupsIntegrationPage() {
  const pendingTasks = ["Design backup schema", "Export/restore endpoints", "Secure storage integration"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className=" flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Backups
        </h1>
        <p className="text-muted-foreground">Automated export and restore for your portfolio data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>Scheduled exports and on-demand restores.</CardDescription>
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


