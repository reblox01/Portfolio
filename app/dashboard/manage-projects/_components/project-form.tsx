"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { createProjectAction, updateProjectAction } from "@/actions/project.actions"
import { CreateAndEditProjectType, Project, ProjectType } from "@/lib/types/project-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import ImageUpload from "@/components/image-upload"
import { TagInput } from "@/components/ui/tag-input"

interface ProjectFormProps {
  initialData?: Project;
  mode: 'create' | 'edit';
}

const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?(\?[^\s]*)?$/;

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  oneLiner: z.string().min(2, {
    message: 'One-liner must be at least 2 characters.',
  }),
  logo: z.string(),
  screenshot: z.string(),
  projectType: z.nativeEnum(ProjectType),
  liveURL: z.string().optional().refine(value => !value || urlRegex.test(value), {
    message: 'Live URL must be a valid URL.',
  }),
  sourceURL: z.string().optional().refine(value => !value || urlRegex.test(value), {
    message: 'Source URL must be a valid URL.',
  }),
  techStack: z.array(z.string()).min(1, {
    message: 'At least one tech stack is required.',
  }),
  keywords: z.array(z.string()).min(1, {
    message: 'At least one keyword is required.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  })
});

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();

  // Transform initial data to match form schema
  const transformedInitialData = initialData ? {
    title: initialData.title,
    oneLiner: initialData.oneLiner,
    logo: initialData.logo,
    screenshot: initialData.screenshot,
    projectType: initialData.projectType as ProjectType,
    liveURL: initialData.liveURL || "",
    sourceURL: initialData.sourceURL || "",
    description: initialData.description,
    techStack: Array.isArray(initialData.techStack) 
      ? initialData.techStack.map((tech: any) => typeof tech === 'string' ? tech : tech.text || tech)
      : [],
    keywords: Array.isArray(initialData.keywords) 
      ? initialData.keywords.map((keyword: any) => typeof keyword === 'string' ? keyword : keyword.text || keyword)
      : []
  } : {
    title: "",
    oneLiner: "",
    logo: "",
    screenshot: "",
    projectType: ProjectType.Frontend,
    liveURL: "",
    sourceURL: "",
    description: "",
    techStack: [],
    keywords: []
  };

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: transformedInitialData
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: any) => {
    const payload: CreateAndEditProjectType = {
      title: values.title,
      oneLiner: values.oneLiner,
      logo: values.logo,
      screenshot: values.screenshot,
      projectType: values.projectType,
      liveURL: values.liveURL,
      sourceURL: values.sourceURL,
      description: values.description,
      techStack: (values.techStack as string[]).map((t) => ({ id: crypto.randomUUID(), text: t })),
      keywords: (values.keywords as string[]).map((k) => ({ id: crypto.randomUUID(), text: k })),
    };

    try {
      if (mode === 'create') {
        const result = await createProjectAction(payload);
        if (result) {
          toast.success("Project created successfully!");
          router.push('/dashboard/manage-projects');
          router.refresh();
        } else {
          toast.error("Failed to create project. Please try again.");
        }
      } else {
        if (!initialData?.id) throw new Error("No project ID provided");
        const result = await updateProjectAction(initialData.id, payload);
        if (result) {
          toast.success("Project updated successfully!");
          router.push('/dashboard/manage-projects');
          router.refresh();
        } else {
          toast.error("Failed to update project. Please try again.");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <Card className="border-muted-foreground/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl tracking-tight">
            {mode === 'create' ? 'Add Project' : 'Edit Project'}
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === 'create' ? 'Create a new project entry' : 'Update this project'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Awesome Project" 
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
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ProjectType.Frontend}>Frontend</SelectItem>
                          <SelectItem value={ProjectType.Backend}>Backend</SelectItem>
                          <SelectItem value={ProjectType.FullStack}>Full Stack</SelectItem>
                          <SelectItem value={ProjectType.CMS}>CMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="oneLiner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Line Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="A brief, compelling description of your project" 
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a comprehensive description of your project..."
                        className="min-h-[100px]"
                        disabled={isSubmitting} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="liveURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://your-project.com" 
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
                  name="sourceURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Code URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/username/project" 
                          disabled={isSubmitting} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Logo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="screenshot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Screenshot</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology Stack</FormLabel>
                    <FormControl>
                      <TagInput 
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press Enter"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <CardDescription className="text-xs">Technologies used in this project (press Enter to add)</CardDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords & Tags</FormLabel>
                    <FormControl>
                      <TagInput 
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type and press Enter"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <CardDescription className="text-xs">Keywords that describe your project (press Enter to add)</CardDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/manage-projects')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {mode === 'create' ? 'Create' : 'Save changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
