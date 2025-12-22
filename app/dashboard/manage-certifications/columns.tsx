"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { CertificateType as Certification } from "@/lib/types/certification-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteCertificationAction, toggleCertificationPublishAction } from "@/actions/certification.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { TableSelectionHeader, TableSelectionCell } from "@/components/ui/table-selection"


export const columns: ColumnDef<Certification>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <TableSelectionHeader
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <TableSelectionCell
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        index={row.index}
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Certification",
  },
  {
    accessorKey: "organizationName",
    header: "Organization",
  },
  {
    accessorFn: (row) => format(new Date(row.completionDate), "MMM dd, yyyy"),
    header: "Completion Date",
  },
  {
    accessorKey: "credentialID",
    header: "Credential ID",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.original.isPublished
      return (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className={isPublished ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 border-green-500/20" : ""}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cert = row.original
      const router = useRouter()

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this certification?")) {
          await deleteCertificationAction(cert.id);
          router.refresh();
        }
      }

      const handleTogglePublish = async () => {
        await toggleCertificationPublishAction(cert.id, cert.isPublished);
        router.refresh();
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-certifications/${cert.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTogglePublish}>
              {cert.isPublished ? (
                <>
                  <ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" />
                  Unpublish
                </>
              ) : (
                <>
                  <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
