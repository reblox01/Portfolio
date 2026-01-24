"use client";

import EducationForm from "@/components/forms/EducationForm";
import { getSingleEducationAction } from "@/actions/education.actions";
import { EducationType } from "@/lib/types/education-types";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";

export default function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [education, setEducation] = useState<EducationType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSingleEducationAction(id).then((data) => {
            setEducation(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Edit Education</h2>
            </div>
            <div className="h-full w-full">
                <EducationForm education={education} />
            </div>
        </div>
    );
}
