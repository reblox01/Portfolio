"use client"

import * as React from "react"
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
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpCircle, ArrowDownCircle, Loader2, GripVertical } from "lucide-react"
import { TableSelectionHeader, TableSelectionCell } from "@/components/ui/table-selection"
import { useDraggableRow } from "@/components/data-table"

const DragHandle = () => {
  const draggable = useDraggableRow();
  if (!draggable) return null;

  return (
    <div
      {...draggable.attributes}
      {...draggable.listeners}
      className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

export const columns: ColumnDef<Certification>[] = [
  {
    id: "drag",
    header: () => null,
    cell: () => <DragHandle />,
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ row, table }) => {
      const cert = row.original
      const [isPending, startTransition] = React.useTransition()
      const { refreshData } = (table.options.meta as any) || {}

      const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this certification?")) {
          startTransition(async () => {
            try {
              const res = await deleteCertificationAction(cert.id);
              if (res) {
                if (refreshData) await refreshData();
                else window.location.reload();
              }
            } catch (error) {
              console.error("Delete error:", error)
            }
          })
        }
      }

      const handleTogglePublish = async (e: React.MouseEvent) => {
        e.stopPropagation();
        startTransition(async () => {
          try {
            const res = await toggleCertificationPublishAction(cert.id, cert.isPublished);
            if (res) {
              if (refreshData) await refreshData();
              else window.location.reload();
            }
          } catch (error) {
            console.error("Toggle error:", error)
          }
        })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-certifications/${cert.id}`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleTogglePublish}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : cert.isPublished ? (
                <ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              {cert.isPublished ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
