import { getSingleExperienceAction } from "@/actions/experience.actions";
import { redirect } from "next/navigation";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const exp = await getSingleExperienceAction(params.id);
  if (!exp) redirect('/dashboard/manage-experience');
  // TODO: replace with real form when available
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Edit Experience</h1>
      <p className="text-muted-foreground mt-2">Form not implemented yet.</p>
    </div>
  )
}


