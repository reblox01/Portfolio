"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllContactsAction } from "@/actions/contact.actions";
import { useEffect, useState } from "react";

export function PageHeader({ 
  title, 
  href
}: { 
  title: string; 
  href: string;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  
  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: () => getAllContactsAction(),
  });
  
  useEffect(() => {
    if (title === "contact" && data?.contacts && data.contacts.length > 0) {
      setIsDisabled(true);
    }
  }, [data, title]);

  return (
    <div className="flex justify-between items-center gap-2 mb-5">
      <h1 className="font-semibold capitalize text-sm md:text-2xl">
        Manage {title}
      </h1>
      <Button asChild size="default" disabled={isDisabled}>
        <Link href={href}>Add new {title}</Link>
      </Button>
    </div>
  );
}
