import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SocialAutoPublishPage() {
  const pendingTasks = ["OAuth flows for Twitter/LinkedIn", "Post templates", "Rate limit handling"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Social Auto-Publish</h1>
        <p className="text-muted-foreground">Auto-post new projects or updates to social platforms.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Auto-Publish</CardTitle>
          <CardDescription>Post updates automatically to your social profiles.</CardDescription>
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


