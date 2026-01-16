"use client"

import { ColumnDef } from "@tanstack/react-table"
import { EducationType } from "@/lib/types/education-types"
import { Button } from "@/components/ui/button"
import { deleteEducationAction, toggleEducationPublishAction } from "@/actions/education.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
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
import { format } from "date-fns"

export const columns: ColumnDef<EducationType>[] = [
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
        accessorKey: "degree",
        header: "Degree",
    },
    {
        accessorKey: "institution",
        header: "Institution",
    },
    {
        accessorKey: "startDate",
        header: "Period",
        cell: ({ row }) => {
            const edu = row.original
            const start = format(new Date(edu.startDate), "MMM yyyy")
            const end = edu.isCurrently
                ? "Present"
                : edu.endDate
                    ? format(new Date(edu.endDate), "MMM yyyy")
                    : "N/A"

            return (
                <span className="text-sm text-muted-foreground">
                    {start} - {end}
                </span>
            )
        }
    },
    {
        accessorKey: "isPublished",
        header: "Status",
        cell: ({ row }) => {
            const edu = row.original
            return (
                <Badge
                    variant={edu.isPublished ? "default" : "secondary"}
                    className={edu.isPublished ? "bg-green-500/10 text-green-500 hover:bg-green-500/10 border-green-500/20" : ""}
                >
                    {edu.isPublished ? "Published" : "Draft"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const edu = row.original
            const router = useRouter()

            const handleDelete = async () => {
                if (window.confirm("Are you sure you want to delete this education entry?")) {
                    await deleteEducationAction(edu.id);
                    router.refresh();
                }
            }

            const handleToggle = async () => {
                await toggleEducationPublishAction(edu.id, edu.isPublished)
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
                            <Link href={`/dashboard/manage-education/${edu.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggle}>
                            {edu.isPublished ? (
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
