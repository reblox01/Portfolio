import { getSingleCertificationAction } from "@/actions/certification.actions";
import { redirect } from "next/navigation";
import { CertificationForm } from "../_components/certification-form";

export default async function EditCertificationPage({ params }: { params: { id: string } }) {
  const cert = await getSingleCertificationAction(params.id);
  if (!cert) redirect('/dashboard/manage-certifications');
  return <CertificationForm initialData={cert} mode="edit" />
}


