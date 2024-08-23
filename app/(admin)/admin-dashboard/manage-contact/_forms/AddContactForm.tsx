'use client';

import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  CreateAndEditContactType,
  createAndEditContactSchema,
} from "@/lib/types/contact-types";
import { createContactAction } from "@/actions/contact.actions";
import { CustomPasswordField, CustomFormField } from "@/components/FormComponents";

const formatPassword = (value: string) => {
  if (!value) return '';
  return value
    .slice(0, 16)
    .match(/.{1,4}/g)
    ?.join('・') || '';
};

const AddContactForm = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();
  
    const form = useForm<CreateAndEditContactType>({
      resolver: zodResolver(createAndEditContactSchema),
      defaultValues: {
        email: "",
        password: "",
        address: "",
        phone: "",
      },
    });
  
    const { control, handleSubmit, setValue } = form;
  
    const { mutate, isPending } = useMutation({
      mutationFn: (values: CreateAndEditContactType) =>
        createContactAction(values),
      onSuccess: (data) => {
        if (!data) {
          toast({ description: "Cannot add more than one contact." });
          return;
        }
        router.push("/admin-dashboard/manage-contact");
        toast({ description: "Contact added successfully!" });
        queryClient.invalidateQueries({ queryKey: ["contact"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
        return null;
      },
    });
  
    function onSubmit(values: CreateAndEditContactType) {
        const data: CreateAndEditContactType = {
            ...values
          };
          mutate(data);
    }
  
    return (
      <Form {...form}>
        <form className="pb-50" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 items-start">
            <CustomFormField
              name="email"
              control={control}
              title="Your Email"
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
              control={control}
              title="Your Phone Number"
            />
            <CustomFormField
              name="address"
              control={control}
              title="Your Address"
            />
            <Button
              type="submit"
              className="disabled md:col-span mt-auto"
              disabled={isPending}
            >
              {isPending ? "Please wait..." : "Add Contact"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

export default AddContactForm;