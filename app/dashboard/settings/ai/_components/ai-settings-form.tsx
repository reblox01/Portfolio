"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"
import { useState, useMemo } from "react"
import { Eye, EyeOff, Check, X, Upload, Link as LinkIcon, Loader2, Crop as CropIcon, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Cropper from "react-easy-crop"
import { Point, Area } from "react-easy-crop"

import { updateAISettingsAction, testAIConnectionAction, uploadChatbotLogoAction } from "@/actions/ai-settings.actions"
import { ChatbotPreview } from "./chatbot-preview"
import { getCroppedImg } from "@/lib/crop-image"
import { cn } from "@/lib/utils"

type AISettings = {
    id: string
    enabled: boolean
    provider: string
    openaiKey: string | null
    geminiKey: string | null
    anthropicKey: string | null
    perplexityKey: string | null
    selectedModel: string
    useCustomInstruction: boolean
    customInstruction: string | null
    chatbotName: string
    chatbotGreeting: string
    chatbotPosition: string
    chatbotLogo: string | null
    primaryColor: string
    secondaryColor: string
    displayMode: string
    selectedPages: string[]
    defaultLanguage: string
    supportedLanguages: string[]
    saveConversations: boolean
    chatbotShape: string
    chatbotIconRotation: number
    chatbotIconSize: number
}

type Props = {
    initialData?: AISettings | null
}

const formSchema = z.object({
    enabled: z.boolean(),
    provider: z.enum(["openai", "gemini", "anthropic", "perplexity"]),
    openaiKey: z.string().optional().nullable(),
    geminiKey: z.string().optional().nullable(),
    anthropicKey: z.string().optional().nullable(),
    perplexityKey: z.string().optional().nullable(),
    selectedModel: z.string(),
    useCustomInstruction: z.boolean(),
    customInstruction: z.string().optional().nullable(),
    chatbotName: z.string().min(1).max(50),
    chatbotGreeting: z.string().min(1).max(200),
    chatbotPosition: z.enum(["bottom-right", "bottom-left"]),
    chatbotLogo: z.string().optional().nullable().or(z.literal("")),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
    displayMode: z.enum(["all", "selected"]),
    selectedPages: z.string().optional(), // Comma-separated
    defaultLanguage: z.string().length(2),
    supportedLanguages: z.string(), // Comma-separated
    saveConversations: z.boolean(),
    chatbotShape: z.string().optional(),
    chatbotIconRotation: z.number().min(0).max(360),
    chatbotIconSize: z.number().min(32).max(128),
})

const SHAPES = [
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
    { value: "rounded", label: "Rounded" },
    { value: "squircle", label: "Squircle" },
    { value: "hexagon", label: "Hexagon" },
    { value: "flower", label: "Flower" },
    { value: "star", label: "Star" },
    { value: "triangle", label: "Triangle" },
    { value: "diamond", label: "Diamond" },
    { value: "shield", label: "Shield" },
    { value: "shield-rounded", label: "Shield Rounded" },
    { value: "medal", label: "Medal" },
    { value: "pentagon", label: "Pentagon" },
    { value: "message", label: "Message" },
]

const MODELS = {
    openai: [
        { value: "gpt-4", label: "GPT-4", description: "Most capable, best for complex tasks" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo", description: "Faster and cheaper than GPT-4" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fast and economical" },
    ],
    gemini: [
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Lightning fast, newest multimodal model" },
        { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Most capable newest model" },
        { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", description: "Fast and balanced" },
        { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", description: "Best quality and performance" },
        { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", description: "Fast and efficient" },
    ],
    anthropic: [
        { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", description: "Most intelligent, best for complex tasks" },
        { value: "claude-3-opus-20240229", label: "Claude 3 Opus", description: "Strong performance" },
        { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet", description: "Balanced speed and intelligence" },
    ],
    perplexity: [
        { value: "llama-3.1-sonar-small-128k-online", label: "Sonar Small 128K", description: "Fast with online search" },
        { value: "llama-3.1-sonar-large-128k-online", label: "Sonar Large 128K", description: "Powerful with online search" },
        { value: "llama-3.1-sonar-huge-128k-online", label: "Sonar Huge 128K", description: "Most capable with online search" },
    ],
}

export function AISettingsForm({ initialData }: Props) {
    const router = useRouter()
    const [showOpenAI, setShowOpenAI] = useState(false)
    const [showGemini, setShowGemini] = useState(false)
    const [showAnthropic, setShowAnthropic] = useState(false)
    const [showPerplexity, setShowPerplexity] = useState(false)
    const [testing, setTesting] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [availableModels, setAvailableModels] = useState<{ provider: string; models: string[] } | null>(null)

    // Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            enabled: initialData?.enabled ?? false,
            provider: (initialData?.provider as any) ?? "openai",
            openaiKey: initialData?.openaiKey ?? null,
            geminiKey: initialData?.geminiKey ?? null,
            anthropicKey: initialData?.anthropicKey ?? null,
            perplexityKey: initialData?.perplexityKey ?? null,
            selectedModel: initialData?.selectedModel ?? "gpt-3.5-turbo",
            useCustomInstruction: initialData?.useCustomInstruction ?? false,
            customInstruction: initialData?.customInstruction ?? null,
            chatbotName: initialData?.chatbotName ?? "AI Assistant",
            chatbotGreeting: initialData?.chatbotGreeting ?? "Hi! How can I help you?",
            chatbotPosition: (initialData?.chatbotPosition as any) ?? "bottom-right",
            chatbotLogo: initialData?.chatbotLogo ?? null,
            primaryColor: initialData?.primaryColor ?? "#0ea5e9",
            secondaryColor: initialData?.secondaryColor ?? "#1e293b",
            displayMode: (initialData?.displayMode as any) ?? "all",
            selectedPages: initialData?.selectedPages?.join(", ") ?? "",
            defaultLanguage: initialData?.defaultLanguage ?? "en",
            supportedLanguages: initialData?.supportedLanguages?.join(", ") ?? "en",
            saveConversations: initialData?.saveConversations ?? true,
            chatbotShape: initialData?.chatbotShape ?? "circle",
            chatbotIconRotation: initialData?.chatbotIconRotation ?? 0,
            chatbotIconSize: initialData?.chatbotIconSize ?? 56,
        },
    })

    const isSubmitting = form.formState.isSubmitting
    const provider = form.watch("provider")
    const displayMode = form.watch("displayMode")
    const useCustomInstruction = form.watch("useCustomInstruction")
    const chatbotShape = form.watch("chatbotShape")
    const chatbotIconRotation = form.watch("chatbotIconRotation")
    const chatbotIconSize = form.watch("chatbotIconSize")

    async function testConnection(provider: "openai" | "gemini" | "anthropic" | "perplexity") {
        setTesting(provider)
        setAvailableModels(null)
        try {
            const result = await testAIConnectionAction(provider)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.message || "Connection successful!")
                if (result.models) {
                    setAvailableModels({ provider, models: result.models })
                }
            }
        } catch (error) {
            toast.error("Failed to test connection")
        } finally {
            setTesting(null)
        }
    }

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleCropUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        setIsUploading(true)
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (!croppedImageBlob) {
                toast.error("Failed to crop image")
                return
            }

            const formData = new FormData()
            formData.append("file", croppedImageBlob, "logo.png")

            const result = await uploadChatbotLogoAction(formData)

            if (result.error) {
                toast.error(result.error)
            } else if (result.url) {
                form.setValue("chatbotLogo", result.url, { shouldDirty: true })
                toast.success("Logo uploaded successfully")
                setIsCropDialogOpen(false)
                setImageSrc(null)
            }
        } catch (e) {
            toast.error("Failed to upload cropped image")
        } finally {
            setIsUploading(false)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Convert comma-separated strings to arrays
            const selectedPages = values.selectedPages
                ? values.selectedPages.split(",").map(p => p.trim()).filter(Boolean)
                : []
            const supportedLanguages = values.supportedLanguages
                ? values.supportedLanguages.split(",").map(l => l.trim()).filter(Boolean)
                : ["en"]

            const result = await updateAISettingsAction({
                ...values,
                selectedModel: values.selectedModel as any,
                selectedPages,
                supportedLanguages,
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("AI settings updated successfully")
                router.refresh()
            }
        } catch (e) {
            toast.error("Failed to update AI settings")
        }
    }

    const chatbotName = form.watch("chatbotName")
    const chatbotGreeting = form.watch("chatbotGreeting")
    const chatbotPosition = form.watch("chatbotPosition")
    const chatbotLogo = form.watch("chatbotLogo")
    const primaryColor = form.watch("primaryColor")
    const secondaryColor = form.watch("secondaryColor")

    const currentModels = useMemo(() => {
        const hardcoded = MODELS[provider as keyof typeof MODELS] || [];
        if (availableModels?.provider === provider) {
            // Filter out models that are already in the hardcoded list to avoid duplicates
            const dynamic = availableModels.models
                .filter(m => !hardcoded.some(h => h.value === m))
                .map(m => ({
                    value: m,
                    label: m,
                    description: "Discovered via API connection test"
                }));
            return [...hardcoded, ...dynamic];
        }
        return hardcoded;
    }, [provider, availableModels]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">AI Chatbot Settings</h1>
                <p className="text-muted-foreground">
                    Configure your AI-powered chatbot with API keys, appearance customization, and behavior settings.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {/* Left Column: Form Settings */}
                <div className="lg:col-span-1 xl:col-span-2 space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Enable/Disable */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                    <CardDescription>Enable or disable the AI chatbot on your website</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Enable AI Chatbot</FormLabel>
                                                    <FormDescription>
                                                        Show the chatbot widget to visitors
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
                                </CardContent>
                            </Card>

                            {/* Appearance */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Chatbot Appearance</CardTitle>
                                    <CardDescription>Customize the visual identity of your chatbot</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="chatbotName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chatbot Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="chatbotGreeting"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Greeting Message</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="chatbotLogo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chatbot Logo</FormLabel>
                                                <Tabs defaultValue="upload" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2" /> Upload Image</TabsTrigger>
                                                        <TabsTrigger value="url"><LinkIcon className="h-4 w-4 mr-2" /> Image URL</TabsTrigger>
                                                    </TabsList>

                                                    {/* Upload Tab */}
                                                    <TabsContent value="upload" className="space-y-4 pt-2">
                                                        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6 transition-colors hover:bg-muted/50">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    disabled={isUploading || isSubmitting}
                                                                    onClick={() => document.getElementById("logo-upload")?.click()}
                                                                >
                                                                    {isUploading ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Uploading...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Upload className="mr-2 h-4 w-4" />
                                                                            Select Image
                                                                        </>
                                                                    )}
                                                                </Button>
                                                                <input
                                                                    id="logo-upload"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0]
                                                                        if (!file) return

                                                                        const reader = new FileReader()
                                                                        reader.onload = () => {
                                                                            setImageSrc(reader.result as string)
                                                                            setIsCropDialogOpen(true)
                                                                        }
                                                                        reader.readAsDataURL(file)
                                                                        // Reset value so same file can be selected again if needed
                                                                        e.target.value = ""
                                                                    }}
                                                                />
                                                                <span className="text-xs text-muted-foreground text-center">
                                                                    Max 2MB. JPG, PNG, WebP, GIF.<br />
                                                                    Filename will be hashed for security.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TabsContent>

                                                    {/* URL Tab */}
                                                    <TabsContent value="url" className="pt-2">
                                                        <div className="space-y-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="https://example.com/logo.png"
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    disabled={isSubmitting}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Public URL to an image file
                                                            </FormDescription>
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="primaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Primary Color</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            {...field}
                                                            type="color"
                                                            className="w-12 h-10 p-1 cursor-pointer"
                                                            disabled={isSubmitting}
                                                        />
                                                        <Input
                                                            {...field}
                                                            placeholder="#000000"
                                                            className="flex-1 font-mono"
                                                            disabled={isSubmitting}
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="secondaryColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secondary Color</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            {...field}
                                                            type="color"
                                                            className="w-12 h-10 p-1 cursor-pointer"
                                                            disabled={isSubmitting}
                                                        />
                                                        <Input
                                                            {...field}
                                                            placeholder="#000000"
                                                            className="flex-1 font-mono"
                                                            disabled={isSubmitting}
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="chatbotPosition"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Customise Shape</FormLabel>
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Visual</Badge>
                                        </div>

                                        <div className="grid grid-cols-6 gap-2">
                                            {/* Hidden SVG for selector masks */}
                                            <svg width="0" height="0" className="absolute">
                                                <defs>
                                                    <clipPath id="selector-mask-circle" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
                                                    <clipPath id="selector-mask-square" clipPathUnits="objectBoundingBox"><rect x="0" y="0" width="1" height="1" rx="0" ry="0" /></clipPath>
                                                    <clipPath id="selector-mask-rounded" clipPathUnits="objectBoundingBox"><rect x="0" y="0" width="1" height="1" rx="0.12" ry="0.12" /></clipPath>
                                                    <clipPath id="selector-mask-squircle" clipPathUnits="objectBoundingBox"><path d="M0,0.5 C0,0 0,0 0.5,0 S1,0 1,0.5 S1,1 0.5,1 S0,1 0,0.5" /></clipPath>
                                                    <clipPath id="selector-mask-hexagon" clipPathUnits="objectBoundingBox"><path d="M0.5,0 C0.56,0 0.62,0.05 0.66,0.08 L0.92,0.23 C0.97,0.26 1,0.31 1,0.37 L1,0.63 C1,0.69 0.97,0.74 0.92,0.77 L0.66,0.92 C0.62,0.95 0.56,0.98 0.5,0.98 C0.44,0.98 0.38,0.95 0.34,0.92 L0.08,0.77 C0.03,0.74 0,0.69 0,0.63 L0,0.37 C0,0.31 0.03,0.26 0.08,0.23 L0.34,0.08 C0.38,0.05 0.44,0.02 0.5,0.02 Z" /></clipPath>
                                                    <clipPath id="selector-mask-flower" clipPathUnits="objectBoundingBox"><path d="M0.5,0 C0.6,0 0.68,0.1 0.77,0.12 C0.85,0.15 0.95,0.13 0.98,0.21 C1,0.3 0.92,0.38 0.92,0.5 C0.92,0.62 1,0.7 0.98,0.79 C0.95,0.87 0.85,0.85 0.77,0.88 C0.68,0.9 0.6,1 0.5,1 C0.4,1 0.32,0.9 0.23,0.88 C0.15,0.85 0.05,0.87 0.02,0.79 C0,0.7 0.08,0.62 0.08,0.5 C0.08,0.38 0,0.3 0.02,0.21 C0.05,0.13 0.15,0.15 0.23,0.12 C0.32,0.1 0.4,0 0.5,0 Z" /></clipPath>
                                                    <clipPath id="selector-mask-star" clipPathUnits="objectBoundingBox"><path d="M 0.9710 0.4437 l -0.1882 0.1705 a 0.0540 0.0567 0 0 0 -0.0176 0.0605 l 0.0588 0.2484 c 0.0031 0.0120 0.0026 0.0246 -0.0014 0.0363 a 0.0582 0.0610 0 0 1 -0.0208 0.0291 0.0580 0.0609 0 0 1 -0.0660 0.0013 l -0.2117 -0.1335 a 0.0534 0.0560 0 0 0 -0.0588 0 l -0.2117 0.1335 c -0.0470 0.0247 -0.1000 -0.0124 -0.0882 -0.0667 l 0.0588 -0.2484 c 0.0059 -0.0247 0 -0.0494 -0.0176 -0.0605 L 0.0185 0.4437 a 0.0614 0.0644 0 0 1 -0.0153 -0.0666 a 0.0614 0.0644 0 0 1 0.0193 -0.0293 a 0.0612 0.0643 0 0 1 0.0312 -0.0140 l 0.2469 -0.0185 c 0.0235 -0.0062 0.0412 -0.0185 0.0470 -0.0358 l 0.1058 -0.2422 a 0.0573 0.0602 0 0 1 0.0211 -0.0270 a 0.0572 0.0600 0 0 1 0.0637 0 a 0.0573 0.0602 0 0 1 0.0211 0.0270 l 0.0941 0.2372 a 0.0513 0.0539 0 0 0 0.0180 0.0263 a 0.0512 0.0538 0 0 0 0.0291 0.0107 l 0.2469 0.0235 c 0.0517 0.0049 0.0753 0.0717 0.0235 0.1087 z" /></clipPath>
                                                    <clipPath id="selector-mask-triangle" clipPathUnits="objectBoundingBox"><path d="M0.5,0.05 C0.55,0.05 0.9,0.75 0.92,0.8 C0.94,0.85 1,1 0.9,1 L0.1,1 C0,1 0.06,0.85 0.08,0.8 C0.1,0.75 0.45,0.05 0.5,0.05 Z" /></clipPath>
                                                    <clipPath id="selector-mask-diamond" clipPathUnits="objectBoundingBox"><path d="M0.5,0.05 C0.55,0.05 0.95,0.45 0.95,0.5 C0.95,0.55 0.55,0.95 0.5,0.95 C0.45,0.95 0.05,0.55 0.05,0.5 C0.05,0.45 0.45,0.05 0.5,0.05 Z" /></clipPath>
                                                    <clipPath id="selector-mask-shield" clipPathUnits="objectBoundingBox"><path d="M 0.9993 0.1914 c -0.1140 0 -0.2062 -0.0831 -0.2191 -0.1914 H 0.2191 a 0.2194 0.2085 0 0 0 -0.0702 0.1363 a 0.2196 0.2087 0 0 0 -0.1489 0.0551 v 0.0503 c 0 0.2455 0.1228 0.4749 0.3379 0.6372 L 0.5000 1.0000 l 0.1621 -0.1211 C 0.8772 0.7204 1.0000 0.4871 1.0000 0.2416 h -0.0007 V 0.1914 z" /></clipPath>
                                                    <clipPath id="selector-mask-shield-rounded" clipPathUnits="objectBoundingBox"><path d="M0.1,0 L0.9,0 C0.95,0 1,0.05 1,0.1 L1,0.6 C1,0.8 0.8,0.95 0.5,1 C0.2,0.95 0,0.8 0,0.6 L0,0.1 C0,0.05 0.05,0 0.1,0 Z" /></clipPath>
                                                    <clipPath id="selector-mask-medal" clipPathUnits="objectBoundingBox"><path d="M0.2,0 L0.8,0 C0.9,0 1,0.1 1,0.2 L1,0.7 C1,0.85 0.9,0.95 0.5,1 C0.1,0.95 0,0.85 0,0.7 L0,0.2 C0,0.1 0.1,0 0.2,0 Z" /></clipPath>
                                                    <clipPath id="selector-mask-pentagon" clipPathUnits="objectBoundingBox"><path d="M0.5,0.02 C0.55,0.02 0.95,0.35 0.95,0.4 L0.85,0.9 C0.83,0.95 0.78,1 0.73,1 L0.27,1 C0.22,1 0.17,0.95 0.15,0.9 L0.05,0.4 C0.05,0.35 0.45,0.02 0.5,0.02 Z" /></clipPath>
                                                    <clipPath id="selector-mask-message" clipPathUnits="objectBoundingBox"><path d="M0.1,0 L0.9,0 C0.95,0 1,0.05 1,0.1 V0.6 C1,0.65 0.95,0.7 0.9,0.7 H0.7 L0.7,0.95 C0.7,0.98 0.65,1 0.62,0.98 L0.4,0.7 H0.1 C0.05,0.7 0,0.65 0,0.6 V0.1 C0,0.05 0.05,0 0.1,0 Z" /></clipPath>
                                                </defs>
                                            </svg>

                                            {SHAPES.map((s) => (
                                                <Button
                                                    key={s.value}
                                                    type="button"
                                                    variant={chatbotShape === s.value ? "default" : "outline"}
                                                    className="h-10 w-full p-0 flex items-center justify-center overflow-hidden"
                                                    onClick={() => form.setValue("chatbotShape", s.value, { shouldDirty: true })}
                                                    title={s.label}
                                                >
                                                    <div
                                                        className={cn(
                                                            "h-6 w-6 transition-all",
                                                            chatbotShape === s.value ? "bg-primary-foreground" : "bg-muted-foreground"
                                                        )}
                                                        style={{
                                                            clipPath: `url(#selector-mask-${s.value})`
                                                        }}
                                                    />
                                                </Button>
                                            ))}
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="chatbotIconRotation"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Rotation</FormLabel>
                                                        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{field.value}°</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            min={0}
                                                            max={360}
                                                            step={1}
                                                            value={[field.value]}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="chatbotIconSize"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Icon Size</FormLabel>
                                                        <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{field.value}px</span>
                                                    </div>
                                                    <FormControl>
                                                        <Slider
                                                            min={32}
                                                            max={128}
                                                            step={1}
                                                            value={[field.value]}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* API Keys */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>API Keys</CardTitle>
                                    <CardDescription>Configure API keys for AI providers (encrypted in database)</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* OpenAI */}
                                    <FormField
                                        control={form.control}
                                        name="openaiKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>OpenAI API Key</FormLabel>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <FormControl>
                                                            <Input
                                                                type={showOpenAI ? "text" : "password"}
                                                                placeholder="sk-..."
                                                                {...field}
                                                                value={field.value || ""}
                                                                disabled={isSubmitting}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowOpenAI(!showOpenAI)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        >
                                                            {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => testConnection("openai")}
                                                        disabled={isSubmitting || testing === "openai" || !field.value}
                                                    >
                                                        {testing === "openai" ? "Testing..." : "Test"}
                                                    </Button>
                                                </div>
                                                {availableModels?.provider === "openai" && (
                                                    <div className="mt-2 space-y-2">
                                                        <p className="text-xs font-semibold">Available Models:</p>
                                                        <ScrollArea className="h-24 w-full rounded-md border p-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {availableModels.models.map((m) => (
                                                                    <Badge key={m} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => {
                                                                        form.setValue("selectedModel", m as any, { shouldDirty: true });
                                                                        toast.success(`Selected model: ${m}`);
                                                                    }}>
                                                                        {m}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                        <p className="text-[10px] text-muted-foreground italic">Tip: Click a model name to select it.</p>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Gemini */}
                                    <FormField
                                        control={form.control}
                                        name="geminiKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Google Gemini API Key</FormLabel>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <FormControl>
                                                            <Input
                                                                type={showGemini ? "text" : "password"}
                                                                placeholder="AI..."
                                                                {...field}
                                                                value={field.value || ""}
                                                                disabled={isSubmitting}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowGemini(!showGemini)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        >
                                                            {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => testConnection("gemini")}
                                                        disabled={isSubmitting || testing === "gemini" || !field.value}
                                                    >
                                                        {testing === "gemini" ? "Testing..." : "Test"}
                                                    </Button>
                                                </div>
                                                {availableModels?.provider === "gemini" && (
                                                    <div className="mt-2 space-y-2">
                                                        <p className="text-xs font-semibold">Available Models:</p>
                                                        <ScrollArea className="h-24 w-full rounded-md border p-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {availableModels.models.map((m) => (
                                                                    <Badge key={m} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => {
                                                                        form.setValue("selectedModel", m as any, { shouldDirty: true });
                                                                        toast.success(`Selected model: ${m}`);
                                                                    }}>
                                                                        {m}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                        <p className="text-[10px] text-muted-foreground italic">Tip: Click a model name to select it.</p>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Anthropic */}
                                    <FormField
                                        control={form.control}
                                        name="anthropicKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Anthropic Claude API Key</FormLabel>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <FormControl>
                                                            <Input
                                                                type={showAnthropic ? "text" : "password"}
                                                                placeholder="sk-ant-..."
                                                                {...field}
                                                                value={field.value || ""}
                                                                disabled={isSubmitting}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAnthropic(!showAnthropic)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        >
                                                            {showAnthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => testConnection("anthropic")}
                                                        disabled={isSubmitting || testing === "anthropic" || !field.value}
                                                    >
                                                        {testing === "anthropic" ? "Testing..." : "Test"}
                                                    </Button>
                                                </div>
                                                {availableModels?.provider === "anthropic" && (
                                                    <div className="mt-2 space-y-2">
                                                        <p className="text-xs font-semibold">Known Models:</p>
                                                        <ScrollArea className="h-24 w-full rounded-md border p-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {availableModels.models.map((m) => (
                                                                    <Badge key={m} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => {
                                                                        form.setValue("selectedModel", m as any, { shouldDirty: true });
                                                                        toast.success(`Selected model: ${m}`);
                                                                    }}>
                                                                        {m}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                        <p className="text-[10px] text-muted-foreground italic">Tip: Click a model name to select it.</p>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Perplexity */}
                                    <FormField
                                        control={form.control}
                                        name="perplexityKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Perplexity AI API Key</FormLabel>
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <FormControl>
                                                            <Input
                                                                type={showPerplexity ? "text" : "password"}
                                                                placeholder="pplx-..."
                                                                {...field}
                                                                value={field.value || ""}
                                                                disabled={isSubmitting}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPerplexity(!showPerplexity)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        >
                                                            {showPerplexity ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => testConnection("perplexity")}
                                                        disabled={isSubmitting || testing === "perplexity" || !field.value}
                                                    >
                                                        {testing === "perplexity" ? "Testing..." : "Test"}
                                                    </Button>
                                                </div>
                                                {availableModels?.provider === "perplexity" && (
                                                    <div className="mt-2 space-y-2">
                                                        <p className="text-xs font-semibold">Suggested Models:</p>
                                                        <ScrollArea className="h-24 w-full rounded-md border p-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {availableModels.models.map((m) => (
                                                                    <Badge key={m} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => {
                                                                        form.setValue("selectedModel", m as any, { shouldDirty: true });
                                                                        toast.success(`Selected model: ${m}`);
                                                                    }}>
                                                                        {m}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                        <p className="text-[10px] text-muted-foreground italic">Tip: Click a model name to select it.</p>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Additional Settings (Collapsed by default logic or similar if needed, keeping them visible for now) */}
                            {/* Provider & Model */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Provider & Model</CardTitle>
                                    <CardDescription>Select which AI provider and model to use</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="provider"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>AI Provider</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="openai">OpenAI</SelectItem>
                                                        <SelectItem value="gemini">Google Gemini</SelectItem>
                                                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                                                        <SelectItem value="perplexity">Perplexity AI</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="selectedModel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {currentModels.map((model) => (
                                                            <SelectItem key={model.value} value={model.value}>
                                                                <div className="flex flex-col gap-0.5 items-start">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">{model.label}</span>
                                                                        {model.description?.includes("Discovered") && (
                                                                            <Badge variant="outline" className="text-[9px] px-1 h-3.5 leading-none">New</Badge>
                                                                        )}
                                                                    </div>
                                                                    {model.description && (
                                                                        <span className="text-xs text-muted-foreground">{model.description}</span>
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Instructions */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Chatbot Instructions</CardTitle>
                                    <CardDescription>Customize how the AI assistant behaves</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="useCustomInstruction"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Custom Instruction</FormLabel>
                                                    <FormDescription>
                                                        Use custom instruction instead of auto-generated from portfolio data
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

                                    {useCustomInstruction && (
                                        <FormField
                                            control={form.control}
                                            name="customInstruction"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Custom System Instruction</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="You are a helpful assistant..."
                                                            className="min-h-[150px]"
                                                            {...field}
                                                            value={field.value || ""}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Define how the AI should behave and respond (max 2000 characters)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Page Display */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Page Display</CardTitle>
                                    <CardDescription>Choose where the chatbot appears</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="displayMode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Mode</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Pages</SelectItem>
                                                        <SelectItem value="selected">Selected Pages Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {displayMode === "selected" && (
                                        <FormField
                                            control={form.control}
                                            name="selectedPages"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Selected Pages</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="/, /about, /projects"
                                                            {...field}
                                                            value={field.value || ""}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Comma-separated list of page paths (e.g., /, /about, /contact)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Multi-language */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Multi-language Support</CardTitle>
                                    <CardDescription>Configure supported languages for the chatbot</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="defaultLanguage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="en"
                                                        maxLength={2}
                                                        {...field}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    2-letter ISO language code (e.g., en, fr, es)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="supportedLanguages"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Supported Languages</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="en, fr, es, de"
                                                        {...field}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Comma-separated list of 2-letter language codes
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Privacy */}
                            <Card className="border-muted-foreground/20">
                                <CardHeader>
                                    <CardTitle>Privacy & Data</CardTitle>
                                    <CardDescription>Control conversation storage</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="saveConversations"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Save Conversations</FormLabel>
                                                    <FormDescription>
                                                        Store chat conversations in database for review and analytics
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
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-3">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Right Column: Live Preview */}
                <div className="hidden lg:block lg:col-span-1 space-y-4">
                    <div className="sticky top-24">
                        <ChatbotPreview
                            name={chatbotName}
                            greeting={chatbotGreeting}
                            position={chatbotPosition}
                            logo={chatbotLogo}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            shape={chatbotShape}
                            rotation={chatbotIconRotation}
                            size={chatbotIconSize}
                        />
                    </div>
                </div>
            </div>

            {/* Crop Dialog */}
            <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crop Logo</DialogTitle>
                        <DialogDescription>
                            Adjust the image to fit the circle.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative h-60 w-full rounded-md overflow-hidden bg-black/5">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        )}
                    </div>

                    <div className="py-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-12">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCropUpload} disabled={isUploading}>
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CropIcon className="mr-2 h-4 w-4" />
                                    Crop & Upload
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
