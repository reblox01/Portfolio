"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

import { updateSiteSettingsAction } from "@/actions/site-settings.actions"

type SiteSettings = {
  id: string
  customCursor: boolean
}

type Props = {
  initialData?: SiteSettings | null
}

const formSchema = z.object({
  customCursor: z.boolean(),
})

export function SiteSettingsForm({ initialData }: Props) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customCursor: initialData?.customCursor ?? true,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateSiteSettingsAction(values)
      toast.success("Settings updated successfully")
      router.refresh()
    } catch (e) {
      toast.error("Failed to update settings")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">
          Customize your portfolio's appearance and behavior
        </p>
      </div>

      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl tracking-tight">General Settings</CardTitle>
          <CardDescription className="text-sm">Configure site-wide preferences</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customCursor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Custom Cursor
                      </FormLabel>
                      <FormDescription>
                        Enable an interactive custom cursor that enhances user experience.
                        The cursor will transform into a stylish hand pointer when hovering over clickable elements.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl tracking-tight">About Custom Cursor</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>🖱️ Custom Cursor Magic:</strong> Transform your visitors' experience with a stunning interactive cursor that adapts as they navigate your site!
            </p>
            <p>
              When enabled, your portfolio will feature an elegant custom cursor that morphs into a stylish hand pointer when hovering over clickable elements - creating a premium, interactive feel that will impress potential clients and employers!
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                💡 Tip: The custom cursor enhances the professional appearance of your portfolio and creates a memorable user experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
