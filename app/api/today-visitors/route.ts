import { NextResponse } from "next/server"
import prisma from "@/db"

export async function GET() {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    
    const visitor = await prisma.visitor.findUnique({
      where: { date: today }
    })
    
    if (!visitor) {
      return NextResponse.json({ 
        success: true,
        message: "No visitors today yet",
        visitor: null
      })
    }
    
    return NextResponse.json({ 
      success: true,
      visitor: {
        date: visitor.date,
        desktop: visitor.desktop,
        mobile: visitor.mobile,
        total: visitor.total
      }
    })
  } catch (error) {
    console.error("Error getting today's visitors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get today's visitors" }, 
      { status: 500 }
    )
  }
}
