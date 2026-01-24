import SpotlightHero from "@/components/spot-light";
import ProjectCardsContainer from "./_components/ProjectCardsContainer";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAllProjectsAction } from "@/actions/project.actions";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    path: "/projects",
    defaultTitle: "Projects",
    defaultDescription: "Explore my portfolio of web development projects. Full-stack applications built with React, Next.js, TypeScript, Node.js, and modern frameworks. View live demos and source code.",
  });
}
const ProjectsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjectsAction(true),
  });
  return (
    <>
      <SpotlightHero
        pageName="Projects"
        pageDescription="Projects and ideas I’ve worked on."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectCardsContainer />
      </HydrationBoundary>
    </>
  );
};
export default ProjectsPage;
