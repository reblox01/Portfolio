"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Techstack } from "@/lib/types/techstack-types"
import { Button } from "@/components/ui/button"
import { deleteTechstackAction, toggleTechstackPublishAction } from "@/actions/techstack.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
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

export const columns: ColumnDef<Techstack>[] = [
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
    header: "Technology",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "image",
    header: "Icon",
    cell: ({ row }) => {
      const tech = row.original
      return (
        <div className="h-10 w-10 relative">
          <Image
            src={tech.imageUrl}
            alt={tech.title}
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>
      )
    }
  },
  {
    accessorKey: "techstackType",
    header: "Type",
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const tech = row.original
      const [isPending, startTransition] = React.useTransition()
      const { refreshData } = (table.options.meta as any) || {}

      const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm("Are you sure you want to delete this tech stack entry?")) {
          startTransition(async () => {
            try {
              const res = await deleteTechstackAction(tech.id);
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
            const res = await toggleTechstackPublishAction(tech.id, tech.isPublished);
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
              <Link href={`/dashboard/manage-techstack/${tech.id}`}>
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
              ) : tech.isPublished ? (
                <ArrowDownCircle className="mr-2 h-4 w-4" />
              ) : (
                <ArrowUpCircle className="mr-2 h-4 w-4" />
              )}
              {tech.isPublished ? "Unpublish" : "Publish"}
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

