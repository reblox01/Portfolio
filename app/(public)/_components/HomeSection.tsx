import React from "react";
import { FlipWords } from "../../../components/ui/flip-words";

export function HomeSection() {
  const adjectiveWords = ["modern", "innovative", "cutting-edge", "dynamic", "state-of-the-art"];
  const descriptiveWords = ["efficient", "responsive", "scalable", "secure", "user-friendly", "innovative"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4 pt-0 pb-96">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 text-left ml-0">
        I Build 
        <FlipWords words={adjectiveWords} /> <br />
        websites that are
        <FlipWords words={descriptiveWords} /> <br />
        for today's digital landscape.
      </div>
    </div>
  );
}
