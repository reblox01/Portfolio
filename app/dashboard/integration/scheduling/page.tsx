import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SchedulingIntegrationPage() {
  const pendingTasks = ["Google Calendar OAuth", "Booking UI", "Timezone handling"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Scheduling / Bookings</h1>
        <p className="text-muted-foreground">Calendar booking integration for client calls.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
          <CardDescription>Connect calendars and accept bookings.</CardDescription>
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


