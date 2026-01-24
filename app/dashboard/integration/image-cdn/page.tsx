import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function ImageCDNPage() {
  const pendingTasks = ["Cloudinary integration", "Auto-optimization pipeline", "Fallbacks & caching"]

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className=" flex items-center gap-2">
          <Database className="h-8 w-8" />
          Image CDN
        </h1>
        <p className="text-muted-foreground">Automatic image optimization and CDN delivery.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image CDN & Optimization</CardTitle>
          <CardDescription>Integration with Cloudinary or similar providers.</CardDescription>
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


