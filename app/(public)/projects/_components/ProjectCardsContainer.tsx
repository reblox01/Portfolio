"use client";
import { getAllProjectsAction } from "@/actions/project.actions";
import Card from "@/components/Card";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Techstack } from "@/lib/types/techstack-types";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectCardsContainer = () => {
  const { data, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjectsAction(true),
  });
  const projects = data?.projects || [];

  if (isPending) {
    return (
      <div className="max-w-7xl p-4 mx-auto gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-800/40 rounded-xl border border-slate-700/50"></div>
        ))}
      </div>
    );
  }

  if (projects.length <= 0)
    return <h1 className="text-xl text-center py-10">No projects found!</h1>;

  return (
    <div className="max-w-7xl p-4 mx-auto gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project: any, index: number) => (
        <motion.div
          key={project?.id}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card
            key={project?.id}
            OneLiner={project?.oneLiner}
            title={project?.title}
            source={project?.sourceURL}
            screenshot={project?.screenshot}
            href={`/projects/${project?.id}`}
            techStack={project?.techStack as Techstack[] || []}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectCardsContainer;
