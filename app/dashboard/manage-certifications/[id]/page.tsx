import { getSingleCertificationAction } from "@/actions/certification.actions";
import { redirect } from "next/navigation";
import { CertificationForm } from "../_components/certification-form";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await getSingleCertificationAction(id);
  if (!cert) redirect('/dashboard/manage-certifications');
  return <CertificationForm initialData={cert} mode="edit" />
}


