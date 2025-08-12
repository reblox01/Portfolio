"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ContactType } from "@/lib/types/contact-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Key, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { deleteContactAction } from "@/actions/contact.actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<ContactType>[] = [
  {
    accessorKey: "smtpEmail",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        SMTP Email
      </div>
    ),
    cell: ({ row }) => {
      const smtpEmail = row.getValue("smtpEmail") as string | undefined
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{smtpEmail ? smtpEmail : "Not Set"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "emailPassword",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        App Password
      </div>
    ),
    cell: ({ row }) => {
      const emailPassword = row.getValue("emailPassword") as string
      return (
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <Badge variant={emailPassword ? "default" : "secondary"} className="text-xs">
            {emailPassword ? "Configured" : "Not Set"}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "status",
    header: "Configuration Status",
    cell: ({ row }) => {
      const emailPassword = row.getValue("emailPassword") as string
      const smtpEmail = row.getValue("smtpEmail") as string

      const isFullyConfigured = emailPassword && smtpEmail
      
      return (
        <Badge 
          variant={isFullyConfigured ? "default" : "secondary"} 
          className={`text-xs ${isFullyConfigured ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}`}
        >
          {isFullyConfigured ? "Ready" : "Incomplete"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const contact = row.original

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this SMTP configuration?")) {
          await deleteContactAction(contact.id)
          window.location.reload()
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-contact-smtp/${contact.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
