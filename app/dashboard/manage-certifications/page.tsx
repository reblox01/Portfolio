"use client";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { bulkDeleteCertificationsAction, bulkTogglePublishCertificationsAction, getAllCertificationsAction } from "@/actions/certification.actions";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/table-core";

export default function ManageCertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    getAllCertificationsAction().then((res) => setCertifications(res.certifications || []));
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteCertificationsAction(ids);
    if (success) {
      router.refresh();
      const { certifications } = await getAllCertificationsAction();
      setCertifications(certifications || []);
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishCertificationsAction(ids, publish);
    if (success) {
      router.refresh();
      const { certifications } = await getAllCertificationsAction();
      setCertifications(certifications || []);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Certifications</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/manage-certifications/new">Add new certifications</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as ColumnDef<any, any>[]}
        data={certifications}
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
