import SpotlightHero from "@/components/spot-light";
import { Metadata } from "next";
import { EducationTimeline } from "./_components/EducationTimeline";
import { getAllEducationAction } from "@/actions/education.actions";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        path: "/education",
        defaultTitle: "Education",
        defaultDescription: "My academic background, qualifications, and certifications."
    });
}

const EducationPage = async () => {
    // Fetch published education entries
    const { education } = await getAllEducationAction(true);

    return (
        <>
            <SpotlightHero
                pageName="Education"
                pageDescription="My academic journey and qualifications."
            />
            <div className="container mx-auto px-4 pb-20">
                <EducationTimeline educationList={education || []} />
            </div>
        </>
    );
};
export default EducationPage;
