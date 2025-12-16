import { getSingleExperienceAction } from "@/actions/experience.actions";
import { redirect } from "next/navigation";
import { ExperienceForm } from "../../_components/experience-form";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exp = await getSingleExperienceAction(id);
  if (!exp) redirect('/dashboard/manage-experience');
  return <ExperienceForm initialData={exp} mode="edit" />
}


