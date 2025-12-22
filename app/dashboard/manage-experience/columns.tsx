"use client"

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
import { MoreHorizontal, Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { TableSelectionHeader, TableSelectionCell } from "@/components/ui/table-selection"


export const columns: ColumnDef<ExperienceType>[] = [
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
    cell: ({ row }) => {
      const experience = row.original
      const router = useRouter()

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
          await deleteExperience(experience.id);
          router.refresh()
        }
      }

      const handleToggle = async () => {
        await toggleExperiencePublishAction(experience.id, experience.isPublished)
        router.refresh()
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
            <DropdownMenuItem onClick={handleToggle}>
              {experience.isPublished ? (
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
