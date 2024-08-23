"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { getAllContactsAction } from "@/actions/contact.actions";
import { DeleteContactButton } from "./delete-contact";

export const ContactsTable = () => {
  const { data, isPending } = useQuery({
    queryKey: ["contact"],
    queryFn: () => getAllContactsAction(),
  });
  const contacts = data?.contacts || [];
  if (isPending) return <h2 className="text-xl">Please wait...</h2>;

  return (
    <div className="flex flex-1 flex-col gap-4 ">
      {contacts.length < 1 ? (
        <>
          <h2 className="text-xl">No Contact Found...</h2>
        </>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact Info</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map(({ id, email, phone, address }) => (
                  <TableRow key={id}>
                    <TableCell>{email}</TableCell>
                    <TableCell>{phone}</TableCell>
                    <TableCell>{address}</TableCell>
                    <TableCell className="flex justify-center gap-2 md:gap-20">
                      <Button
                        className="flex items-center text-xsm gap-2 "
                        size="sm"
                        asChild
                        variant="outline">
                        <Link
                          href={`manage-contact/edit-contact/${id}`}>
                          <Pencil className="w-3 h-3 " />
                          Edit
                        </Link>
                      </Button>
                      <DeleteContactButton id={id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
