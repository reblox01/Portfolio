"use client";
import React from "react";
import Image from "next/image";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { EducationType } from "@/lib/types/education-types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "isomorphic-dompurify";

export function EducationTimeline({ educationList }: { educationList: EducationType[] }) {
    if (!educationList || educationList.length === 0) {
        return (
            <div className="w-full h-40 flex items-center justify-center">
                <p className="text-muted-foreground">No education history published yet.</p>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto py-10 px-4 md:px-8">
            {/* Mobile View: Simple List, Desktop View: Tracing Beam */}
            <div className="hidden md:block">
                <TracingBeam className="px-6">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                        {educationList.map((item, index) => (
                            <div key={item.id} className="mb-28">
                                <h2 className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text text-xl font-bold mb-4 font-sans">
                                    {item.institution}
                                </h2>

                                <div className="text-sm prose prose-sm dark:prose-invert">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-lg">{item.degree}</span>
                                            {item.fieldOfStudy && (
                                                <span className="text-muted-foreground">in {item.fieldOfStudy}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-medium mb-2">
                                            <Badge variant="secondary" className="rounded-full">
                                                {format(new Date(item.startDate), "MMM yyyy")} - {item.isCurrently ? "Present" : item.endDate ? format(new Date(item.endDate), "MMM yyyy") : "N/A"}
                                            </Badge>
                                            {item.location && <Badge variant="outline" className="rounded-full">{item.location}</Badge>}
                                            {item.grade && <Badge variant="outline" className="rounded-full">Grade: {item.grade}</Badge>}
                                        </div>

                                        {item.description && (
                                            <div
                                                className="text-base text-muted-foreground mb-4 prose prose-sm dark:prose-invert max-w-none 
                                                            prose-p:m-0 prose-ul:m-0 prose-li:m-0 prose-headings:m-0"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(item.description)
                                                }}
                                            />
                                        )}

                                        {/* Achievements Tags */}
                                        {item.achievements && item.achievements.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {item.achievements.map((tag, i) => (
                                                    <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </div>

            <div className="md:hidden flex flex-col gap-12">
                {educationList.map((item, index) => (
                    <div key={item.id} className="border-l-2 border-primary/20 pl-6 relative">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                        <h2 className="text-xl font-bold mb-1">{item.institution}</h2>
                        <p className="text-muted-foreground text-sm mb-4">
                            {format(new Date(item.startDate), "MMM yyyy")} - {item.isCurrently ? "Present" : item.endDate ? format(new Date(item.endDate), "MMM yyyy") : "N/A"}
                        </p>

                        <div className="bg-card p-4 rounded-lg border shadow-sm">
                            <div className="font-semibold text-lg mb-1">{item.degree}</div>
                            <div className="text-primary mb-3">{item.fieldOfStudy}</div>
                            {item.description && <p className="text-sm text-muted-foreground mb-4">{item.description}</p>}
                            {/* Achievements Tags */}
                            {item.achievements && item.achievements.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {item.achievements.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
