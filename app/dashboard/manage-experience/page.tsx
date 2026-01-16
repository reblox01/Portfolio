"use client";
import { getAllExperienceAction, reorderExperienceAction, bulkDeleteExperienceAction, bulkTogglePublishExperienceAction } from "@/actions/experience.actions";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { useRouter } from "next/navigation";
import { ExperienceType } from "@/lib/types/experience-types";

import { SortControl } from "@/components/dashboard/sort-control";

export default function ManageExperiencePage() {
  const router = useRouter();
  const [experience, setExperience] = React.useState<ExperienceType[]>([]);
  const [sortType, setSortType] = React.useState<string>("newest");

  const refreshData = async () => {
    const res = await getAllExperienceAction();
    setExperience(res.experience || []);
    setSortType(res.sortType || "newest");
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteExperienceAction(ids);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishExperienceAction(ids, publish);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleReorder = async (newOrder: ExperienceType[]) => {
    setExperience(newOrder);
    setSortType('custom');
    const items = newOrder.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }));
    await reorderExperienceAction(items);

    if (sortType !== 'custom') {
      await updateSortSettingsAction({ experienceSortType: 'custom' });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Experience</h2>
        <div className="flex items-center space-x-2">
          <SortControl
            contentType="experience"
            currentSort={sortType}
            onSortComplete={refreshData}
          />
          <Button asChild>
            <Link href="/dashboard/manage-experience/new">Add new experience</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={experience}
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
