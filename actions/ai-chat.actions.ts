"use server";

import prisma from "@/db";
import { aiChatRateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { safeDecryptApiKey } from "@/lib/encryption";
import { z } from "zod";
import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";

// Validation schemas (OWASP compliance)
const chatMessageSchema = z.object({
    message: z.string().min(1).max(1000).trim(),
    sessionId: z.string().uuid(),
    language: z.string().length(2).optional().default("en"),
});

/**
 * Send chat message to AI and get response
 */
export async function sendChatMessageAction(data: z.infer<typeof chatMessageSchema>) {
    const ip = getClientIp(await headers());
    const { success } = await aiChatRateLimit.limit(ip);
    if (!success) {
        return { error: "Rate limit exceeded. Please wait a moment before sending another message." };
    }

    // Validate input  
    const validated = chatMessageSchema.parse(data);

    try {
        const settings = await prisma.aISettings.findFirst();

        if (!settings || !settings.enabled) {
            return { error: "AI chatbot is currently disabled" };
        }

        // Get the appropriate API key based on provider
        let apiKey: string | null = null;
        switch (settings.provider) {
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
            return { error: "AI provider not configured" };
        }

        // Get system instruction
        const systemInstruction = await getSystemInstruction(settings);

        // Call the appropriate AI provider
        let response;
        try {
            response = await callAIProvider(
                settings.provider,
                settings.selectedModel,
                apiKey,
                validated.message,
                systemInstruction,
                validated.language
            );
        } catch (error) {
            console.error("Error calling AI provider:", error);
            return { error: "Failed to get AI response" };
        }

        // Save conversation if enabled
        if (settings.saveConversations) {
            await saveChatConversationAction({
                sessionId: validated.sessionId,
                messages: [
                    { role: 'user', content: validated.message, timestamp: new Date().toISOString(), language: validated.language },
                    { role: 'assistant', content: response, timestamp: new Date().toISOString(), language: validated.language },
                ],
                language: validated.language,
            });
        }

        return { response };
    } catch (error) {
        console.error("Error in chat message action:", error);
        if (error instanceof z.ZodError) {
            return { error: "Invalid message format" };
        }
        return { error: "An error occurred while processing your message" };
    }
}

/**
 * Get system instruction for AI
 */
async function getSystemInstruction(settings: any): Promise<string> {
    if (settings.useCustomInstruction && settings.customInstruction) {
        return settings.customInstruction;
    }

    // Generate default instruction from site data
    try {
        const admin = await prisma.admin.findFirst();

        let instruction = `You are a friendly AI assistant for a professional portfolio website. `;
        instruction += `Help visitors learn about the site owner's skills, experience, projects, and how to contact them. `;
        instruction += `Be helpful, concise, and professional.\n\n`;

        if (admin) {
            instruction += `Portfolio Owner Information:\n`;
            instruction += `- Name: ${admin.name}\n`;
            instruction += `- Position: ${admin.position}\n`;
            instruction += `- Location: ${admin.location}\n`;
            instruction += `- Introduction: ${admin.introduction}\n`;
            instruction += `- Education Background: ${admin.education}\n`;

            if (admin.skills && Array.isArray(admin.skills)) {
                instruction += `- Skills: ${admin.skills.join(", ")}\n`;
            }

            if (admin.email) {
                instruction += `- Contact Email: ${admin.email}\n`;
            }
        }

        return instruction;
    } catch (error) {
        console.error("Error generating system instruction:", error);
        return "You are a helpful AI assistant for a portfolio website.";
    }
}

/**
 * Call AI provider API
 */
async function callAIProvider(
    provider: string,
    model: string,
    apiKey: string,
    message: string,
    systemInstruction: string,
    language: string
): Promise<string> {

    const languagePrompt = language !== 'en'
        ? `\n\nIMPORTANT: Please respond in the language code: ${language}`
        : '';

    switch (provider) {
        case "openai":
            return await callOpenAI(apiKey, model, message, systemInstruction + languagePrompt);
        case "gemini":
            return await callGemini(apiKey, model, message, systemInstruction + languagePrompt);
        case "anthropic":
            return await callAnthropic(apiKey, model, message, systemInstruction + languagePrompt);
        case "perplexity":
            return await callPerplexity(apiKey, model, message, systemInstruction + languagePrompt);
        default:
            throw new Error("Unsupported AI provider");
    }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(apiKey: string, model: string, message: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
}

/**
 * Call Google Gemini API
 */
async function callGemini(apiKey: string, model: string, message: string, systemInstruction: string): Promise<string> {
    // Use v1beta for better compatibility with newer models like 1.5-pro/flash
    console.log(`Calling Gemini API with model: ${model}`);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }]
            }],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${response.status}):`, errorText);

        if (response.status === 404) {
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (listResponse.ok) {
                const listData = await listResponse.json();
                console.log("AVAILABLE MODELS ON 404:", JSON.stringify(listData, null, 2));
            }
        }

        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(apiKey: string, model: string, message: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 500,
            system: systemInstruction,
            messages: [
                { role: 'user', content: message },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
}

/**
 * Call Perplexity AI API
 */
async function callPerplexity(apiKey: string, model: string, message: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
}

/**
 * Save chat conversation
 */
export async function saveChatConversationAction(data: {
    sessionId: string;
    messages: any[];
    language: string;
}) {
    try {
        const existing = await prisma.chatConversation.findFirst({
            where: { sessionId: data.sessionId },
        });

        if (existing) {
            // Append new messages to existing conversation
            const updatedMessages = [...(existing.messages as any[]), ...data.messages];

            await prisma.chatConversation.update({
                where: { id: existing.id },
                data: {
                    messages: updatedMessages,
                    visitorLang: data.language,
                },
            });
        } else {
            // Create new conversation
            await prisma.chatConversation.create({
                data: {
                    sessionId: data.sessionId,
                    visitorLang: data.language,
                    messages: data.messages,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving conversation:", error);
        return { error: "Failed to save conversation" };
    }
}

/**
 * Get chat history (admin only)
 */
export async function getChatHistoryAction(filters?: {
    sessionId?: string;
    startDate?: Date;
    endDate?: Date;
}) {
    const { userId } = await auth();
    if (!userId) redirect('/');

    try {
        const where: any = {};

        if (filters?.sessionId) {
            where.sessionId = filters.sessionId;
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = filters.startDate;
            if (filters.endDate) where.createdAt.lte = filters.endDate;
        }

        const conversations = await prisma.chatConversation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to 100 most recent
        });

        return { conversations };
    } catch (error) {
        console.error("Error getting chat history:", error);
        return { error: "Failed to get chat history" };
    }
}

/**
 * Delete conversation (admin only)
 */
export async function deleteConversationAction(conversationId: string) {
    const { userId } = await auth();
    if (!userId) redirect('/');

    try {
        await prisma.chatConversation.delete({
            where: { id: conversationId },
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return { error: "Failed to delete conversation" };
    }
}

/**
 * Export conversations to JSON (admin only)
 */
export async function exportConversationsAction(filters?: {
    startDate?: Date;
    endDate?: Date;
}) {
    const { userId } = await auth();
    if (!userId) redirect('/');

    try {
        const where: any = {};

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) where.createdAt.gte = filters.startDate;
            if (filters.endDate) where.createdAt.lte = filters.endDate;
        }

        const conversations = await prisma.chatConversation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return { conversations };
    } catch (error) {
        console.error("Error exporting conversations:", error);
        return { error: "Failed to export conversations" };
    }
}
