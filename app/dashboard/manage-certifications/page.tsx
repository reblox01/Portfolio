"use client";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { bulkDeleteCertificationsAction, bulkTogglePublishCertificationsAction, getAllCertificationsAction, reorderCertificationsAction } from "@/actions/certification.actions";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CertificateType } from "@/lib/types/certification-types";

import { SortControl } from "@/components/dashboard/sort-control";

export default function ManageCertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = React.useState<CertificateType[]>([]);
  const [sortType, setSortType] = React.useState<string>("newest");
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    const res = await getAllCertificationsAction();
    setCertifications(res.certifications || []);
    setSortType(res.sortType || "newest");
    setIsLoading(false);
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteCertificationsAction(ids);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishCertificationsAction(ids, publish);
    if (success) {
      router.refresh();
      refreshData();
    }
  };

  const handleReorder = async (newOrder: CertificateType[]) => {
    setCertifications(newOrder);
    setSortType('custom');
    const items = newOrder.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }));
    await reorderCertificationsAction(items);

    if (sortType !== 'custom') {
      await updateSortSettingsAction({ certificationSortType: 'custom' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="h-8 w-56 bg-primary/10 animate-pulse rounded-md" />
          <div className="flex items-center space-x-2">
            <div className="h-10 w-32 bg-primary/10 animate-pulse rounded-md" />
            <div className="h-10 w-48 bg-primary/10 animate-pulse rounded-md" />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/50">
            <div className="h-4 w-4 bg-primary/10 animate-pulse rounded" />
            <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
            <div className="h-4 w-32 flex-1 bg-primary/10 animate-pulse rounded" />
            <div className="h-4 w-24 bg-primary/10 animate-pulse rounded" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4 border-b last:border-0">
              <div className="h-4 w-4 bg-primary/10 animate-pulse rounded" />
              <div className="h-12 w-12 bg-primary/10 animate-pulse rounded-md" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-48 bg-primary/10 animate-pulse rounded" />
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
        <h2 className="text-2xl font-bold tracking-tight">Manage Certifications</h2>
        <div className="flex items-center space-x-2">
          <SortControl
            contentType="certification"
            currentSort={sortType}
            onSortComplete={refreshData}
          />
          <Button asChild>
            <Link href="/dashboard/manage-certifications/new">Add new certifications</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={certifications}
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
