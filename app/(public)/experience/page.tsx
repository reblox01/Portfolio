import { getAllExperienceAction } from "@/actions/experience.actions";
import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ExperienceCardContainer from "./_components/ExperienceCardContainer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description: "Delve into my extensive professional journey, where each role, project, and challenge has fueled my growth and passion for excellence. From hands-on experience to leadership roles, this section paints a vivid picture of my commitment to continuous learning and achievement.",
};
const ExperiencePage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["experiences"],
    queryFn: () => getAllExperienceAction(),
  });
  return (
    <>
      <SpotlightHero
        pageName="Experience"
        pageDescription="Hands-on expertise, endless passion."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExperienceCardContainer />
      </HydrationBoundary>
    </>
  );
};
export default ExperiencePage;
