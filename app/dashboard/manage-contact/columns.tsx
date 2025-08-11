"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ContactType } from "@/lib/types/contact-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Edit, Trash2, MoreHorizontal } from "lucide-react"
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
    accessorKey: "email",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email
      </div>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4" />
        Phone
      </div>
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Address
      </div>
    ),
    cell: ({ row }) => {
      const address = row.getValue("address") as string
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-xs truncate">{address}</span>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const contact = row.original

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this contact information?")) {
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
              <Link href={`/dashboard/manage-contact/${contact.id}`}>
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
