"use client";
import { getAllTechstacksAction } from "@/actions/techstack.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { BulkActionsToolbar } from "../_components/bulk-actions-toolbar";
import { bulkDeleteTechstackAction } from "@/actions/techstack.actions";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

export default function ManageTechStackPage() {
  const router = useRouter();
  const [techstacks, setTechstacks] = React.useState<any[]>([]);

  React.useEffect(() => {
    getAllTechstacksAction().then((res) => setTechstacks(res.techstacks || []));
  }, []);

  const handleBulkDelete = async (ids: string[]) => {
    const success = await bulkDeleteTechstackAction(ids);
    if (success) {
      router.refresh();
      const { techstacks } = await getAllTechstacksAction();
      setTechstacks(techstacks || []);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Tech Stack</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/manage-techstack/new">Add new technology</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns as ColumnDef<any, any>[]}
        data={techstacks}
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
