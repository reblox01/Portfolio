import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import CertificationDetailContainer from "../_components/CertificationDetailContainer";
import { Metadata } from "next";
import { getSingleCertificationAction } from "@/actions/certification.actions";
export const metadata: Metadata = {
  title: "Certification Info",
};
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
