import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getRandomProjectsAction } from "@/actions/project.actions";
import HomePageContainer from "./_components/HomePageContainer";
import { getAdminDetail } from "@/actions/admin.actions";
import { Metadata } from "next";
// Homepage should use the default title (just the name) from layout.tsx
// No custom metadata needed here
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
