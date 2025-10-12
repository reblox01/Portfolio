import { NextResponse } from "next/server"
import { seedVisitors } from "@/actions/visitors.seed"

export async function POST() {
  try {
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

export async function GET() {
  return POST()
}
