import { getSingleProjectAction } from "@/actions/project.actions";
import { ProjectForm } from "../_components/project-form";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params;
  const project = await getSingleProjectAction(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}
