"use client";
import { getAllTechstacksAction, reorderTechstackAction, bulkDeleteTechstackAction } from "@/actions/techstack.actions";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Techstack } from "@/lib/types/techstack-types";

import { SortControl } from "@/components/dashboard/sort-control";

export default function ManageTechStackPage() {
  const router = useRouter();
  const [techstacks, setTechstacks] = React.useState<Techstack[]>([]);
  const [sortType, setSortType] = React.useState<string>("newest");

  const refreshData = async () => {
    const res = await getAllTechstacksAction();
    setTechstacks(res.techstacks || []);
    setSortType(res.sortType || "newest");
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteTechstackAction(ids);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleReorder = async (newOrder: Techstack[]) => {
    setTechstacks(newOrder);
    setSortType('custom');

    const items = newOrder.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }));
    await reorderTechstackAction(items);

    if (sortType !== 'custom') {
      await updateSortSettingsAction({ techstackSortType: 'custom' });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Tech Stack</h2>
        <div className="flex items-center space-x-2">
          <SortControl
            contentType="techstack"
            currentSort={sortType}
            onSortComplete={refreshData}
          />
          <Button asChild>
            <Link href="/dashboard/manage-techstack/new">Add new technology</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={techstacks}
        onReorder={handleReorder}
        bulkActions={(selectedIds) => (
          <BulkActionsToolbar
            selectedIds={selectedIds}
            onDelete={handleBulkDelete}
            canPublish={false}
          />
        )}
      />
    </div>
  );
}
