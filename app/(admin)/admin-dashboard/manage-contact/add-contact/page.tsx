import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from "@tanstack/react-query";
  import AddContactForm from "../_forms/AddContactForm";
  import { FormHeader } from "@/components/FormHeader";
  
  const AddContact = () => {
    const queryClient = new QueryClient();
  
    return (
      <>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FormHeader title="Add Contact" href="." />
          <AddContactForm />
        </HydrationBoundary>
      </>
    );
  };
  export default AddContact;
  