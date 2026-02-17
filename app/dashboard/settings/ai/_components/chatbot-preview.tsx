"use client"

import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

// SVG Path definitions for premium smooth shapes (Discord-style)
// These use objectBoundingBox (0 to 1 scale)
const getClipPathId = (shape: string) => `mask-${shape}`

type ChatbotPreviewProps = {
    name: string
    greeting: string
    position: "bottom-right" | "bottom-left"
    logo?: string | null
    primaryColor: string
    secondaryColor: string
    shape?: string
    rotation?: number
    size?: number
}

export function ChatbotPreview({
    name,
    greeting,
    position,
    logo,
    primaryColor,
    secondaryColor,
    shape = "circle",
    rotation = 0,
    size = 56,
}: ChatbotPreviewProps) {
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        setIsOpen(false)
    }, [shape])

    const positionClasses = position === "bottom-right" ? "right-4" : "left-4"

    return (
        <div className="relative rounded-lg border bg-muted/30 p-4 h-[600px] overflow-hidden">
            {/* SVG Definitions for Masks */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="mask-circle" clipPathUnits="objectBoundingBox">
                        <circle cx="0.5" cy="0.5" r="0.5" />
                    </clipPath>
                    <clipPath id="mask-square" clipPathUnits="objectBoundingBox">
                        <rect x="0" y="0" width="1" height="1" rx="0" ry="0" />
                    </clipPath>
                    <clipPath id="mask-rounded" clipPathUnits="objectBoundingBox">
                        <rect x="0" y="0" width="1" height="1" rx="0.12" ry="0.12" />
                    </clipPath>
                    <clipPath id="mask-squircle" clipPathUnits="objectBoundingBox">
                        <path d="M0,0.5 C0,0 0,0 0.5,0 S1,0 1,0.5 S1,1 0.5,1 S0,1 0,0.5" />
                    </clipPath>
                    <clipPath id="mask-hexagon" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0 C0.56,0 0.62,0.05 0.66,0.08 L0.92,0.23 C0.97,0.26 1,0.31 1,0.37 L1,0.63 C1,0.69 0.97,0.74 0.92,0.77 L0.66,0.92 C0.62,0.95 0.56,0.98 0.5,0.98 C0.44,0.98 0.38,0.95 0.34,0.92 L0.08,0.77 C0.03,0.74 0,0.69 0,0.63 L0,0.37 C0,0.31 0.03,0.26 0.08,0.23 L0.34,0.08 C0.38,0.05 0.44,0.02 0.5,0.02 Z" />
                    </clipPath>
                    <clipPath id="mask-flower" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0 C0.6,0 0.68,0.1 0.77,0.12 C0.85,0.15 0.95,0.13 0.98,0.21 C1,0.3 0.92,0.38 0.92,0.5 C0.92,0.62 1,0.7 0.98,0.79 C0.95,0.87 0.85,0.85 0.77,0.88 C0.68,0.9 0.6,1 0.5,1 C0.4,1 0.32,0.9 0.23,0.88 C0.15,0.85 0.05,0.87 0.02,0.79 C0,0.7 0.08,0.62 0.08,0.5 C0.08,0.38 0,0.3 0.02,0.21 C0.05,0.13 0.15,0.15 0.23,0.12 C0.32,0.1 0.4,0 0.5,0 Z" />
                    </clipPath>
                    <clipPath id="mask-star" clipPathUnits="objectBoundingBox">
                        <path d="M 0.9710 0.4437 l -0.1882 0.1705 a 0.0540 0.0567 0 0 0 -0.0176 0.0605 l 0.0588 0.2484 c 0.0031 0.0120 0.0026 0.0246 -0.0014 0.0363 a 0.0582 0.0610 0 0 1 -0.0208 0.0291 0.0580 0.0609 0 0 1 -0.0660 0.0013 l -0.2117 -0.1335 a 0.0534 0.0560 0 0 0 -0.0588 0 l -0.2117 0.1335 c -0.0470 0.0247 -0.1000 -0.0124 -0.0882 -0.0667 l 0.0588 -0.2484 c 0.0059 -0.0247 0 -0.0494 -0.0176 -0.0605 L 0.0185 0.4437 a 0.0614 0.0644 0 0 1 -0.0153 -0.0666 a 0.0614 0.0644 0 0 1 0.0193 -0.0293 a 0.0612 0.0643 0 0 1 0.0312 -0.0140 l 0.2469 -0.0185 c 0.0235 -0.0062 0.0412 -0.0185 0.0470 -0.0358 l 0.1058 -0.2422 a 0.0573 0.0602 0 0 1 0.0211 -0.0270 a 0.0572 0.0600 0 0 1 0.0637 0 a 0.0573 0.0602 0 0 1 0.0211 0.0270 l 0.0941 0.2372 a 0.0513 0.0539 0 0 0 0.0180 0.0263 a 0.0512 0.0538 0 0 0 0.0291 0.0107 l 0.2469 0.0235 c 0.0517 0.0049 0.0753 0.0717 0.0235 0.1087 z" />
                    </clipPath>
                    <clipPath id="mask-triangle" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.05 C0.55,0.05 0.9,0.75 0.92,0.8 C0.94,0.85 1,1 0.9,1 L0.1,1 C0,1 0.06,0.85 0.08,0.8 C0.1,0.75 0.45,0.05 0.5,0.05 Z" />
                    </clipPath>
                    <clipPath id="mask-diamond" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.05 C0.55,0.05 0.95,0.45 0.95,0.5 C0.95,0.55 0.55,0.95 0.5,0.95 C0.45,0.95 0.05,0.55 0.05,0.5 C0.05,0.45 0.45,0.05 0.5,0.05 Z" />
                    </clipPath>
                    <clipPath id="mask-shield" clipPathUnits="objectBoundingBox">
                        <path d="M 0.9993 0.1914 c -0.1140 0 -0.2062 -0.0831 -0.2191 -0.1914 H 0.2191 a 0.2194 0.2085 0 0 0 -0.0702 0.1363 a 0.2196 0.2087 0 0 0 -0.1489 0.0551 v 0.0503 c 0 0.2455 0.1228 0.4749 0.3379 0.6372 L 0.5000 1.0000 l 0.1621 -0.1211 C 0.8772 0.7204 1.0000 0.4871 1.0000 0.2416 h -0.0007 V 0.1914 z" />
                    </clipPath>
                    <clipPath id="mask-shield-rounded" clipPathUnits="objectBoundingBox">
                        <path d="M0.1,0 L0.9,0 C0.95,0 1,0.05 1,0.1 L1,0.6 C1,0.8 0.8,0.95 0.5,1 C0.2,0.95 0,0.8 0,0.6 L0,0.1 C0,0.05 0.05,0 0.1,0 Z" />
                    </clipPath>
                    <clipPath id="mask-medal" clipPathUnits="objectBoundingBox">
                        <path d="M0.2,0 L0.8,0 C0.9,0 1,0.1 1,0.2 L1,0.7 C1,0.85 0.9,0.95 0.5,1 C0.1,0.95 0,0.85 0,0.7 L0,0.2 C0,0.1 0.1,0 0.2,0 Z" />
                    </clipPath>
                    <clipPath id="mask-pentagon" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.02 C0.55,0.02 0.95,0.35 0.95,0.4 L0.85,0.9 C0.83,0.95 0.78,1 0.73,1 L0.27,1 C0.22,1 0.17,0.95 0.15,0.9 L0.05,0.4 C0.05,0.35 0.45,0.02 0.5,0.02 Z" />
                    </clipPath>
                    <clipPath id="mask-message" clipPathUnits="objectBoundingBox">
                        <path d="M0.1,0 L0.9,0 C0.95,0 1,0.05 1,0.1 V0.6 C1,0.65 0.95,0.7 0.9,0.7 H0.7 L0.7,0.95 C0.7,0.98 0.65,1 0.62,0.98 L0.4,0.7 H0.1 C0.05,0.7 0,0.65 0,0.6 V0.1 C0,0.05 0.05,0 0.1,0 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Preview Label */}
            <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded z-10">
                Live Preview
            </div>

            {/* Simulated Page Background */}
            <div
                className="h-full w-full bg-gradient-to-br from-background to-muted/50 rounded-md relative cursor-pointer"
                onClick={() => setIsOpen(false)}
            >
                {/* Mock page content */}
                <div className="p-6 space-y-3 opacity-40 select-none pointer-events-none">
                    <div className="h-8 w-48 bg-foreground/20 rounded" />
                    <div className="h-4 w-full bg-foreground/10 rounded" />
                    <div className="h-4 w-3/4 bg-foreground/10 rounded" />
                    <div className="h-4 w-5/6 bg-foreground/10 rounded" />
                </div>

                {/* Chatbot Widget Bubble - Open State */}
                {isOpen && (
                    <div
                        className={cn(
                            "absolute bottom-4 z-50 flex h-[450px] w-[340px] flex-col rounded-2xl border shadow-2xl transition-all overflow-hidden bg-background animate-in slide-in-from-bottom-5 fade-in duration-300",
                            positionClasses
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 py-3 text-white"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <div className="flex items-center gap-3">
                                {logo ? (
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={logo} alt={name} className="object-cover" />
                                        <AvatarFallback style={{ backgroundColor: secondaryColor }}>
                                            {name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                )}
                                <div>
                                    <span className="font-semibold block leading-tight text-sm">{name}</span>
                                    <span className="text-[10px] opacity-80 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1.5 transition-colors hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Body... (identical to before) */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-muted/30" style={{ backgroundColor: secondaryColor }}>
                            <div className="flex justify-start w-full">
                                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-border px-4 py-2.5 text-sm text-black shadow-sm prose prose-sm prose-p:leading-relaxed">
                                    <ReactMarkdown>{greeting}</ReactMarkdown>
                                </div>
                            </div>
                            <div className="flex justify-end w-full">
                                <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white shadow-sm prose prose-sm prose-invert" style={{ backgroundColor: primaryColor }}>
                                    <ReactMarkdown>Hello! Can you help me?</ReactMarkdown>
                                </div>
                            </div>
                            <div className="flex justify-start w-full">
                                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-border px-4 py-2.5 text-sm text-black shadow-sm prose prose-sm prose-p:leading-relaxed">
                                    <ReactMarkdown>Of course! I'd be happy to help you. What would you like to know?</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Input Area... (identical to before) */}
                        <div className="p-3 bg-background border-t border-border/50">
                            <div className="flex gap-2 items-end bg-muted/30 p-1.5 rounded-3xl border border-border/50">
                                <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent px-4 py-2.5 text-sm focus:outline-none placeholder:text-muted-foreground/70 min-h-[44px]" disabled />
                                <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-opacity" style={{ backgroundColor: primaryColor }} disabled>
                                    <Send className="h-4 w-4 ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Chat Bubble (Closed State) */}
                {!isOpen && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(true)
                        }}
                        className={cn(
                            "absolute bottom-4 z-50 flex items-center justify-center transition-all hover:scale-110 cursor-pointer animate-in zoom-in duration-300 border-none outline-none ring-0",
                            positionClasses
                        )}
                        style={{
                            backgroundColor: primaryColor,
                            clipPath: `url(#${getClipPathId(shape)})`,
                            transform: `rotate(${rotation}deg)`,
                            width: `${size}px`,
                            height: `${size}px`
                        }}
                    >
                        {logo ? (
                            <img
                                src={logo}
                                alt={name}
                                className="h-full w-full object-cover"
                                style={{ clipPath: `url(#${getClipPathId(shape)})` }}
                            />
                        ) : (
                            <MessageCircle className="h-6 w-6 text-white" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
