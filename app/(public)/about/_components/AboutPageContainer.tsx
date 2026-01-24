"use client";

import { motion } from "framer-motion";
import { getAdminDetail } from "@/actions/admin.actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { socialUrl } from "@/lib/utils/social-utils";
import { Sparkles, UserRoundSearch } from "lucide-react";

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
              {data?.twitter && socialUrl("twitter", data?.twitter) && (
                <>
                  {" "}
                  or follow me on{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={socialUrl("twitter", data?.twitter)!}
                  >
                    X
                  </Link>
                  .
                </>
              )}{" "}
              {data?.linkedIn && socialUrl("linkedIn", data?.linkedIn) && (
                <>
                  {" "}
                  Want to see where I've worked? Check out my{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={socialUrl("linkedIn", data?.linkedIn)!}
                  >
                    LinkedIn
                  </Link>
                  , or connect with me on LinkedIn.
                </>
              )}{" "}
              {data?.github && socialUrl("github", data?.github) && (
                <>
                  {" "}
                  For my latest projects, visit my{" "}
                  <Link
                    className="text-black font-semibold dark:text-white"
                    target="_blank"
                    href={socialUrl("github", data?.github)!}
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
            className="flex flex-col items-center mt-10"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 1.2 }}
            variants={fadeUpVariants}
          >
            <Button asChild className="rounded-full mb-4 w-full">
              {data?.resumeUrl && (
                <Link
                  className="min-h-[60px] px-8 mx-auto md:hidden flex gap-4 items-center w-fit"
                  href={data.resumeUrl}
                >
                  <UserRoundSearch className="h-6 w-6 transition-transform" />
                  Get Resume
                </Link>
              )}
            </Button>
            <Button asChild className="rounded-full w-full">
              <Link
                className="min-h-[60px] px-8 mx-auto md:hidden flex gap-4 items-center w-fit"
                href="/contact"
              >
                <Sparkles className="h-6 w-6 transition-transform" />
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
              <UserRoundSearch className="h-6 w-6 transition-transform" />
              Get Resume
            </Link>
          )}
          </Button><br/>
          <Button asChild className="rounded-full">
            <Link
              className="min-h-[60px] px-8 mx-auto hidden md:flex gap-4 items-center w-fit"
              href="/contact">
              <Sparkles className="h-6 w-6 transition-transform" />
              Get in Touch
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPageContainer;