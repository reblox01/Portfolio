import { getAdminDetail } from "@/actions/admin.actions";
import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import AboutPageContainer from "./_components/AboutPageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Get to know me better, explore my background, skills, and experiences. Discover my journey and the values that drive me in my work and personal life."
};
const AboutPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SpotlightHero
          pageName="A little bit about me"
          pageDescription="Who I am and what I do."
        />
        <AboutPageContainer />
      </HydrationBoundary>
    </>
  );
};
export default AboutPage;
