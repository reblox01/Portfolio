import { ContactSMTPForm } from "../_components/contact-smtp-form";
import { getAllContactsAction } from "@/actions/contact.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function NewContactSMTPPage() {
  const { contacts } = await getAllContactsAction();
  
  // If SMTP already exists, show message
  if (contacts && contacts.length > 0) {
    return (
      <div className="flex-1 space-y-6 p-8">
        <Card className="border-muted-foreground/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl tracking-tight flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              SMTP Already Configured
            </CardTitle>
            <CardDescription className="text-sm">
              You can only have one SMTP configuration. Edit the existing one instead.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/dashboard/manage-contact-smtp">
                  View SMTP Config
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/manage-contact-smtp/${contacts[0].id}`}>
                  Edit SMTP Config
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ContactSMTPForm mode="create" />;
}
