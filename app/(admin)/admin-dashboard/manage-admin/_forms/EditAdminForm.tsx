"use client";
import { CldUploadButton } from "next-cloudinary";

//tags
import { Form } from "@/components/ui/form";
import { Tag } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//end tags

import {
  CustomFormField,
  CustomFormFieldFile,
  CustomTagField,
} from "@/components/FormComponents";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreateAndEditAdminType,
  Skill,
  createAndEditAdminSchema,
} from "@/lib/types/admin-types";
import { getAdminDetail, updateAdminDetails } from "@/actions/admin.actions";

function EditAdminForm() {
  const { data } = useQuery({
    queryKey: ["admin"],
    queryFn: () => getAdminDetail(),
  });
  const [logoId, setLogoId] = useState(data?.imageUrl || "");
  const [resumeId, setResumeId] = useState(data?.resumeUrl || "");
  const [skills, setSkills] = useState<Tag[]>((data?.skills as Skill[]) || []);

  const form = useForm<CreateAndEditAdminType>({
    resolver: zodResolver(createAndEditAdminSchema),
    defaultValues: {
      discord: data?.discord || "",
      education: data?.education || "",
      email: data?.email || "",
      facebook: data?.facebook || "",
      github: data?.github || "",
      imageUrl: data?.imageUrl || "",
      instagram: data?.instagram || "",
      introduction: data?.introduction || "",
      linkedIn: data?.linkedIn || "",
      location: data?.location || "",
      name: data?.name || "",
      position: data?.position || "",
      skills: (data?.skills as Skill[]) || [],
      twitter: data?.twitter || "",
      gitlab: data?.gitlab || "",
      whatsapp: data?.whatsapp || "",
      youtube: data?.youtube || "",
      resumeUrl: data?.resumeUrl || "",
    },
  });

  const { setValue } = form;

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditAdminType) =>
      updateAdminDetails(data?.id || "", values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "Cannot add more than one admin." });
        return;
      }
      router.push("/admin-dashboard/manage-admin");
      toast({ description: "Admin details updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      return null;
    },
  });

  function onSubmit(values: CreateAndEditAdminType) {
    const data: CreateAndEditAdminType = {
      ...values,
      imageUrl: logoId,
      resumeUrl: resumeId,
    };
    mutate(data);
  }

  return (
    <Form {...form}>
      <form className="pb-50" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2  items-start">
          {/* profile picture */}
          <div className="flex flex-col gap-3">
            <CustomFormFieldFile
              name="logo"
              title="Profile Picture"
              value={logoId}
              control={form.control}
            />
            <Button asChild variant="outline">
              <CldUploadButton
                onUpload={(result: any) => {
                  setLogoId(result?.info?.secure_url);
                }}
                uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
              />
            </Button>
          </div>
          {/* name */}
          <CustomFormField name="name" title="Name" control={form.control} />
          {/* position */}
          <CustomFormField
            name="position"
            title="position"
            control={form.control}
          />
          {/* location */}
          <CustomFormField
            name="location"
            title="location"
            control={form.control}
          />
          {/* introduction */}
          <CustomFormField
            name="introduction"
            title="introduction"
            control={form.control}
          />
          {/* education */}
          <CustomFormField
            name="education"
            title="education"
            control={form.control}
          />
          {/* keywords stack */}
          <CustomTagField
            control={form.control}
            name="skills"
            title="Skills"
            tagsList={skills}
            setTagsList={setSkills}
            setValue={setValue}
          />
          {/* email */}
          <CustomFormField name="email" title="email" control={form.control} />
          {/* github */}
          <CustomFormField
            name="github"
            title="github"
            control={form.control}
          />
          {/* gitlab */}
          <CustomFormField
            name="gitlab"
            title="gitlab"
            control={form.control}
          />
          {/* linkedIn */}
          <CustomFormField
            name="linkedIn"
            title="linkedIn"
            control={form.control}
          />
          {/* whatsapp */}
          <CustomFormField
            name="whatsapp"
            title="whatsapp "
            control={form.control}
          />
          {/* facebook */}
          <CustomFormField
            name="facebook"
            title="facebook "
            control={form.control}
          />
          {/* instagram */}
          <CustomFormField
            name="instagram"
            title="instagram "
            control={form.control}
          />
          {/* discord */}
          <CustomFormField
            name="discord"
            title="discord "
            control={form.control}
          />
          {/* twitter */}
          <CustomFormField
            name="twitter"
            title="twitter"
            control={form.control}
          />
          {/* resume */}
          <div className="flex flex-col gap-3">
            <CustomFormFieldFile
              name="resume"
              title="Resume"
              value={resumeId}
              control={form.control}
            />
            <Button asChild variant="outline">
              <CldUploadButton
                onUpload={(result: any) => {
                  setResumeId(result?.info?.secure_url);
                }}
                uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
              />
            </Button>
          </div>
          
          {/* youtube */}
          <CustomFormField
            name="youtube"
            title="youtube"
            control={form.control}
          />

          <Button
            type="submit"
            className="disabled md:col-span-2"
            disabled={isPending}>
            {isPending ? "Please wait..." : "Edit Admin"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default EditAdminForm;
