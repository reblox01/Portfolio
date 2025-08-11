import { getSingleContactAction } from "@/actions/contact.actions";
import { ContactSMTPForm } from "../_components/contact-smtp-form";
import { notFound } from "next/navigation";

interface EditContactSMTPPageProps {
  params: {
    id: string;
  };
}

export default async function EditContactSMTPPage({ params }: EditContactSMTPPageProps) {
  const { id } = params;
  const contact = await getSingleContactAction(id);

  if (!contact) {
    notFound();
  }

  return <ContactSMTPForm mode="edit" initialData={contact} />;
}
