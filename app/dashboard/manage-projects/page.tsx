"use client";
import * as React from "react";
import { Project } from "@/lib/types/project-types";
import { ColumnDef } from "@tanstack/react-table";
import { getAllProjectsAction } from "@/actions/project.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { bulkDeleteProjectsAction, bulkTogglePublishProjectsAction } from "@/actions/project.actions";
import { useRouter } from "next/navigation";

export default function ManageProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    getAllProjectsAction().then((res) => setProjects(res.projects || []));
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteProjectsAction(ids);
    if (success) {
      router.refresh();
      const { projects } = await getAllProjectsAction();
      setProjects(projects || []);
    }
  };

  const handleBulkPublish = async (ids: string[], publish: boolean) => {
    const success = await bulkTogglePublishProjectsAction(ids, publish);
    if (success) {
      router.refresh();
      const { projects } = await getAllProjectsAction();
      setProjects(projects || []);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Projects</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/manage-projects/new">Add new projects</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as ColumnDef<any, any>[]}
        data={projects}
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
