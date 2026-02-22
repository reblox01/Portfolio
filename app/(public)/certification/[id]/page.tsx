import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import CertificationDetailContainer from "../_components/CertificationDetailContainer";
import { Metadata } from "next";
import { getSingleCertificationAction } from "@/actions/certification.actions";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const certification = await getSingleCertificationAction(id);
  return constructMetadata({
    path: `/certification/${id}`,
    defaultTitle: certification?.title || "Certification",
    defaultDescription: certification
      ? `${certification.title} issued by ${certification.organizationName}.`
      : "Professional certification by me.",
  });
}
const CertificationDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["certificate", id],
    queryFn: () => getSingleCertificationAction(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CertificationDetailContainer certificationId={id} />
    </HydrationBoundary>
  );
};
export default CertificationDetailPage;
