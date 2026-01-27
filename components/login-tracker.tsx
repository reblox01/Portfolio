"use client"

import { useEffect, useRef } from "react"
import { recordLoginAction } from "@/actions/security.actions"
import { useUser } from "@clerk/nextjs"

export function LoginTracker() {
    const { isSignedIn, isLoaded } = useUser()
    const effectRan = useRef(false)

    useEffect(() => {
        if (!isLoaded) return

        if (!isSignedIn) {
            // Reset recording flag on logout so next login is recorded
            sessionStorage.removeItem("login_event_recorded")
            return
        }

        // Prevent double-firing in strict mode
        if (effectRan.current) return;

        // Check if we already recorded this session
        const hasRecorded = sessionStorage.getItem("login_event_recorded")

        if (!hasRecorded) {
            effectRan.current = true;
            console.log("Recording login event...")
            recordLoginAction().then(() => {
                sessionStorage.setItem("login_event_recorded", "true")
                console.log("Login event recorded success")
            })
        }
    }, [isLoaded, isSignedIn])

    return null
}
