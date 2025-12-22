"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createExperienceAction, updateExperienceAction } from "@/actions/experience.actions"
import { CreateAndEditExperienceType, ExperienceType } from "@/lib/types/experience-types"
import { TagInput } from "@/components/ui/tag-input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

type Props = {
  initialData?: ExperienceType
  mode: "create" | "edit"
}

function toDateInputValue(d?: Date | null) {
  if (!d) return ""
  const iso = new Date(d).toISOString()
  return iso.slice(0, 10)
}

export function ExperienceForm({ initialData, mode }: Props) {
  const router = useRouter()

  const formSchema = z
    .object({
      positionName: z.string().min(1),
      companyName: z.string().min(1),
      companyLocation: z.string().min(1),
      workMode: z.enum(["remote", "hybrid", "onsite"]),
      startDate: z.string().min(1),
      isCurrentlyWorking: z.boolean().default(false),
      endDate: z.string().optional().nullable(),
      learned: z.array(z.string()).min(1),
      isPublished: z.boolean().default(true),
    })
    .refine((data) => data.isCurrentlyWorking || !!data.endDate, {
      path: ["endDate"],
      message: "End date is required when not currently working",
    })

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        positionName: initialData.positionName,
        companyName: initialData.companyName,
        companyLocation: initialData.companyLocation,
        workMode: (initialData as any).workMode || 'onsite',
        startDate: toDateInputValue(initialData.startDate),
        endDate: toDateInputValue(initialData.endDate),
        isCurrentlyWorking: initialData.isCurrentlyWorking,
        learned: (initialData.learned as any[]).map((s: any) => s?.text ?? String(s)),
        isPublished: (initialData as any).isPublished ?? true,
      }
      : {
        positionName: "",
        companyName: "",
        companyLocation: "",
        workMode: 'onsite',
        startDate: "",
        endDate: "",
        isCurrentlyWorking: false,
        learned: [] as string[],
        isPublished: true,
      },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: any) {
    try {
      const payload: CreateAndEditExperienceType = {
        positionName: values.positionName,
        companyName: values.companyName,
        companyLocation: values.companyLocation,
        startDate: values.startDate ? new Date(values.startDate) as Date : (new Date() as Date),
        endDate: values.isCurrentlyWorking || !values.endDate ? null : (new Date(values.endDate) as Date),
        workMode: values.workMode,
        isCurrentlyWorking: !!values.isCurrentlyWorking,
        learned: (values.learned as string[])
          .map((s) => s.trim())
          .filter(Boolean)
          .map((text) => ({ id: crypto.randomUUID(), text })),
        isPublished: !!values.isPublished,
      }

      if (mode === "create") {
        await createExperienceAction(payload)
        toast.success("Experience created")
      } else {
        if (!initialData?.id) throw new Error("Missing experience id")
        await updateExperienceAction(initialData.id, payload)
        toast.success("Experience updated")
      }
      router.push("/dashboard/manage-experience")
    } catch (e) {
      toast.error("Failed to save experience")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">
            {mode === "create" ? "Add Experience" : "Edit Experience"}
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === "create" ? "Create a new experience entry" : "Update your experience details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="positionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." disabled={isSubmitting} {...field} />
                      </FormControl>
                      <CardDescription className="text-xs">e.g., Acme Inc., Freelancer</CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work mode</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="onsite">On-site</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Remote / City, Country" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <CardDescription className="text-xs">If remote, still add your city for context</CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>



              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isSubmitting || form.watch("isCurrentlyWorking")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isCurrentlyWorking"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 mt-6">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                      </FormControl>
                      <Label>Currently working</Label>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="learned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What I Did</FormLabel>
                    <FormControl>
                      <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" disabled={isSubmitting} />
                    </FormControl>
                    <CardDescription className="text-xs">Add key responsibilities or tools (press Enter to add)</CardDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <CardDescription>
                        Visible on the public portfolio.
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/manage-experience")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>{mode === "create" ? "Create" : "Save changes"}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}


