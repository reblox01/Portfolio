import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import TechStackPageContainer from "./_components/TechStackPageContainer";
import { getAllTechstacksAction } from "@/actions/techstack.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Techstack",
};
const TechstackPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["techstacks"],
    queryFn: () => getAllTechstacksAction(),
  });
  return (
    <>
      <SpotlightHero
        pageName="Techstack"
        pageDescription="The skills I have, dev tools, platforms, and devices I use, and the multimedia I play."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TechStackPageContainer />
      </HydrationBoundary>
    </>
  );
};
export default TechstackPage;
