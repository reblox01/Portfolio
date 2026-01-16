"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    createAndEditEducationSchema,
    CreateAndEditEducationType,
    EducationType,
} from "@/lib/types/education-types";
import {
    CustomFormField,
    CustomFormRichText,
} from "@/components/FormComponents";
import { DatePicker } from "@/components/DatePicker";
import { TagInput } from "@/components/ui/tag-input";
import { createEducationAction, updateEducationAction } from "@/actions/education.actions";

export default function EducationForm({
    education,
}: {
    education?: EducationType | null;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<CreateAndEditEducationType>({
        resolver: zodResolver(createAndEditEducationSchema),
        defaultValues: {
            degree: education?.degree || "",
            fieldOfStudy: education?.fieldOfStudy || "",
            institution: education?.institution || "",
            location: education?.location || "",
            startDate: education?.startDate || new Date(),
            endDate: education?.endDate || null,
            isCurrently: education?.isCurrently || false,
            grade: education?.grade || "",
            achievements: education?.achievements || [],
            description: education?.description || "",
            isPublished: education?.isPublished ?? true,
        },
    });

    function onSubmit(values: CreateAndEditEducationType) {
        startTransition(async () => {
            let result;
            if (education) {
                result = await updateEducationAction(education.id, values);
            } else {
                result = await createEducationAction(values);
            }

            if (result) {
                toast({
                    title: education ? "Education Updated" : "Education Added",
                    description: `Successfully ${education ? "updated" : "added"} ${values.degree}`,
                });
                router.push("/dashboard/manage-education");
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mx-auto p-6 bg-card rounded-xl border shadow-sm">

                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        {education ? "Edit Education" : "Add Education"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {education ? "Edit detailed information about your education history." : "Add a new education entry to your portfolio."}
                    </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomFormField
                        name="degree"
                        control={form.control}
                        title="Degree / Qualification"
                    />
                    <CustomFormField
                        name="fieldOfStudy"
                        control={form.control}
                        title="Field of Study"
                    />
                    <CustomFormField
                        name="institution"
                        control={form.control}
                        title="Institution Name"
                    />
                    <CustomFormField
                        name="location"
                        control={form.control}
                        title="Location (City, Country)"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatePicker
                        name="startDate"
                        control={form.control}
                        dateTitle="Start Date"
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <div className="flex justify-between">
                                    <FormLabel className="pt-3">End Date</FormLabel>
                                    <FormField
                                        control={form.control}
                                        name="isCurrently"
                                        render={({ field: switchField }) => (
                                            <FormItem className="flex items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Switch
                                                        checked={switchField.value}
                                                        onCheckedChange={(checked) => {
                                                            switchField.onChange(checked);
                                                            if (checked) {
                                                                form.setValue('endDate', null);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer text-sm">Currently Studying</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild disabled={form.watch("isCurrently")}>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={form.watch("isCurrently")}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomFormField
                        name="grade"
                        control={form.control}
                        title="Grade / GPA (Optional)"
                    />
                </div>

                <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Achievements / Key Takeaways</FormLabel>
                            <FormControl>
                                <TagInput
                                    {...field}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter achievement and press Enter"
                                />
                            </FormControl>
                            <div className="text-[0.8rem] text-muted-foreground">
                                Press Enter to add multiple achievements or skills learned
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <CustomFormRichText
                    name="description"
                    control={form.control}
                    title="Description / Coursework Details"
                />

                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Published</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Visible on the public portfolio.
                                </div>
                            </div>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        education ? "Update Education" : "Create Education"
                    )}
                </Button>
            </form>
        </Form>
    );
}
