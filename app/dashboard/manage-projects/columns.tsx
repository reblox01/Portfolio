"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Project } from "@/lib/types/project-types"
import { Button } from "@/components/ui/button"
import { deleteProjectAction } from "@/actions/project.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toggleProjectPublishAction } from "@/actions/project.actions"
import { Badge } from "@/components/ui/badge"
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

export const columns: ColumnDef<Project>[] = [
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
    header: "Project Name",
  },
  {
    accessorKey: "oneLiner",
    header: "Description",
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const project = row.original
      return (
        <Badge
          variant={project.isPublished ? "default" : "secondary"}
          className={project.isPublished ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 border-green-500/20" : ""}
        >
          {project.isPublished ? "Published" : "Draft"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const project = row.original
      const [isPending, startTransition] = React.useTransition()
      const { refreshData } = (table.options.meta as any) || {}

      const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this project?")) {
          startTransition(async () => {
            try {
              const res = await deleteProjectAction(project.id);
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
            const res = await toggleProjectPublishAction(project.id, project.isPublished);
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
              <Link href={`/dashboard/manage-projects/${project.id}`} className="flex items-center">
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
              ) : project.isPublished ? (
                <ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              {project.isPublished ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            {project.liveURL && (
              <DropdownMenuItem asChild>
                <a href={project.liveURL} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </DropdownMenuItem>
            )}
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
