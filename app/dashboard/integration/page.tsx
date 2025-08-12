import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Mail, Database, Webhook, Bot } from "lucide-react"

export default function IntegrationPage() {
  const upcomingIntegrations = [
    {
      title: "Contact Form Integration",
      description: "Connect your Contact SMTP settings to enable working contact forms on your portfolio (already implemented)",
      icon: Mail,
      status: "Available",
      estimatedRelease: "12/08/2025"
    },
    {
      title: "Database Backup",
      description: "Automated backup and restore functionality for your portfolio data",
      icon: Database,
      status: "Planned",
      estimatedRelease: "Future Release",
      pendingTasks: [
        "Design backup schema",
        "Export/restore endpoints",
        "Secure storage integration"
      ]
    },
    {
      title: "Webhook Notifications",
      description: "Real-time notifications when visitors interact with your portfolio",
      icon: Webhook,
      status: "Planned",
      estimatedRelease: "Future Release",
      pendingTasks: ["Webhook receiver endpoint", "Event filter rules"]
    },
    {
      title: "AI Assistant",
      description: "AI-powered content suggestions and portfolio optimization recommendations",
      icon: Bot,
      status: "Planned",
      estimatedRelease: "Future Release",
      pendingTasks: ["Model selection", "Privacy review"]
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-8 w-8" />
          Integration
        </h1>
        <p className="text-muted-foreground">
          Connect your portfolio with external services and enhance functionality
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                Integration Hub Coming Soon
              </h2>
              <p className="text-blue-700 dark:text-blue-300 max-w-md">
                We're working on powerful integrations to enhance your portfolio experience. 
                Stay tuned for exciting new features!
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              In Development
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Integrations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingIntegrations.map((integration, index) => (
            <Card key={index} className="border-muted-foreground/20 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <integration.icon className="h-5 w-5" />
                  {integration.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={integration.status === "In Development" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {integration.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {integration.estimatedRelease}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Request */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">
            Have an Integration Idea?
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            We'd love to hear about integrations that would make your portfolio even better!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 dark:text-green-300">
            Submit your feature requests and integration ideas to help us prioritize development.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
