import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bot } from "lucide-react"

export default function AIAssistantIntegrationPage() {
  const pendingTasks = ["Model selection", "Privacy review", "Prompt templates"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className=" flex items-center gap-2">
          <Bot className="h-8 w-8" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">Content suggestions and optimization using AI.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Suggest titles, descriptions, and alt text for projects.</CardDescription>
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


