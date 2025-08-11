import { AdminForm } from "../_components/admin-form"

export default function NewAdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Admin</h1>
      <AdminForm />
    </div>
  )
}


