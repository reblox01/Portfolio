"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getAllContactsAction } from "@/actions/contact.actions";

export function ContactHeader() {
  const [hasContact, setHasContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkContacts = async () => {
      try {
        setIsLoading(true);
        const result = await getAllContactsAction();
        setHasContact(result?.contacts && result.contacts.length > 0);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkContacts();
  }, []);

  return (
    <div className="flex justify-between items-center gap-2 mb-5">
      <h1 className="font-semibold capitalize text-sm md:text-2xl">
        Manage contact
      </h1>
      {isLoading ? (
        <Button disabled size="default">
          Loading...
        </Button>
      ) : (
        <Button 
          asChild={!hasContact} 
          size="default" 
          disabled={hasContact}
          title={hasContact ? "Only one contact is allowed" : "Add new contact"}
        >
          {!hasContact ? (
            <Link href="/admin-dashboard/manage-contact/add-contact">
              Add new contact
            </Link>
          ) : (
            "Only one contact allowed"
          )}
        </Button>
      )}
    </div>
  );
} 