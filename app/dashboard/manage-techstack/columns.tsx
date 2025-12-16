"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Techstack } from "@/lib/types/techstack-types"
import { Button } from "@/components/ui/button"
import { deleteTechstackAction } from "@/actions/techstack.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export const columns: ColumnDef<Techstack>[] = [
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/manage-techstack/${tech.id}`}>
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
