import { getAdminDetail } from "@/actions/admin.actions";
import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import AboutPageContainer from "./_components/AboutPageContainer";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/about",
    defaultTitle: "About",
    defaultDescription: "Learn about me, a Full Stack Developer with expertise in React, Next.js, Node.js, and modern web technologies. Based in Morocco, working with Matissar on innovative web solutions.",
  });
}
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
