"use client"

import { usePathname } from "next/navigation"
import { AIChatbot } from "./ai-chatbot"

type ChatbotWrapperProps = {
    name: string
    greeting: string
    position: "bottom-right" | "bottom-left"
    logo?: string | null
    primaryColor?: string
    secondaryColor?: string
    defaultLanguage: string
    displayMode: "all" | "selected"
    selectedPages: string[]
    shape: string
    rotation: number
    size: number
}

/**
 * Client wrapper that checks if chatbot should be displayed on current page
 */
export function AIChatbotWrapper({
    name,
    greeting,
    position,
    logo,
    primaryColor,
    secondaryColor,
    defaultLanguage,
    displayMode,
    selectedPages,
    shape,
    rotation,
    size,
}: ChatbotWrapperProps) {
    const pathname = usePathname()

    // Check if chatbot should be displayed on this page
    if (displayMode === "selected") {
        const shouldShow = selectedPages.includes(pathname)
        if (!shouldShow) {
            return null
        }
    }

    return (
        <AIChatbot
            name={name}
            greeting={greeting}
            position={position}
            logo={logo}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            defaultLanguage={defaultLanguage}
            shape={shape}
            rotation={rotation}
            size={size}
        />
    )
}
