import { getSingleContactAction } from "@/actions/contact.actions";
import { ContactForm } from "../_components/contact-form";
import { notFound } from "next/navigation";

interface EditContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params;
  const contact = await getSingleContactAction(id);

  if (!contact) {
    notFound();
  }

  return <ContactForm mode="edit" initialData={contact} />;
}
