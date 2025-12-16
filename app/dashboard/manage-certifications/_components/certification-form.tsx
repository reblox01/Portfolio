"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { TagInput } from "@/components/ui/tag-input"
import ImageUpload from "@/components/image-upload"

import { createCertificationAction, updateCertificationAction } from "@/actions/certification.actions"
import { CertificateType, CreateAndEditCertificateType } from "@/lib/types/certification-types"

type Props = {
  initialData?: CertificateType
  mode: "create" | "edit"
}

const formSchema = z.object({
  title: z.string().min(1),
  organizationName: z.string().min(1),
  completionDate: z.string().min(1),
  credentialID: z.string().min(1),
  certificateUrl: z.string().url(),
  screenshot: z.string().optional().default(""),
  learned: z.array(z.string()).min(1),
})

export function CertificationForm({ initialData, mode }: Props) {
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        title: initialData.title,
        organizationName: initialData.organizationName,
        completionDate: new Date(initialData.completionDate).toISOString().slice(0, 10),
        credentialID: initialData.credentialID,
        certificateUrl: initialData.certificateUrl,
        screenshot: initialData.screenshot,
        learned: (initialData.learned as any[]).map((s: any) => s?.text ?? String(s)),
      }
      : {
        title: "",
        organizationName: "",
        completionDate: "",
        credentialID: "",
        certificateUrl: "",
        screenshot: "",
        learned: [] as string[],
      },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: any) {
    const payload: CreateAndEditCertificateType = {
      title: values.title,
      organizationName: values.organizationName,
      completionDate: new Date(values.completionDate),
      credentialID: values.credentialID,
      certificateUrl: values.certificateUrl,
      screenshot: values.screenshot,
      learned: (values.learned as string[]).map((t) => ({ id: crypto.randomUUID(), text: t })),
    }

    try {
      if (mode === "create") {
        await createCertificationAction(payload)
        toast.success("Certification created")
      } else if (initialData?.id) {
        await updateCertificationAction(initialData.id, payload)
        toast.success("Certification updated")
      }
      router.push("/dashboard/manage-certifications")
    } catch (e) {
      toast.error("Failed to save certification")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">{mode === "create" ? "Add Certification" : "Edit Certification"}</CardTitle>
          <CardDescription className="text-sm">{mode === "create" ? "Create a new certification entry" : "Update this certification"}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="AWS Certified Developer" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="organizationName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl><Input placeholder="Amazon" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField control={form.control} name="completionDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl><Input type="date" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="credentialID" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential ID</FormLabel>
                    <FormControl><Input placeholder="ABC-123" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="certificateUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate URL</FormLabel>
                    <FormControl><Input placeholder="https://..." disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="screenshot" render={({ field }) => (
                <FormItem>
                  <FormLabel>Screenshot</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="learned" render={({ field }) => (
                <FormItem>
                  <FormLabel>What I Learned</FormLabel>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" disabled={isSubmitting} />
                  </FormControl>
                  <CardDescription className="text-xs">Key topics or skills (press Enter to add)</CardDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/manage-certifications")} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{mode === "create" ? "Create" : "Save changes"}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}


