"use client";

import { getAllCertificationsAction } from "@/actions/certification.actions";
import Card from "@/components/Card";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CertificationCardContainer = () => {
  const { data, isPending } = useQuery({
    queryKey: ["certifications"],
    queryFn: () => getAllCertificationsAction(),
  });

  const certifications = data?.certifications || [];
  if (isPending) return <h2 className="text-xl">Please wait...</h2>;

  if (certifications.length <= 0)
    return <h1 className="text-xl text-center">No certification found!</h1>;

  return (
    <div className="max-w-7xl p-4 mx-auto gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {certifications.map((cert, index) => (
        <motion.div
        key={cert?.id}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <Card
          key={cert?.id}
          title={cert?.title}
          OneLiner={cert?.organizationName}
          source={cert?.certificateUrl}
          screenshot={cert?.screenshot}
          href={`/certification/${cert?.id}`}
        />
      </motion.div>
      ))}
    </div>
  );
};

export default CertificationCardContainer;
