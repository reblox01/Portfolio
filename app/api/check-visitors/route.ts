import { NextResponse } from "next/server"
import { getVisitorsForRange } from "@/actions/visitors.action"
import { auth } from "@clerk/nextjs/server"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"

export async function GET(req: any) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = getClientIp(req.headers);
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const visitors = await getVisitorsForRange(90)

    return NextResponse.json({
      success: true,
      count: visitors?.length || 0,
      firstDate: visitors && visitors.length > 0 ? visitors[0].date : null,
      lastDate: visitors && visitors.length > 0 ? visitors[visitors.length - 1].date : null,
      sample: visitors?.slice(0, 5) || [],
    })
  } catch (error) {
    console.error("Error checking visitors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check visitors" },
      { status: 500 }
    )
  }
}
