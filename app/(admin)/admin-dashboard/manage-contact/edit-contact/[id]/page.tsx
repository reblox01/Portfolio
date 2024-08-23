import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from "@tanstack/react-query";
  
  import { FormHeader } from "@/components/FormHeader";
  import EditContactForm from "../../_forms/EditContactForm";
  import { getSingleCertificationAction } from "@/actions/certification.actions";
  
  const EditProjectPage = async ({ params }: { params: { id: string } }) => {
    const queryClient = new QueryClient();
  
    await queryClient.prefetchQuery({
      queryKey: ["contact", params.id],
      queryFn: () => getSingleCertificationAction(params.id),
    });
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FormHeader title="Edit Contact" href=".." />
        <EditContactForm contactId={params.id} />
      </HydrationBoundary>
    );
  };
  export default EditProjectPage;
  