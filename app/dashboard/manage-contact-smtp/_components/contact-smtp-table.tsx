"use client"

import { ContactType } from "@/lib/types/contact-types"
import { Button } from "@/components/ui/button"
import { deleteContactAction } from "@/actions/contact.actions"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Key, Edit, Trash2, MailCheck } from "lucide-react"
import { toast } from "sonner"

interface ContactSMTPTableProps {
  data: ContactType[]
}

export function ContactSMTPTable({ data }: ContactSMTPTableProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this SMTP configuration?")) {
      await deleteContactAction(id);
      window.location.reload();
    }
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MailCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No SMTP configuration yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add your email SMTP settings for contact form functionality
          </p>
          <Button asChild>
            <Link href="/dashboard/manage-contact-smtp/new">
              Add Contact SMTP
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
              <MailCheck className="h-5 w-5" />
              Contact SMTP
            </CardTitle>
            <CardDescription className="text-sm">
              Email configuration for contact forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">SMTP Email</p>
                  <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Key className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">App Password</p>
                  <Badge variant={contact.emailPassword ? "default" : "secondary"} className="text-xs">
                    {contact.emailPassword ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MailCheck className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={contact.emailPassword ? "default" : "destructive"} className="text-xs">
                    {contact.emailPassword ? "Ready" : "Incomplete"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/manage-contact-smtp/${contact.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/email/test', { method: 'POST' })
                      const data = await res.json()
                      if (res.ok) {
                        toast.success('Test email sent — check inbox')
                      } else {
                        toast.error(data?.error || 'Test send failed')
                      }
                    } catch (err) {
                      console.error(err)
                      toast.error('Test send failed')
                    }
                  }}
                >
                  Test
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
