"use server"
import prisma from "@/db"

export async function getVisitorsForRange(days = 90) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  const visitors = await prisma.visitor.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: 'asc' },
  })

  // If no visitors at all, return empty array
  if (visitors.length === 0) {
    return []
  }

  // If no visitors at all, return empty array
  if (visitors.length === 0) {
    return []
  }

  // Ensure we have a contiguous set of dates by filling missing days with zeros
  const dayMap = new Map(visitors.map((v) => [v.date.toISOString().slice(0, 10), v]))
  const result = [] as { date: string; desktop: number; mobile: number; total: number }[]
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    const v = dayMap.get(key)
    if (v) {
      result.push({ date: key, desktop: v.desktop, mobile: v.mobile, total: v.total })
    } else {
      result.push({ date: key, desktop: 0, mobile: 0, total: 0 })
    }
  }

  return result
}


