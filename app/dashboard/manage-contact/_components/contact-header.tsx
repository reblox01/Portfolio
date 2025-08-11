import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export function ContactHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
        <p className="text-muted-foreground">
          Manage contact information and SMTP configuration
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/manage-contact/new">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact Info
        </Link>
      </Button>
    </div>
  )
}
