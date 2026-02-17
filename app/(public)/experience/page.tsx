import { getAllExperienceAction } from "@/actions/experience.actions";
import { Metadata } from "next";
import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ExperienceCardContainer from "./_components/ExperienceCardContainer";

import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/experience",
    defaultTitle: "Experience",
    defaultDescription: "Professional experience and career history of myself. Full Stack Developer with hands-on expertise in modern web development, software engineering, and digital solutions."
  });
}
const ExperiencePage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["experiences"],
    queryFn: () => getAllExperienceAction(true),
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
