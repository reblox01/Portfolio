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
const ProjectDetails = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", params.id],
    queryFn: () => getSingleProjectAction(params.id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetailContainer projectId={params?.id} />
    </HydrationBoundary>
  );
};
export default ProjectDetails;
