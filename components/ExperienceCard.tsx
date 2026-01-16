"use client";

import { ExperienceType } from "@/lib/types/experience-types";
import { formatDate } from "date-fns";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Link from "next/link";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ExperienceCard = ({
  companyLocation,
  companyName,
  id,
  endDate,
  positionName,
  startDate,
  isCurrentlyWorking,
}: ExperienceType) => {
  const sD = formatDate(startDate, "MMM yyyy");
  const eD = isCurrentlyWorking ? "Present" : endDate ? formatDate(endDate, "MMM yyyy") : "";

  return (
    <motion.div
      className="transition duration-400 space-y-3 border rounded-xl p-4"
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <Link href={`/experience/${id}`} className="block">
        <div className="flex items-center gap-x-3">
          <h3 className="text-lg font-semibold">{positionName}</h3>
          <span className="text-sm text-gray-600">{companyName}</span>
        </div>
        <p className="text-gray-600 sm:text-sm">
          {sD} - {eD}
        </p>
        <div className="text-sm text-gray-600 flex items-center gap-6">
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            {companyLocation}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default ExperienceCard;
