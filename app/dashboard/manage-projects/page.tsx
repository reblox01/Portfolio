
"use client";
import * as React from "react";
import { Project } from "@/lib/types/project-types";
import { getAllProjectsAction, reorderProjectsAction, bulkDeleteProjectsAction, bulkTogglePublishProjectsAction } from "@/actions/project.actions";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { useRouter } from "next/navigation";

import { SortControl } from "@/components/dashboard/sort-control";

export default function ManageProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [sortType, setSortType] = React.useState<string>("newest");

  const refreshData = async () => {
    const res = await getAllProjectsAction();
    setProjects(res.projects || []);
    setSortType(res.sortType || "newest");
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteProjectsAction(ids);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishProjectsAction(ids, publish);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleReorder = async (newOrder: Project[]) => {
    setProjects(newOrder);
    setSortType('custom');

    const items = newOrder.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }));
    await reorderProjectsAction(items);

    if (sortType !== 'custom') {
      await updateSortSettingsAction({ projectSortType: 'custom' });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Projects</h2>
        <div className="flex items-center space-x-2">
          <SortControl
            contentType="project"
            currentSort={sortType}
            onSortComplete={refreshData}
          />
          <Button asChild>
            <Link href="/dashboard/manage-projects/new">Add new project</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={projects}
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
