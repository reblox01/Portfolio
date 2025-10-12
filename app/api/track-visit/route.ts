import { NextRequest, NextResponse } from "next/server"
import prisma from "@/db"

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || ""
    
    // Detect if mobile or desktop
    const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    
    // Get today's date at midnight UTC
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    
    // Get current hour
    const now = new Date()
    const currentHour = new Date()
    currentHour.setUTCMinutes(0, 0, 0)
    const hourOfDay = now.getUTCHours()
    
    // Update or create daily visitor record
    const visitor = await prisma.visitor.upsert({
      where: { date: today },
      update: {
        desktop: isMobile ? undefined : { increment: 1 },
        mobile: isMobile ? { increment: 1 } : undefined,
        total: { increment: 1 },
      },
      create: {
        date: today,
        desktop: isMobile ? 0 : 1,
        mobile: isMobile ? 1 : 0,
        total: 1,
      },
    })
    
    // Update or create hourly visitor record
    const hourlyVisitor = await prisma.hourlyVisitor.upsert({
      where: { datetime: currentHour },
      update: {
        desktop: isMobile ? undefined : { increment: 1 },
        mobile: isMobile ? { increment: 1 } : undefined,
        total: { increment: 1 },
      },
      create: {
        datetime: currentHour,
        hour: hourOfDay,
        desktop: isMobile ? 0 : 1,
        mobile: isMobile ? 1 : 0,
        total: 1,
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      visitor,
      hourlyVisitor
    })
  } catch (error) {
    console.error("Error tracking visit:", error)
    return NextResponse.json({ success: false, error: "Failed to track visit" }, { status: 500 })
  }
}
