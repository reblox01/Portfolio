"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { createContactAction, updateContactAction } from "@/actions/contact.actions"
import { ContactType } from "@/lib/types/contact-types"

type Props = {
  initialData?: ContactType
  mode: "create" | "edit"
}

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(3, "Phone number is required and must be at least 3 characters"),
  address: z.string().min(1, "Address is required"),
})

export function ContactForm({ initialData, mode }: Props) {
  const router = useRouter()

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          email: initialData.email,
          phone: initialData.phone,
          address: initialData.address,
        }
      : {
          email: "",
          phone: "",
          address: "",
        },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: any) {
    const payload = {
      ...values,
      // Do not modify SMTP fields here; updateContactAction will preserve them
    }
    
    try {
      if (mode === "create") {
        await createContactAction(payload)
        toast.success("Contact information created")
      } else if (initialData?.id) {
        await updateContactAction(initialData.id, payload)
        toast.success("Contact information updated")
      }
      router.push("/dashboard/manage-contact")
      router.refresh()
    } catch (e) {
      toast.error("Failed to save contact information")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">
            {mode === "create" ? "Add Contact" : "Edit Contact"}
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === "create" ? "Create new contact entry" : "Update this contact"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Basic Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Information that will be displayed on your portfolio's contact page
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            disabled={isSubmitting} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            disabled={isSubmitting} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Main Street, City, State, Country"
                          className="min-h-[80px]"
                          disabled={isSubmitting} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/manage-contact")} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {mode === "create" ? "Create" : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
