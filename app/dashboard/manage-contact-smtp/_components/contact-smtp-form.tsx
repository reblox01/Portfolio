"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Eye, EyeOff } from "lucide-react"

import { createContactAction, updateContactAction } from "@/actions/contact.actions"
import { ContactType } from "@/lib/types/contact-types"

type Props = {
  initialData?: ContactType
  mode: "create" | "edit"
}

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  emailPassword: z.string().optional().refine((val) => {
    if (!val) return true
    // Remove dots and spaces for validation
    const cleanVal = val.replace(/[•\s]/g, '')
    return cleanVal.length === 16
  }, {
    message: "Gmail app password must be 16 characters when provided"
  }),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
})

export function ContactSMTPForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  
  // Format password with dots every 4 characters for display
  const formatPasswordDisplay = (value: string) => {
    if (!value) return value
    // Remove any existing dots and spaces first, then add dots every 4 characters
    const cleanValue = value.replace(/[•\s]/g, '')
    return cleanValue.replace(/(.{4})(?=.)/g, '$1•')
  }
  
  // Remove dots and spaces from password for storage
  const cleanPasswordForStorage = (value: string) => {
    return value.replace(/[•\s]/g, '')
  }

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          email: initialData.email,
          emailPassword: initialData.emailPassword || "",
          phone: initialData.phone || "",
          address: initialData.address || "",
        }
      : {
          email: "",
          emailPassword: "",
          phone: "",
          address: "",
        },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: any) {
    const cleanedPassword = values.emailPassword ? cleanPasswordForStorage(values.emailPassword) : ""
    
    const payload = {
      ...values,
      // Clean password (remove dots) and handle empty case
      emailPassword: cleanedPassword || (mode === "edit" && initialData?.emailPassword ? initialData.emailPassword : ""),
    }
    
    // For create mode, ensure password is not empty
    if (mode === "create" && !payload.emailPassword) {
      toast.error("Email password is required for SMTP configuration")
      return
    }
    
    console.log("Submitting payload:", { ...payload, emailPassword: payload.emailPassword ? "[REDACTED]" : "empty" })
    
    try {
      if (mode === "create") {
        const result = await createContactAction(payload)
        if (result) {
          toast.success("Contact SMTP configuration created")
          router.push("/dashboard/manage-contact-smtp")
          router.refresh()
        } else {
          toast.error("Failed to create SMTP configuration")
        }
      } else if (initialData?.id) {
        const result = await updateContactAction(initialData.id, payload)
        if (result) {
          toast.success("Contact SMTP configuration updated")
          router.push("/dashboard/manage-contact-smtp")
          router.refresh()
        } else {
          toast.error("Failed to update SMTP configuration")
        }
      }
    } catch (e) {
      console.error("Form submission error:", e)
      toast.error("Failed to save SMTP configuration")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">
            {mode === "create" ? "Add Contact SMTP" : "Edit Contact SMTP"}
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === "create" ? "Create new SMTP configuration" : "Update this SMTP configuration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Gmail SMTP Setup Required</AlertTitle>
                <AlertDescription>
                  To use contact form functionality, you need to generate a Gmail App Password. 
                  Enable 2FA on your Gmail account, then create an app password for "Mail" application.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SMTP Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Email settings for sending contact form messages
                </p>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gmail Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@gmail.com" 
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
                  name="emailPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gmail App Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder={initialData?.emailPassword ? "Password configured (hidden for security)" : "abcd•efgh•ijkl•mnop"}
                            disabled={isSubmitting} 
                            {...field}
                            onChange={(e) => {
                              const rawValue = e.target.value
                              // Always format the value (removes spaces and adds dots)
                              const formattedValue = formatPasswordDisplay(rawValue)
                              field.onChange(formattedValue)
                            }}
                            onPaste={(e) => {
                              // Handle paste events to clean spaces immediately
                              e.preventDefault()
                              const pastedText = e.clipboardData.getData('text')
                              const cleanedText = pastedText.replace(/[•\s]/g, '')
                              const formattedValue = formatPasswordDisplay(cleanedText)
                              field.onChange(formattedValue)
                            }}
                            className="pr-10 font-mono"
                            maxLength={19} // 16 chars + 3 dots
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        {initialData?.emailPassword 
                          ? "Update with new password or leave blank to keep existing"
                          : "Generate this from your Google Account → Security → App passwords → Mail"
                        }
                        <br />
                        <span className="text-xs text-muted-foreground/80">
                          Password will be formatted as: abcd•efgh•ijkl•mnop for readability. Spaces will be automatically removed.
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hidden fields to maintain compatibility */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/manage-contact-smtp")} 
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
