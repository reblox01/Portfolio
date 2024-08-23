"use client";

import {
  getSingleContactAction,
  updateContactAction,
} from "@/actions/contact.actions";

import { CustomPasswordField, CustomFormField } from "@/components/FormComponents";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { CreateAndEditContactType, createAndEditContactSchema } from "@/lib/types/contact-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import React, { ChangeEvent } from 'react';

// Function to format password
const formatPassword = (value: string) => {
  if (!value) return '';
  return value
    .slice(0, 16)
    .match(/.{1,4}/g)
    ?.join('・') || '';
};

function EditContactForm({ contactId }: { contactId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["contact", contactId],
    queryFn: () => getSingleContactAction(contactId),
  });

  const form = useForm<CreateAndEditContactType>({
    resolver: zodResolver(createAndEditContactSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const { control, handleSubmit, setValue, reset } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditContactType) =>
      updateContactAction(contactId, values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "There was an error" });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      queryClient.invalidateQueries({ queryKey: ["contact", contactId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      router.push("/admin-dashboard/manage-contact");
      toast({ description: "Contact updated successfully!" });
    },
  });

  function onSubmit(values: CreateAndEditContactType) {
    mutate(values);
  }

  // Reset the form values when data is loaded
  React.useEffect(() => {
    if (data) {
      reset({
        email: data.email || "",
        password: data.password || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
  }, [data, reset]);

  return (
    <Form {...form}>
      <form className="pb-50" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <CustomFormField
            name="email"
            title="Your Email"
            control={control}
          />
          <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CustomPasswordField
                  name="password"
                  control={control}
                  title="Your Password"
                  value={formatPassword(field.value || '')}
                  onChange={(value: string) => {
                    const rawValue = value.replace(/[^a-zA-Z0-9]/g, '');
                    setValue('password', rawValue);
                  }}
                />
              )}
            />
          <CustomFormField
            name="phone"
            title="Your Phone Number"
            control={control}
          />
          <CustomFormField
            name="address"
            title="Your Address"
            control={control}
          />
          <Button
            type="submit"
            className="disabled md:col-span mt-auto"
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Edit Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditContactForm;
