"use client";
import { getAdminDetail } from "@/actions/admin.actions";
import { getRandomProjectsAction } from "@/actions/project.actions";

import { HeroParallax } from "@/components/ui/hero-parallax";
import { useQuery } from "@tanstack/react-query";
import GTKM from "./GTKM";
import ContactMe from "./ContactMe";
import HeroMobile from "./HeroMobile";
import { AdminType } from "@/lib/types/admin-types";
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

  const projects = (projectsData || []).map(project => ({
    ...project,
    source: project.source || project.link,
  }));

  const admin = {
    name: adminData?.name || "Sohail Koutari",
    position: adminData?.position || "Full Stack Developer & Cybersecurity Engineering Student",
    introduction: adminData?.introduction || "Welcome to my portfolio.",
  };

  const isLoading = projectsIsLoading || adminDataIsLoading;

  return (
    <>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      {isLoading ? (
        <div className="w-full max-w-7xl mx-auto py-20 px-4 animate-pulse space-y-8">
          <div className="h-12 w-2/3 bg-slate-800/50 rounded-lg"></div>
          <div className="h-6 w-1/2 bg-slate-800/30 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-800/40 rounded-xl border border-slate-700/50"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {adminData && <HeroMobile {...(adminData as AdminType)} />}
          {projects.length > 0 ? (
            <HeroParallax admin={admin} projects={projects} />
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <h1 className="text-3xl font-bold mb-4">{admin.name}</h1>
              <p className="text-lg max-w-2xl mx-auto mb-8">{admin.position}</p>
            </div>
          )}
        </>
      )}
      <GTKM />
      <ContactMe />
    </>
  );
};
export default HomePageContainer;
