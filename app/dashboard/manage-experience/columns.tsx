"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ExperienceType } from "@/lib/types/experience-types"
import { Button } from "@/components/ui/button"
import { deleteExperienceAction as deleteExperience } from "@/actions/experience.actions"
import Link from "next/link"
import { format } from "date-fns"
import { toggleExperiencePublishAction } from "@/actions/experience.actions"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Loader2, GripVertical } from "lucide-react"
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

export const columns: ColumnDef<ExperienceType>[] = [
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
    accessorKey: "positionName",
    header: "Position",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "companyLocation",
    header: "Location",
  },
  {
    accessorKey: "workMode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = (row.original as any).workMode as string | undefined
      return <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{mode ? (mode === 'onsite' ? 'On‑site' : mode.charAt(0).toUpperCase() + mode.slice(1)) : '-'}</span>
    }
  },
  {
    accessorFn: (row) =>
      format(new Date(row.startDate), "MMM yyyy") +
      (row.isCurrentlyWorking
        ? " - Present"
        : row.endDate
          ? ` - ${format(new Date(row.endDate), "MMM yyyy")}`
          : ""),
    header: "Duration",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const experience = row.original
      return (
        <Badge
          variant={experience.isPublished ? "default" : "secondary"}
          className={experience.isPublished ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 border-green-500/20" : ""}
        >
          {experience.isPublished ? "Published" : "Draft"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const experience = row.original
      const [isPending, startTransition] = React.useTransition()
      const { refreshData } = (table.options.meta as any) || {}

      const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm("Are you sure you want to delete this experience?")) {
          startTransition(async () => {
            try {
              const res = await deleteExperience(experience.id);
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
        e.preventDefault();
        e.stopPropagation();
        
        startTransition(async () => {
          try {
            const res = await toggleExperiencePublishAction(experience.id, experience.isPublished);
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-experience/${experience.id}/edit`}>
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
              ) : experience.isPublished ? (
                <ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              {experience.isPublished ? "Unpublish" : "Publish"}
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

