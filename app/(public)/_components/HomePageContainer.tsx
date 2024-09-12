"use client";
import { getAdminDetail } from "@/actions/admin.actions";
import { getRandomProjectsAction } from "@/actions/project.actions";

import { HeroParallax } from "@/components/ui/hero-parallax";
import { useQuery } from "@tanstack/react-query";
import GTKM from "./GTKM";
import ContactMe from "./ContactMe";
import HeroMobile from "./HeroMobile";
import { AdminType } from "@/lib/types/admin-types";
// import { HomeSection } from "./HomeSection";
import { HeroHeader } from "./HeroHeader";
import { Spotlight } from "@/components/ui/spotlight";

const HomePageContainer = () => {
  const { data: projectsData, isPending: projectsIsLoading } = useQuery({
    queryKey: ["random-projects"],
    queryFn: () => getRandomProjectsAction(),
  });
  const { data: adminData, isPending: adminDataIsLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });

  const projects = projectsData?.map(project => ({
    ...project,
    source: project.source || project.link,
  })) || [];

  const admin = {
    name: adminData?.name || "",
    position: adminData?.position || "",
    introduction: adminData?.introduction || "",
  };

  if (projectsIsLoading || adminDataIsLoading) {
    return <h2 className="text-xl ">Please wait...</h2>;
  }

  return (
    <>
     {/* <HeroHeader />*/}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      {admin && <HeroMobile {...(adminData as AdminType)} />}
      {/* You can Change it based on how much projects you have been added */}
      {projects?.length > 1 && (
        <HeroParallax admin={admin} projects={projects} />
      )}
      {/* <HomeSection /> */}
      <GTKM />
      <ContactMe />
    </>
  );
};
export default HomePageContainer;
