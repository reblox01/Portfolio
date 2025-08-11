"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Project } from "@/lib/types/project-types"
import { Button } from "@/components/ui/button"
import { deleteProjectAction } from "@/actions/project.actions"
import Link from "next/link"

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Project Name",
  },
  {
    accessorKey: "oneLiner",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
          await deleteProjectAction(project.id);
          window.location.reload();
        }
      }
 
      return (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/manage-projects/${project.id}`}>
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
