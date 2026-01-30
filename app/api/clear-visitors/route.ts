import { NextResponse } from "next/server"
import prisma from "@/db"
import { auth } from "@clerk/nextjs/server"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: any) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = getClientIp(req.headers);
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const result = await prisma.visitor.deleteMany({})

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} visitor records`,
      deleted: result.count
    })
  } catch (error) {
    console.error("Error clearing visitors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to clear visitors" },
      { status: 500 }
    )
  }
}
