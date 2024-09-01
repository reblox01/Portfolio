"use client";
import { getAllProjectsAction } from "@/actions/project.actions";
import Card from "@/components/Card";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectCardsContainer = () => {
  const { data, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjectsAction(),
  });
  const projects = data?.projects || [];
  
  if (isPending) return <h2 className="text-xl">Please wait...</h2>;

  if (projects.length <= 0)
    return <h1 className="text-xl text-center">No projects found!</h1>;

  return (
    <div className="max-w-7xl p-4 mx-auto gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project, index) => (
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
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectCardsContainer;
