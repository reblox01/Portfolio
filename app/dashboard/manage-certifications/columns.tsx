"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CertificateType as Certification } from "@/lib/types/certification-types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteCertificationAction, toggleCertificationPublishAction } from "@/actions/certification.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export const columns: ColumnDef<Certification>[] = [
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
        <Badge variant={isPublished ? "default" : "secondary"}>
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
        <div className="flex items-center gap-4">
          <Button
            variant={cert.isPublished ? "outline" : "default"}
            size="sm"
            onClick={handleTogglePublish}
          >
            {cert.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
              View
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/manage-certifications/${cert.id}`}>
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
