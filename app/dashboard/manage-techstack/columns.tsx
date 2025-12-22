"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Techstack } from "@/lib/types/techstack-types"
import { Button } from "@/components/ui/button"
import { deleteTechstackAction } from "@/actions/techstack.actions"
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { TableSelectionHeader, TableSelectionCell } from "@/components/ui/table-selection"


export const columns: ColumnDef<Techstack>[] = [
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
    cell: ({ row }) => {
      const tech = row.original
      const router = useRouter()

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this technology?")) {
          await deleteTechstackAction(tech.id);
          router.refresh();
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/manage-techstack/${tech.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
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
