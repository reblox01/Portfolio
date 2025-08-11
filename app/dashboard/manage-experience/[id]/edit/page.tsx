import { getSingleExperienceAction } from "@/actions/experience.actions";
import { redirect } from "next/navigation";
import { ExperienceForm } from "../../_components/experience-form";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const exp = await getSingleExperienceAction(params.id);
  if (!exp) redirect('/dashboard/manage-experience');
  return <ExperienceForm initialData={exp} mode="edit" />
}


