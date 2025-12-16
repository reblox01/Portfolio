import SpotlightHero from "@/components/spot-light";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import CertificationCardContainer from "./_components/CertificationCardContainer";
import { getAllCertificationsAction } from "@/actions/certification.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certification",
  description: "Explore the certifications I've earned from my work. These certifications are a testament to my skills and knowledge in my field."
};
const CertificationPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["certifications"],
    queryFn: () => getAllCertificationsAction(),
  });
  return (
    <>
      <SpotlightHero
        pageName="Certification"
        pageDescription="Elevating skills with certified precision."
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CertificationCardContainer />
      </HydrationBoundary>
    </>
  );
};
export default CertificationPage;
