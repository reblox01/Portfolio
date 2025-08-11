import { getSingleTechstackAction } from "@/actions/techstack.actions";
import { redirect } from "next/navigation";
import { TechstackForm } from "../_components/techstack-form";

export default async function EditTechstackPage({ params }: { params: { id: string } }) {
  const tech = await getSingleTechstackAction(params.id);
  if (!tech) redirect('/dashboard/manage-techstack');
  return <TechstackForm initialData={tech} mode="edit" />
}


