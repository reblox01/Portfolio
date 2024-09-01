"use client";

import { getAllTechstacksAction } from "@/actions/techstack.actions";
import TechstackCard from "@/components/TechstackCard";
import { TechType } from "@/lib/types/techstack-types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const TechStackPageContainer = () => {
  const { data, isPending } = useQuery({
    queryKey: ["techstacks"],
    queryFn: () => getAllTechstacksAction(),
  });
  const techstacks = data?.techstacks || [];

  const skills =
    data?.techstacks.filter(
      (item) => item?.techstackType === TechType.Skills
    ) || [];
  const devTools =
    data?.techstacks.filter(
      (item) => item?.techstackType === TechType.DevTools
    ) || [];

  const platforms =
    data?.techstacks.filter((item) => item?.techstackType === TechType.Platforms) ||
    [];
  const multimedia =
    data?.techstacks.filter((item) => item?.techstackType === TechType.Multimedia) ||
    [];
  const system =
    data?.techstacks.filter(
      (item) => item?.techstackType === TechType.System
    ) || [];

  if (isPending) return <h2 className="text-xl">Please wait...</h2>;

  if (techstacks.length <= 0)
    return <h1 className="text-xl text-center">No techstack found!</h1>;

  return (
    <div className="max-w-7xl mx-auto">
      {skills?.length > 0 && (
        <>
          <motion.h1
            className="text-3xl md:text-5xl mb-4 pl-4 font-extrabold"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Skills
          </motion.h1>
          <div className="p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {skills?.map((techstack, index) => (
              <motion.div
                key={techstack?.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
              >
                <TechstackCard key={techstack?.id} {...techstack} />
              </motion.div>
            ))}
          </div>
        </>
      )}
      {devTools?.length > 0 && (
        <>
          <motion.h1
            className="text-3xl md:text-5xl my-4 pl-4 font-extrabold"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Dev Tools
          </motion.h1>
          <div className="p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {devTools?.map((techstack, index) => (
              <motion.div
                key={techstack?.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
              >
                <TechstackCard key={techstack?.id} {...techstack} />
              </motion.div>
            ))}
          </div>
        </>
      )}
      {platforms?.length > 0 && (
        <>
          <motion.h1
            className="text-3xl md:text-5xl my-4 pl-4 font-extrabold"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Platforms
          </motion.h1>
          <div className="p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {platforms?.map((techstack, index) => (
              <motion.div
                key={techstack?.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
              >
                <TechstackCard key={techstack?.id} {...techstack} />
              </motion.div>
            ))}
          </div>
        </>
      )}
      {multimedia?.length > 0 && (
        <>
          <motion.h1
            className="text-3xl md:text-5xl my-4 pl-4 font-extrabold"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Multimedia
          </motion.h1>
          <div className="p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {multimedia?.map((techstack, index) => (
              <motion.div
                key={techstack?.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 + 0.8, duration: 0.5 }}
              >
                <TechstackCard key={techstack?.id} {...techstack} />
              </motion.div>
            ))}
          </div>
        </>
      )}
      {system?.length > 0 && (
        <>
          <motion.h1
            className="text-3xl md:text-5xl my-4 pl-4 font-extrabold"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            System
          </motion.h1>
          <div className="p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {system?.map((techstack, index) => (
              <motion.div
                key={techstack?.id}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 + 1.0, duration: 0.5 }}
              >
                <TechstackCard key={techstack?.id} {...techstack} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TechStackPageContainer;
