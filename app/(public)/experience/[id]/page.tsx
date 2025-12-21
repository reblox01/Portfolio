import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSingleExperienceAction } from "@/actions/experience.actions";
import ExperienceDetailPage from "../_components/ExperienceDetailPage";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Experience Info",
};
const ExperienceDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["experience", id],
    queryFn: () => getSingleExperienceAction(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExperienceDetailPage experienceId={id} />
    </HydrationBoundary>
  );
};
export default ExperienceDetail;
