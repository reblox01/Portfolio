import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "../../../components/ui/spotlight";
import { FlipWords } from "../../../components/ui/flip-words";
import { AdminType } from "@/lib/types/admin-types";

export function HeroHeader () {
  const adjectiveWords = [
    "Innovative",
    "Exceptional",
    "Transformative",
    "Unique",
    "Engaging",
    "User-centric",
    "Creative",
    "Impactful",
  ];
  const adWords = [
    "Modern",
    "Innovative",
    "Cutting-edge",
    "Dynamic",
    "State-of-the-art",
    "Efficient",
    "Responsive",
    "Scalable",
    "Secure",
    "User-friendly",
  ];

  return (
    <div className="md:hidden h-[26rem] w-full rounded-md flex md:items-center md:justify-center bg-current/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Unlock the Potential of Your Web Apps with <FlipWords words={adjectiveWords} /> Solutions
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          I Build <FlipWords words={adWords} /> web applications that drive innovation and achieve results.
          <br />
          Let's build something exceptional together.
        </p>
      </div>
    </div>
  );
}
