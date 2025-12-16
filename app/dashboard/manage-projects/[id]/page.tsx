import { getSingleProjectAction } from "@/actions/project.actions";
import { ProjectForm } from "../_components/project-form";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getSingleProjectAction(id);
  return {
    title: project?.title || "Edit Project",
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getSingleProjectAction(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm mode="edit" initialData={project} />;
}
