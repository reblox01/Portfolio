import { getAdminDetail } from "@/actions/admin.actions"
import { AdminForm } from "../_components/admin-form"

export default async function EditAdminPage() {
  const admin = await getAdminDetail()
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
      <AdminForm initialData={admin ? { ...admin, id: admin.id } as any : null} />
    </div>
  )
}


