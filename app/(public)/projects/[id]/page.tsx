import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ProjectDetailContainer from "../_components/ProjectDetailContainer";
import { getSingleProjectAction } from "@/actions/project.actions";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getSingleProjectAction(id);
  return constructMetadata({
    path: `/projects/${id}`,
    defaultTitle: project?.title || "Project",
    defaultDescription: project?.oneLiner || `A project by Sohail Koutari.`,
  });
}
const ProjectDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", id],
    queryFn: () => getSingleProjectAction(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailContainer projectId={id} />
    </HydrationBoundary>
  );
};
export default ProjectDetails;
