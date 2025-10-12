"use client"

import { useEffect } from "react"

export function VisitorTracker() {
  useEffect(() => {
    // Only track once per session
    const hasTracked = sessionStorage.getItem("visitor_tracked")
    
    console.log("[VisitorTracker] Checking if tracked:", hasTracked ? "Yes" : "No")
    
    if (!hasTracked) {
      console.log("[VisitorTracker] Tracking visit...")
      fetch("/api/track-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("[VisitorTracker] Visit tracked successfully:", data)
          sessionStorage.setItem("visitor_tracked", "true")
        })
        .catch((error) => {
          console.error("[VisitorTracker] Failed to track visit:", error)
        })
    } else {
      console.log("[VisitorTracker] Already tracked in this session")
    }
  }, [])

  return null
}
