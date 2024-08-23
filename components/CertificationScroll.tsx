'use client';

import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";
import { CertificateType } from "@/lib/types/certification-types";

export function CertificationScroll({ screenshot, title, organizationName }: CertificateType) {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-6xl font-semibold text-black dark:text-white">
                {title} <br />
              <span className="text-4xl md:text-[8rem] font-bold mt-1 leading-none">
                {organizationName}
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={screenshot}
          alt="Certification"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
