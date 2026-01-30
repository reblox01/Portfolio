import { NextResponse } from "next/server"
import { seedVisitors } from "@/actions/visitors.seed"
import { auth } from "@clerk/nextjs/server"
import { apiRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: any) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = getClientIp(req.headers);
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const result = await seedVisitors(90)
    return NextResponse.json({
      success: true,
      message: `Seeded ${result.inserted} visitor records`,
      inserted: result.inserted
    })
  } catch (error) {
    console.error("Error seeding visitors:", error)
    return NextResponse.json(
      { success: false, error: "Failed to seed visitors" },
      { status: 500 }
    )
  }
}
