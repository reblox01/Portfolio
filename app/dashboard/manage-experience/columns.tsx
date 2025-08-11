"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExperienceType } from "@/lib/types/experience-types"
import { Button } from "@/components/ui/button"
import { deleteExperienceAction as deleteExperience } from "@/actions/experience.actions"
import Link from "next/link"
import { format } from "date-fns"

export const columns: ColumnDef<ExperienceType>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      const experience = row.original

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
          await deleteExperience(experience.id);
          window.location.reload();
        }
      }
 
      return (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/manage-experience/${experience.id}/edit`}>
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      )
    },
  },
]
