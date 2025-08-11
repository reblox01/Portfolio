import { getAllContactsAction } from "@/actions/contact.actions"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function ManageContactSMTPPage() {
  const { contacts } = await getAllContactsAction()
  const hasExistingEntry = contacts && contacts.length > 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage SMTP</h2>
          <p className="text-muted-foreground">
            Configure email settings for contact form functionality (integration coming soon)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!hasExistingEntry ? (
            <Button asChild>
              <Link href="/dashboard/manage-contact-smtp/new">
                <Plus className="h-4 w-4 mr-2" />
                Add SMTP Config
              </Link>
            </Button>
          ) : (
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              SMTP Already Configured
            </Button>
          )}
        </div>
      </div>
      
      <DataTable columns={columns} data={contacts || []} />
    </div>
  )
}
