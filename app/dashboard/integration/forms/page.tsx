import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FormsIntegrationPage() {
  const pendingTasks = ["Form builder UI", "Spam protection (reCAPTCHA)", "Email templates"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 text-2xl font-bold tracking-tight>Forms & Spam Protection</h1>
        <p className="text-muted-foreground">Custom contact forms with spam protection and templates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Build and protect contact forms for your portfolio.</CardDescription>
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


