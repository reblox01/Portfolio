import { getPublicAIConfigAction } from "@/actions/ai-settings.actions"
import { AIChatbotWrapper } from "./ai-chatbot-wrapper"

/**
 * Chatbot provider that conditionally renders the chatbot based on settings
 */
export async function AIChatbotProvider() {
    const config = await getPublicAIConfigAction()

    // Don't render if chatbot is disabled
    if (!config.enabled) {
        return null
    }

    return (
        <AIChatbotWrapper
            name={config.chatbotName || "AI Assistant"}
            greeting={config.chatbotGreeting || "Hi! How can I help you?"}
            position={config.chatbotPosition as "bottom-right" | "bottom-left"}
            logo={config.chatbotLogo}
            primaryColor={config.primaryColor}
            secondaryColor={config.secondaryColor}
            defaultLanguage={config.defaultLanguage || "en"}
            displayMode={config.displayMode as "all" | "selected"}
            selectedPages={config.selectedPages || []}
            shape={config.chatbotShape || "circle"}
            rotation={config.chatbotIconRotation || 0}
            size={config.chatbotIconSize || 56}
        />
    )
}
