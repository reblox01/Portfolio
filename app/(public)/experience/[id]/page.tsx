import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getSingleExperienceAction } from "@/actions/experience.actions";
import ExperienceDetailPage from "../_components/ExperienceDetailPage";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const experience = await getSingleExperienceAction(id);
  const title = experience
    ? `${experience.positionName} at ${experience.companyName}`
    : "Experience";
  return constructMetadata({
    path: `/experience/${id}`,
    defaultTitle: title,
    defaultDescription: `${experience?.positionName || "Role"} at ${experience?.companyName || "Company"} — Sohail Koutari's professional experience.`,
  });
}
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
