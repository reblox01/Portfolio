"use client";
import * as React from "react";
import { EducationType } from "@/lib/types/education-types";
import { ColumnDef } from "@tanstack/react-table";
import { getAllEducationAction, bulkDeleteEducationAction, bulkTogglePublishEducationAction, reorderEducationAction } from "@/actions/education.actions";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { SortControl } from "@/components/dashboard/sort-control";

export default function ManageEducationPage() {
    const router = useRouter();
    const [education, setEducation] = React.useState<EducationType[]>([]);
    const [sortType, setSortType] = React.useState<string>("newest");
    const [isLoading, setIsLoading] = React.useState(true);

    const refreshData = async () => {
        setIsLoading(true);
        const res = await getAllEducationAction();
        setEducation(res.education || []);
        setSortType(res.sortType || "newest");
        setIsLoading(false);
    };

    React.useEffect(() => {
        refreshData();
    }, []);

    const handleBulkDelete = async (ids: string[]) => {
        const success = await bulkDeleteEducationAction(ids);
        if (success) {
            router.refresh();
            refreshData();
        }
    };

    const handleBulkPublish = async (ids: string[], publish: boolean) => {
        const success = await bulkTogglePublishEducationAction(ids, publish);
        if (success) {
            router.refresh();
            refreshData();
        }
    };

    const handleReorder = async (newOrder: EducationType[]) => {
        setEducation(newOrder);
        setSortType('custom');

        const items = newOrder.map((item, index) => ({
            id: item.id,
            displayOrder: index
        }));
        await reorderEducationAction(items);

        if (sortType !== 'custom') {
            await updateSortSettingsAction({ educationSortType: 'custom' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="h-8 w-48 bg-primary/10 animate-pulse rounded-md" />
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-32 bg-primary/10 animate-pulse rounded-md" />
                        <div className="h-10 w-40 bg-primary/10 animate-pulse rounded-md" />
                    </div>
                </div>
                <div className="rounded-md border">
                    <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/50">
                        <div className="h-4 w-4 bg-primary/10 animate-pulse rounded" />
                        <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
                        <div className="h-4 w-32 flex-1 bg-primary/10 animate-pulse rounded" />
                        <div className="h-4 w-20 bg-primary/10 animate-pulse rounded" />
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
                            <div className="h-4 w-4 bg-primary/10 animate-pulse rounded" />
                            <div className="flex-1 space-y-1">
                                <div className="h-4 w-44 bg-primary/10 animate-pulse rounded" />
                                <div className="h-3 w-32 bg-primary/10 animate-pulse rounded" />
                            </div>
                            <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
                            <div className="flex gap-2">
                                <div className="h-8 w-8 bg-primary/10 animate-pulse rounded" />
                                <div className="h-8 w-8 bg-primary/10 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Manage Education</h2>
                <div className="flex items-center space-x-2">
                    <SortControl
                        contentType="education"
                        currentSort={sortType}
                        onSortComplete={refreshData}
                    />
                    <Button asChild>
                        <Link href="/dashboard/manage-education/new">Add new education</Link>
                    </Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={education}
                onReorder={handleReorder}
                bulkActions={(selectedIds) => (
                    <BulkActionsToolbar
                        selectedIds={selectedIds}
                        onDelete={handleBulkDelete}
                        onPublish={handleBulkPublish}
                    />
                )}
            />
        </div>
    );
}
