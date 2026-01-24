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
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    const res = await getAllTechstacksAction();
    setTechstacks(res.techstacks || []);
    setSortType(res.sortType || "newest");
    setIsLoading(false);
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
            <div className="h-4 w-20 bg-primary/10 animate-pulse rounded" />
            <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
            <div className="h-4 w-28 flex-1 bg-primary/10 animate-pulse rounded" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
              <div className="h-4 w-4 bg-primary/10 animate-pulse rounded" />
              <div className="h-8 w-8 bg-primary/10 animate-pulse rounded" />
              <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
              <div className="h-5 w-20 bg-primary/10 animate-pulse rounded-full flex-1" />
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
        <h2 className="text-2xl font-bold tracking-tight">Manage Tech Stack</h2>
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
