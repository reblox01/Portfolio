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

    const refreshData = async () => {
        const res = await getAllEducationAction();
        setEducation(res.education || []);
        setSortType(res.sortType || "newest");
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

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Manage Education</h2>
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
