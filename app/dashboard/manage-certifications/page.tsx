import { getAllCertificationsAction } from "@/actions/certification.actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ManageCertificationsPage() {
  const certificationsResult = await getAllCertificationsAction();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Certifications</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/manage-certifications/new">Add new certification</Link>
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={certificationsResult.certifications || []} />
    </div>
  );
}
