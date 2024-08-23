import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from "@tanstack/react-query";
  import { ContactsTable } from "./_components/contact-table";
  import { PageHeader } from "@/components/PageHeader";
  import { getAllContactsAction } from "@/actions/contact.actions";
  
  export default async function Page() {
    const queryClient = new QueryClient();
  
    await queryClient.prefetchQuery({
      queryKey: ["contact"],
      queryFn: () => getAllContactsAction(),
    });
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageHeader
          title="contact"
          href="/admin-dashboard/manage-contact/add-contact"
        />
        <ContactsTable />
      </HydrationBoundary>
    );
  }
  