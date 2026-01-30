import { NextResponse } from "next/server"
import prisma from "@/db"
import { auth } from "@clerk/nextjs/server"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"

export async function GET(req: any) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = getClientIp(req.headers);
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

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
