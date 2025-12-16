import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ProjectDetailContainer from "../_components/ProjectDetailContainer";
import { getSingleProjectAction } from "@/actions/project.actions";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Project Info",
};
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
