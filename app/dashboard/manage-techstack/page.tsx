import { getAllTechstacksAction } from "@/actions/techstack.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ManageTechStackPage() {
  const { techstacks } = await getAllTechstacksAction();

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
      <DataTable columns={columns} data={techstacks || []} />
    </div>
  );
}
