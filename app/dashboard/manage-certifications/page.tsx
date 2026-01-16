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

  const refreshData = async () => {
    const res = await getAllCertificationsAction();
    setCertifications(res.certifications || []);
    setSortType(res.sortType || "newest");
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Certifications</h2>
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
