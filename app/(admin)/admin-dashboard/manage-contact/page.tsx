import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from "@tanstack/react-query";
  import { ContactsTable } from "./_components/contact-table";
  import { ContactHeader } from "./_components/contact-header";
  import { getAllContactsAction } from "@/actions/contact.actions";
  
  export default async function Page() {
    const queryClient = new QueryClient();
  
    // Fetch data for prefetching
    const contactData = await getAllContactsAction();
  
    // Prefetch for the query client
    await queryClient.prefetchQuery({
      queryKey: ["contact"],
      queryFn: () => Promise.resolve(contactData),
    });
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactHeader />
        <ContactsTable />
      </HydrationBoundary>
    );
  }
  