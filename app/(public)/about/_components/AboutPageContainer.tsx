"use client";

import { motion } from "framer-motion";
import { getAdminDetail } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AboutPageContainer = () => {
  const { data, isPending } = useQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });

  if (isPending) return <h1>Loading...</h1>;
  if (!data) return <h1 className="text-center">Add admin details first!</h1>;

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container max-w-6xl px-4">
      <div className="grid w-full grid-cols-1 md:grid-cols-12">
        {/* left */}
        <div className="col-span-12 flex flex-col gap-12 md:col-span-8 md:pr-12">
          {/* Who I Am */}
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeUpVariants}
          >
            <p className="font-semibold uppercase dark:text-medium-gray">
              Who I am
            </p>
            <p className="text-[18px] leading-[160%] text-onyx">
              I’m{" "}
              <span className="text-black font-semibold dark:text-white">
                {data?.name || "Your Name"},
              </span>{" "}
              a {data?.position || "Position Name"} based in{" "}
              {data?.location || "Location"}. I specialize in creating seamless
              and innovative web solutions, leveraging my skills in both
              front-end and back-end development to build dynamic and
              user-centric applications.
            </p>
          </motion.div>

          {/* What I Do */}
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={fadeUpVariants}
          >
            <p className="font-semibold uppercase dark:text-medium-gray">
              WHAT I DO
            </p>
            <p className="text-[18px] leading-[160%] text-onyx">
              As a{" "}
              {data?.position || "position name"}, I specialize in crafting
              innovative web solutions that bring ideas to life. With a focus on
              both efficiency and creativity, I leverage my coding skills to
              develop dynamic, user-centric applications and websites. My
              expertise encompasses the full development lifecycle, from
              conceptualization to deployment, ensuring high-quality and
              impactful results.
            </p>
          </motion.div>

          {/* What I Did */}
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.6 }}
            variants={fadeUpVariants}
          >
            <p className="font-semibold uppercase dark:text-medium-gray">
              WHAT I DID
            </p>
            <p className="text-[18px] leading-[160%] text-onyx">
              During my {data?.education || "education"}, I honed skills in{" "}
              {data?.skills.map((skill: any, index: number) => (
                <span
                  className="capitalize text-black font-semibold dark:text-white"
                  key={skill?.id}
                >
                  {skill?.text}
                  {index !== data.skills.length - 1 ? "," : "."}{" "}
                </span>
              ))}
              These skills have enabled me to create seamless end-to-end and
              interactive user experiences.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.8 }}
            variants={fadeUpVariants}
          >
            <p className="text-[18px] leading-[160%] text-onyx">
              Feel free to reach out via{" "}
              <Link
                className="text-black font-semibold dark:text-white"
                href={`mailto:${data?.email}`}
              >
                E-mail
              </Link>
              ,{" "}
              {data?.twitter && (
                <>
                  {" "}
                  or follow me on{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={data?.twitter}
                  >
                    X
                  </Link>
                  .
                </>
              )}{" "}
              {data?.linkedIn && (
                <>
                  {" "}
                  Want to see where I’ve worked? Check out my{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={data?.linkedIn}
                  >
                    LinkedIn
                  </Link>
                  , or connect with me on LinkedIn.
                </>
              )}{" "}
              {data?.github && (
                <>
                  {" "}
                  For my latest projects, visit my{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={data?.github}
                  >
                    GitHub
                  </Link>{" "}
                  profile.
                </>
              )}{" "}
            </p>
          </motion.div>

          {/* Final Message */}
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 1.0 }}
            variants={fadeUpVariants}
          >
            <p className="text-[18px] leading-[160%] text-onyx">
              Let’s build something great together!
            </p>
          </motion.div>

          {/* Get in Touch Button */}
          <motion.div
            className="flex justify-center mt-10"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 1.2 }}
            variants={fadeUpVariants}
          >
            <Button asChild className="rounded-full">
              <Link
                className="min-h-[60px] px-8 mx-auto md:hidden flex gap-4 items-center w-fit"
                href="/contact"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.934 12 3.09 5.732c-.481-1.635 1.05-3.147 2.665-2.628a53.872 53.872 0 0 1 12.64 5.963C19.525 9.793 21 10.442 21 12c0 1.558-1.474 2.207-2.605 2.933a53.87 53.87 0 0 1-12.64 5.963c-1.614.519-3.146-.993-2.665-2.628L4.934 12Zm0 0h4.9"
                  ></path>
                </svg>
                Get in Touch
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* right */}
        <motion.div
          className="-order-1 col-span-12 md:order-2 md:col-span-4"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 1 }}
          variants={fadeUpVariants}
        >
          <div className="group relative mb-20 flex justify-center">
            <picture className="relative z-20 block w-full overflow-hidden rounded-2xl border-[1px] border-card-border">
              <img
                alt="Portrait"
                loading="lazy"
                width="344"
                height="443"
                decoding="async"
                className="w-full"
                data-nimg="1"
                src={data?.imageUrl}
              />
            </picture>
          </div>

          <Button asChild className="rounded-full">
          {data?.resumeUrl && (
            <Link
              className="min-h-[60px] px-8 mx-auto hidden md:flex gap-4 items-center w-fit"
              href={data.resumeUrl}
            >
              <svg width="24" height="24" viewBox="0 0 96 96" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="currentColor">
                <path fill="currentColor" opacity="1.00" d=" M 20.12 14.90 C 20.52 11.10 24.06 7.99 27.87 8.04 C 38.57 7.95 49.28 8.03 59.99 8.00 C 68.03 15.96 75.99 23.99 84.00 31.98 C 83.97 48.02 84.06 64.07 83.96 80.11 C 84.00 83.94 80.88 87.49 77.07 87.88 C 72.72 88.16 68.36 87.93 64.01 88.00 C 63.99 85.33 63.99 82.67 64.01 80.00 C 68.00 79.99 72.00 80.01 76.00 80.00 C 76.00 65.33 76.00 50.67 76.00 36.00 C 69.33 35.99 62.67 36.01 56.00 36.00 C 55.99 29.33 56.01 22.67 56.00 16.00 C 46.66 16.00 37.33 16.00 28.00 16.00 C 28.00 18.78 28.00 21.56 28.00 24.34 C 25.13 25.09 22.42 26.35 19.99 28.06 C 20.09 23.67 19.83 19.28 20.12 14.90 Z" />
                <path fill="currentColor" opacity="1.00" d=" M 28.32 32.63 C 35.29 30.06 43.47 35.59 43.91 42.94 C 44.84 50.43 37.37 57.35 29.96 55.79 C 23.35 54.75 18.54 47.58 20.40 41.08 C 21.36 37.13 24.49 33.89 28.32 32.63 M 30.30 40.36 C 27.54 41.47 27.20 45.72 29.70 47.30 C 32.17 49.17 36.16 47.15 36.00 44.03 C 36.17 41.17 32.82 39.06 30.30 40.36 Z" />
                <path fill="currentColor" opacity="1.00" d=" M 11.61 69.66 C 18.18 64.51 27.08 63.80 35.13 64.11 C 41.58 64.62 48.66 65.87 53.41 70.65 C 57.72 75.37 55.43 82.26 56.00 88.00 C 40.00 88.00 24.00 88.00 8.00 88.00 C 8.54 81.88 6.06 74.13 11.61 69.66 M 17.34 75.34 C 15.43 76.13 16.17 78.39 15.95 79.99 C 26.65 80.00 37.35 80.00 48.05 79.99 C 48.06 78.75 47.98 77.51 47.81 76.28 C 44.07 73.02 38.83 72.44 34.07 72.07 C 28.40 71.94 22.30 72.29 17.34 75.34 Z" />
                </g>
              </svg>
              Get Resume
            </Link>
          )}
          </Button><br/>
          <Button asChild className="rounded-full">
            <Link
              className=" min-h-[60px] px-8 mx-auto hidden md:flex gap-4 items-center w-fit"
              href="/contact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.934 12 3.09 5.732c-.481-1.635 1.05-3.147 2.665-2.628a53.872 53.872 0 0 1 12.64 5.963C19.525 9.793 21 10.442 21 12c0 1.558-1.474 2.207-2.605 2.933a53.87 53.87 0 0 1-12.64 5.963c-1.614.519-3.146-.993-2.665-2.628L4.934 12Zm0 0h4.9"></path>
              </svg>
              Get in Touch
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPageContainer;