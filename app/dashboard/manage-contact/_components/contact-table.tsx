"use client"

import { ContactType } from "@/lib/types/contact-types"
import { Button } from "@/components/ui/button"
import { deleteContactAction } from "@/actions/contact.actions"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react"

interface ContactTableProps {
  data: ContactType[]
}

export function ContactTable({ data }: ContactTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact information?")) {
      await deleteContactAction(id);
      window.location.reload();
    }
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No contact information yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add your contact details to display on your portfolio
          </p>
          <Button asChild>
            <Link href="/dashboard/manage-contact/new">
              Add Contact
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((contact) => (
        <Card key={contact.id} className="border-muted-foreground/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5" />
              Contact
            </CardTitle>
            <CardDescription className="text-sm">
              Contact information displayed on portfolio
              <div className="mt-2 text-xs text-muted-foreground">
                <strong className="font-medium">Note:</strong> The email shown here is public and will appear on your portfolio. To configure the email account used to send messages (SMTP app password), use <em>Manage SMTP</em>.
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{contact.address}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/manage-contact/${contact.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(contact.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
