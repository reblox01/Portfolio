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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/image-upload"

import { createTechstackAction, updateTechstackAction } from "@/actions/techstack.actions"
import { Techstack, CreateAndEditTechstackType, TechType } from "@/lib/types/techstack-types"

type Props = {
  initialData?: Techstack
  mode: "create" | "edit"
}

const formSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().optional().default(""),
  category: z.string().min(1),
  url: z.string().url(),
  techstackType: z.nativeEnum(TechType),
})

export function TechstackForm({ initialData, mode }: Props) {
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        title: initialData.title,
        imageUrl: initialData.imageUrl,
        category: initialData.category,
        url: initialData.url,
        techstackType: initialData.techstackType,
      }
      : {
        title: "",
        imageUrl: "",
        category: "",
        url: "",
        techstackType: TechType.Skills,
      },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: any) {
    const payload: CreateAndEditTechstackType = {
      title: values.title,
      imageUrl: values.imageUrl,
      category: values.category,
      url: values.url,
      techstackType: values.techstackType,
    }

    try {
      if (mode === "create") {
        await createTechstackAction(payload)
        toast.success("Technology created")
      } else if (initialData?.id) {
        await updateTechstackAction(initialData.id, payload)
        toast.success("Technology updated")
      }
      router.push("/dashboard/manage-techstack")
    } catch (e) {
      toast.error("Failed to save technology")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">{mode === "create" ? "Add Technology" : "Edit Technology"}</CardTitle>
          <CardDescription className="text-sm">{mode === "create" ? "Create a new technology entry" : "Update this technology"}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="React" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="Frontend Framework" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="url" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official URL</FormLabel>
                    <FormControl><Input placeholder="https://react.dev" disabled={isSubmitting} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="techstackType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technology type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TechType.Skills}>Skills</SelectItem>
                        <SelectItem value={TechType.DevTools}>Dev Tools</SelectItem>
                        <SelectItem value={TechType.Platforms}>Platforms</SelectItem>
                        <SelectItem value={TechType.Multimedia}>Multimedia</SelectItem>
                        <SelectItem value={TechType.System}>System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon/Logo</FormLabel>
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

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/manage-techstack")} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{mode === "create" ? "Create" : "Save changes"}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
