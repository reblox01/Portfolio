import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getRandomProjectsAction } from "@/actions/project.actions";
import HomePageContainer from "./_components/HomePageContainer";
import { getAdminDetail } from "@/actions/admin.actions";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/",
    defaultTitle: siteConfig.name,
    defaultDescription: "Explore my portfolio, a skilled Full Stack Developer specializing in React, Next.js, Node.js, TypeScript, and modern web technologies. View projects, experience, and get in touch.",
  });
}

const HomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["random-projects"],
    queryFn: () => getRandomProjectsAction(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageContainer />
    </HydrationBoundary>
  );
};
export default HomePage;
