"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if screen size is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typically tablet/mobile breakpoint
    }

    // Check on mount
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}
