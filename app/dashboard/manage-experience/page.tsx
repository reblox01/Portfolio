"use client";
import { getAllExperienceAction, bulkDeleteExperienceAction, bulkTogglePublishExperienceAction } from "@/actions/experience.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

export default function ManageExperiencePage() {
  const router = useRouter();
  const [experience, setExperience] = React.useState<any[]>([]);

  React.useEffect(() => {
    getAllExperienceAction().then((res) => setExperience(res.experience || []));
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteExperienceAction(ids);
    if (success) {
      router.refresh();
      const { experience } = await getAllExperienceAction();
      setExperience(experience || []);
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishExperienceAction(ids, publish);
    if (success) {
      router.refresh();
      const { experience } = await getAllExperienceAction();
      setExperience(experience || []);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Experience</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/manage-experience/new">Add new experience</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as ColumnDef<any, any>[]}
        data={experience}
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
