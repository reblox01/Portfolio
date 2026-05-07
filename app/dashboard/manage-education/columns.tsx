"use client"

import * as React from "react"
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
import { MoreHorizontal, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Loader2, GripVertical } from "lucide-react"
import { TableSelectionHeader, TableSelectionCell } from "@/components/ui/table-selection"
import { useDraggableRow } from "@/components/data-table"
import { format } from "date-fns"

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

export const columns: ColumnDef<EducationType>[] = [
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
        cell: ({ row, table }) => {
            const education = row.original
            const [isPending, startTransition] = React.useTransition()
            const { refreshData } = (table.options.meta as any) || {}

            const handleDelete = async (e: React.MouseEvent) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this education entry?")) {
                    startTransition(async () => {
                        try {
                            const res = await deleteEducationAction(education.id);
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
                        const res = await toggleEducationPublishAction(education.id, education.isPublished);
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
                            <Link href={`/dashboard/manage-education/${education.id}`} className="flex items-center">
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
                            ) : education.isPublished ? (
                                <ArrowDownCircle className="mr-2 h-4 w-4 text-orange-500" />
                            ) : (
                                <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {education.isPublished ? "Unpublish" : "Publish"}
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
