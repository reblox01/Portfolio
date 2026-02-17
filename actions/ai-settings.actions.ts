"use server";

import prisma from "@/db";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { apiRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { encryptApiKey, safeEncryptApiKey, safeDecryptApiKey } from "@/lib/encryption";
import { z } from "zod";

// Authentication helper
async function authenticateAndRedirect(): Promise<string> {
    const { userId } = await auth();
    if (!userId) redirect('/');
    return userId;
}

// Validation schemas (OWASP compliance)
const aiSettingsUpdateSchema = z.object({
    enabled: z.boolean().optional(),
    provider: z.enum(["openai", "gemini", "anthropic", "perplexity"]).optional(),
    openaiKey: z.string().min(20).max(200).regex(/^[a-zA-Z0-9_-]+$/).or(z.literal("***masked***")).optional().or(z.literal("")).or(z.null()),
    geminiKey: z.string().min(20).max(200).regex(/^[a-zA-Z0-9_-]+$/).or(z.literal("***masked***")).optional().or(z.literal("")).or(z.null()),
    anthropicKey: z.string().min(20).max(200).regex(/^[a-zA-Z0-9_-]+$/).or(z.literal("***masked***")).optional().or(z.literal("")).or(z.null()),
    perplexityKey: z.string().min(20).max(200).regex(/^[a-zA-Z0-9_-]+$/).or(z.literal("***masked***")).optional().or(z.literal("")).or(z.null()),
    selectedModel: z.string().min(1).max(100).optional(),
    chatbotShape: z.string().optional(),
    chatbotIconRotation: z.number().min(0).max(360).optional(),
    chatbotIconSize: z.number().min(32).max(128).optional(),
    useCustomInstruction: z.boolean().optional(),
    customInstruction: z.string().max(2000).optional().nullable(),
    chatbotName: z.string().min(1).max(50).regex(/^[a-zA-Z0-9\s]+$/).optional(),
    chatbotGreeting: z.string().min(1).max(200).optional(),
    chatbotPosition: z.enum(["bottom-right", "bottom-left"]).optional(),
    chatbotLogo: z.string().max(5000000).optional().nullable(), // Allow data URIs (base64) or regular URLs
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    displayMode: z.enum(["all", "selected"]).optional(),
    selectedPages: z.array(z.string().max(100)).optional(),
    defaultLanguage: z.string().length(2).optional(),
    supportedLanguages: z.array(z.string().length(2)).optional(),
    saveConversations: z.boolean().optional(),
});

/**
 * Get AI settings (admin only, keys are returned decrypted for display)
 */
export async function getAISettingsAction() {
    await authenticateAndRedirect();

    try {
        let settings = await prisma.aISettings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.aISettings.create({
                data: {
                    enabled: false,
                    provider: "openai",
                    selectedModel: "gpt-3.5-turbo",
                }
            });
        }

        // Decrypt API keys for display (requested by user for visibility)
        return {
            settings: {
                ...settings,
                openaiKey: safeDecryptApiKey(settings.openaiKey),
                geminiKey: safeDecryptApiKey(settings.geminiKey),
                anthropicKey: safeDecryptApiKey(settings.anthropicKey),
                perplexityKey: safeDecryptApiKey(settings.perplexityKey),
            }
        };
    } catch (error) {
        console.error("Error getting AI settings:", error);
        return { error: "Failed to get AI settings" };
    }
}

/**
 * Update AI settings (admin only)
 */
export async function updateAISettingsAction(data: z.infer<typeof aiSettingsUpdateSchema>) {
    await authenticateAndRedirect();

    try {
        const ip = getClientIp(await headers());
        const { success } = await apiRateLimit.limit(ip);
        if (!success) return { error: "Rate limit exceeded" };

        // Validate input
        const validated = aiSettingsUpdateSchema.parse(data);

        let settings = await prisma.aISettings.findFirst();

        // Prepare update data with encrypted keys
        const updateData: any = { ...validated };

        // Encrypt API keys if provided (and not the masked placeholder)
        if (validated.openaiKey && validated.openaiKey !== '***masked***') {
            updateData.openaiKey = encryptApiKey(validated.openaiKey);
        } else if (validated.openaiKey === null) {
            updateData.openaiKey = null;
        } else {
            delete updateData.openaiKey; // Don't update if masked
        }

        if (validated.geminiKey && validated.geminiKey !== '***masked***') {
            updateData.geminiKey = encryptApiKey(validated.geminiKey);
        } else if (validated.geminiKey === null) {
            updateData.geminiKey = null;
        } else {
            delete updateData.geminiKey;
        }

        if (validated.anthropicKey && validated.anthropicKey !== '***masked***') {
            updateData.anthropicKey = encryptApiKey(validated.anthropicKey);
        } else if (validated.anthropicKey === null) {
            updateData.anthropicKey = null;
        } else {
            delete updateData.anthropicKey;
        }

        if (validated.perplexityKey && validated.perplexityKey !== '***masked***') {
            updateData.perplexityKey = encryptApiKey(validated.perplexityKey);
        } else if (validated.perplexityKey === null) {
            updateData.perplexityKey = null;
        } else {
            delete updateData.perplexityKey;
        }

        if (settings) {
            settings = await prisma.aISettings.update({
                where: { id: settings.id },
                data: updateData
            });
        } else {
            settings = await prisma.aISettings.create({
                data: updateData
            });
        }

        // Return with decrypted keys for immediate UI update
        return {
            settings: {
                ...settings,
                openaiKey: safeDecryptApiKey(settings.openaiKey),
                geminiKey: safeDecryptApiKey(settings.geminiKey),
                anthropicKey: safeDecryptApiKey(settings.anthropicKey),
                perplexityKey: safeDecryptApiKey(settings.perplexityKey),
            }
        };
    } catch (error) {
        console.error("Error updating AI settings:", error);
        if (error instanceof z.ZodError) {
            return { error: "Invalid input data: " + error.errors.map(e => e.message).join(", ") };
        }
        return { error: "Failed to update AI settings" };
    }
}

/**
 * Test API key connection (admin only)
 */
export async function testAIConnectionAction(provider: "openai" | "gemini" | "anthropic" | "perplexity") {
    await authenticateAndRedirect();

    const ip = getClientIp(await headers());
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return { error: "Rate limit exceeded" };

    try {
        const settings = await prisma.aISettings.findFirst();
        if (!settings) {
            return { error: "No AI settings found" };
        }

        let apiKey: string | null = null;

        // Decrypt the appropriate key
        switch (provider) {
            case "openai":
                apiKey = safeDecryptApiKey(settings.openaiKey);
                break;
            case "gemini":
                apiKey = safeDecryptApiKey(settings.geminiKey);
                break;
            case "anthropic":
                apiKey = safeDecryptApiKey(settings.anthropicKey);
                break;
            case "perplexity":
                apiKey = safeDecryptApiKey(settings.perplexityKey);
                break;
        }

        if (!apiKey) {
            return { error: `No ${provider} API key configured` };
        }

        // Test actual API connection
        try {
            if (provider === "openai") {
                const response = await fetch("https://api.openai.com/v1/models", {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                    },
                });
                if (!response.ok) {
                    return { error: `Invalid OpenAI API key (${response.status})` };
                }
                const data = await response.json();
                const modelNames = data.data ? data.data.map((m: any) => m.id) : [];
                return { success: true, message: "OpenAI connection successful!", models: modelNames };
            } else if (provider === "gemini") {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                if (!response.ok) {
                    return { error: `Invalid Gemini API key (${response.status})` };
                }
                const data = await response.json();
                const modelNames = data.models ? data.models.map((m: any) => m.name.replace('models/', '')) : [];
                return { success: true, message: "Gemini connection successful!", models: modelNames };
            } else if (provider === "anthropic") {
                const response = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "x-api-key": apiKey,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "claude-3-5-sonnet-20241022",
                        max_tokens: 10,
                        messages: [{ role: "user", content: "test" }],
                    }),
                });
                if (!response.ok) {
                    const error = await response.text();
                    if (response.status === 401) {
                        return { error: "Invalid Anthropic API key" };
                    }
                    return { error: `Anthropic API error (${response.status})` };
                }
                // Anthropic doesn't have a simple "list models" like OpenAI, but we can return the one we tested or hardcoded ones if needed.
                // For now, let's just return success as before, or list known ones.
                return { success: true, message: "Anthropic connection successful!", models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-sonnet-20240229"] };
            } else if (provider === "perplexity") {
                const response = await fetch("https://api.perplexity.ai/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llama-3.1-sonar-small-128k-online",
                        messages: [{ role: "user", content: "test" }],
                        max_tokens: 10,
                    }),
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        return { error: "Invalid Perplexity API key" };
                    }
                    return { error: `Perplexity API error (${response.status})` };
                }
                // Return common Perplexity models as a list
                return {
                    success: true,
                    message: "Perplexity connection successful!",
                    models: ["llama-3.1-sonar-small-128k-online", "llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-huge-128k-online"]
                };
            }
        } catch (networkError) {
            console.error("Network error testing API:", networkError);
            return { error: `Network error: Unable to reach ${provider} API` };
        }

        return { error: "Unknown provider" };
    } catch (error) {
        console.error("Error testing AI connection:", error);
        return { error: "Failed to test connection" };
    }
}

/**
 * Get public AI config (no sensitive data, for chatbot widget)
 */
export async function getPublicAIConfigAction() {
    try {
        const settings = await prisma.aISettings.findFirst();

        if (!settings || !settings.enabled) {
            return { enabled: false };
        }

        return {
            enabled: true,
            chatbotName: settings.chatbotName,
            chatbotGreeting: settings.chatbotGreeting,
            chatbotPosition: settings.chatbotPosition,
            chatbotLogo: settings.chatbotLogo,
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
            displayMode: settings.displayMode,
            selectedPages: settings.selectedPages,
            defaultLanguage: settings.defaultLanguage,
            supportedLanguages: settings.supportedLanguages,
            chatbotShape: settings.chatbotShape,
            chatbotIconRotation: settings.chatbotIconRotation,
            chatbotIconSize: settings.chatbotIconSize,
            saveConversations: settings.saveConversations,
        };
    } catch (error) {
        console.error("Error getting public AI config:", error);
        return { enabled: false };
    }
}

/**
 * Upload chatbot logo (stored as base64 in database)
 */
export async function uploadChatbotLogoAction(formData: FormData) {
    await authenticateAndRedirect();

    try {
        const ip = getClientIp(await headers());
        const { success } = await apiRateLimit.limit(ip);
        if (!success) return { error: "Rate limit exceeded" };

        const file = formData.get("file") as File;
        if (!file) {
            return { error: "No file provided" };
        }

        console.log("Processing upload:", { type: file.type, size: file.size, name: file.name });

        // Validation
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            return { error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF are allowed.` };
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            return { error: "File too large. Maximum size is 2MB." };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to base64 data URI for database storage
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        console.log("Logo encoded to base64, length:", dataUri.length);

        // Return the data URI to be stored in the database
        return { url: dataUri };
    } catch (error) {
        console.error("Error uploading logo:", error);
        return { error: "Failed to upload logo" };
    }
}
