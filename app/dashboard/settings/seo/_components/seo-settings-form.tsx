"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { Pencil, Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { upsertPageSeoAction, deletePageSeoAction } from "@/actions/page-seo.actions"

type PageSEO = {
    id: string
    path: string
    title: string | null
    description: string | null
    keywords: string | null
    noIndex: boolean
}

type Props = {
    initialPages: PageSEO[]
}

const formSchema = z.object({
    id: z.string().optional(),
    path: z.string().min(1, "Path is required").regex(/^\//, "Path must start with /"),
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    noIndex: z.boolean().default(false),
})

export function SeoSettingsForm({ initialPages }: Props) {
    const router = useRouter()
    const [pages, setPages] = useState<PageSEO[]>(initialPages)
    const [editingPage, setEditingPage] = useState<PageSEO | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Sync local state when props change (e.g. after router.refresh())
    useEffect(() => {
        setPages(initialPages)
    }, [initialPages])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            path: "",
            title: "",
            description: "",
            keywords: "",
            noIndex: false,
        },
    })

    const openDialog = (page?: PageSEO) => {
        if (page) {
            form.reset({
                id: page.id,
                path: page.path,
                title: page.title || "",
                description: page.description || "",
                keywords: page.keywords || "",
                noIndex: page.noIndex,
            })
            setEditingPage(page)
        } else {
            form.reset({
                path: "/",
                title: "",
                description: "",
                keywords: "",
                noIndex: false,
            })
            setEditingPage(null)
        }
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setEditingPage(null)
        form.reset()
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await upsertPageSeoAction(values)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success(editingPage ? "Page SEO updated" : "Page SEO created")

            // Optimistic update
            if (editingPage) {
                setPages(pages.map(p => p.id === editingPage.id ? { ...p, ...values, id: p.id } as PageSEO : p))
            } else {
                // For create, we can't easily guess the ID, so we rely on refresh
                // But we can force a reload of the current list from server
                router.refresh()
            }

            closeDialog()
            router.refresh()
        } catch (e) {
            toast.error("Failed to save page SEO")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this page SEO?")) return

        try {
            const result = await deletePageSeoAction(id)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success("Page SEO deleted")

            // Optimistic update
            setPages(pages.filter(p => p.id !== id))

            router.refresh()
        } catch (e) {
            toast.error("Failed to delete page SEO")
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">SEO Management</h1>
                <p className="text-muted-foreground">
                    Control meta tags and indexing for each page
                </p>
            </div>

            <Card className="border-muted-foreground/20 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl tracking-tight">Page SEO</CardTitle>
                            <CardDescription className="text-sm">
                                Manage individual pages
                            </CardDescription>
                        </div>
                        <Button onClick={() => openDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Page
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Path</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-mono text-sm">{page.path}</TableCell>
                                    <TableCell className="max-w-xs truncate">{page.title || "—"}</TableCell>
                                    <TableCell>
                                        {page.noIndex ? (
                                            <Badge variant="destructive">No Index</Badge>
                                        ) : (
                                            <Badge variant="default">Indexed</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDialog(page)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(page.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingPage ? "Edit Page SEO" : "Add Page SEO"}</DialogTitle>
                        <DialogDescription>
                            Configure meta tags and indexing for this page
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="path"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Path</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="/about"
                                                {...field}
                                                disabled={!!editingPage}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The URL path (e.g., /about, /projects)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Page Title" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Shown in browser tab and search results
                                        </FormDescription>
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
                                                placeholder="Brief description of the page"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Shown in search engine results
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Keywords</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="keyword1, keyword2, keyword3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Comma-separated keywords for SEO
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="noIndex"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                No Index
                                            </FormLabel>
                                            <FormDescription>
                                                Prevent search engines from indexing this page
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
