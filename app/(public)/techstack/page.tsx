import SpotlightHero from "@/components/spot-light";
import { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import TechStackPageContainer from "./_components/TechStackPageContainer";
import { getAllTechstacksAction } from "@/actions/techstack.actions";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/techstack",
    defaultTitle: "Tech Stack",
    defaultDescription: "Technologies, tools, and platforms used by myself. Modern development stack including React, Next.js, Node.js, TypeScript, PostgreSQL, MongoDB, and more. Skills and expertise overview."
  });
}
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
