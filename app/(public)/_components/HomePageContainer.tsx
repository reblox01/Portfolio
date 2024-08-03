"use client";
import { getAdminDetail } from "@/actions/admin.actions";
import { getRandomProjectsAction } from "@/actions/project.actions";

import { HeroParallax } from "@/components/ui/hero-parallax";
import { useQuery } from "@tanstack/react-query";
import GTKM from "./GTKM";
import ContactMe from "./ContactMe";
import HeroMobile from "./HeroMobile";
import { AdminType } from "@/lib/types/admin-types";

const HomePageContainer = () => {
  const { data: projectsData, isPending: projectsIsLoading } = useQuery({
    queryKey: ["random-projects"],
    queryFn: () => getRandomProjectsAction(),
  });
  const { data: adminData, isPending: adminDataIsLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });

  const projects = projectsData || [];
  const admin = {
    name: adminData?.name || "",
    introduction: adminData?.introduction || "",
  };

  if (projectsIsLoading || adminDataIsLoading) {
    return <h2 className="text-xl ">Please wait...</h2>;
  }

  return (
    <>
      {admin && <HeroMobile {...(adminData as AdminType)} />}
  {/* You can Change it '4' based on how much projects you have been added */}
      {projects?.length > 4 && (
        <HeroParallax admin={admin} projects={projects} />
      )}
      <GTKM />
      <ContactMe />
    </>
  );
};
export default HomePageContainer;
