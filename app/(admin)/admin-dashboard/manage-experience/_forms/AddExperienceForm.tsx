"use client";
import { CldUploadButton } from "next-cloudinary";

//tags
import { Form } from "@/components/ui/form";

import { Tag } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
//end tags

import {
  CustomFormField,
  CustomFormFieldFile,
  CustomTagField,
} from "@/components/FormComponents";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreateAndEditExperienceType,
  ExperienceType,
  createAndEditExperienceSchema,
} from "@/lib/types/experience-types";

import { createExperienceAction } from "@/actions/experience.actions";
import { DatePicker } from "@/components/DatePicker";

function AddExperienceForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const [whatILearned, setWhatILearned] = useState<Tag[]>([]);

  const defaultDate: Date = new Date(Date.now()) || "2000-05-13";

  const defaultValues = {
    positionName: "",
    companyName: "",
    companyLocation: "",
    startDate: defaultDate,
    endDate: defaultDate,
    isCurrentlyWorking: false,
    learned: [],
  };

  const form = useForm<CreateAndEditExperienceType>({
    resolver: zodResolver(createAndEditExperienceSchema),
    defaultValues,
  });

  const { setValue, watch } = form;
  const isCurrentlyWorking = watch("isCurrentlyWorking");

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditExperienceType) =>
      createExperienceAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "there was an error" });
        return;
      }
      router.push("/admin-dashboard/manage-experience");
      toast({ description: "Experience added successfully!" });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      return null;
    },
  });

  function onSubmit(values: CreateAndEditExperienceType) {
    mutate(values);
  }
  return (
    <Form {...form}>
      <form className="pb-50" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2  items-start">
          <CustomFormField
            name="positionName"
            title="Position Name"
            control={form.control}
          />
          <CustomFormField
            name="companyName"
            title="Company Name"
            control={form.control}
          />

          <DatePicker
            name="startDate"
            dateTitle="Start Date"
            control={form.control}
          />
          <div className="flex flex-col gap-4">
            <DatePicker
              name="endDate"
              dateTitle="End Date"
              control={form.control}
              disabled={isCurrentlyWorking}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCurrentlyWorking"
                checked={isCurrentlyWorking}
                onCheckedChange={(checked) => {
                  setValue("isCurrentlyWorking", checked as boolean);
                  if (checked) {
                    setValue("endDate", new Date());
                  }
                }}
              />
              <Label htmlFor="isCurrentlyWorking">I currently work here</Label>
            </div>
          </div>
          <CustomFormField
            name="companyLocation"
            title="Company Location"
            control={form.control}
          />

          <Button
            type="submit"
            className="disabled md:col-span mt-auto"
            disabled={isPending}>
            {isPending ? "Please wait..." : "Add Experience"}
          </Button>
          <CustomTagField
            control={form.control}
            name="learned"
            title="What I Did"
            tagsList={whatILearned}
            setTagsList={setWhatILearned}
            setValue={setValue}
          />
        </div>
      </form>
    </Form>
  );
}
export default AddExperienceForm;
