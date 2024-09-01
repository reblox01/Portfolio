"use client";

import { ExperienceType } from "@/lib/types/experience-types";
import { formatDate } from "date-fns";
import { motion } from "framer-motion";

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
}: ExperienceType) => {
  const sD = formatDate(startDate, "dd-MM-yyyy");
  const eD = formatDate(endDate, "dd-MM-yyyy");

  return (
    <motion.div
      className="transition duration-400 space-y-3 border rounded-xl p-4"
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <a href={`/experience/${id}`} className="block">
        <div className="flex items-center gap-x-3">
          <div>
            <span className="block text-sm font-medium">{companyName}</span>
            <h3 className="text-base text-gray-500 font-semibold mt-1">
              {positionName}
            </h3>
          </div>
        </div>
        <p className="text-gray-600 sm:text-sm">
          {sD} - {eD}
        </p>
        <div className="text-sm text-gray-600 flex items-center gap-6">
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z"
                fill="#9CA3AF"
              />
            </svg>
            {companyLocation}
          </span>
        </div>
      </a>
    </motion.div>
  );
};

export default ExperienceCard;
