import { NextResponse } from "next/server"
import prisma from "@/db"

export async function POST() {
  try {
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

export async function GET() {
  return POST()
}
