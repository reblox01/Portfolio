"use server"
import prisma from "@/db"

export async function getHourlyVisitorsLast24Hours() {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const hourlyVisitors = await prisma.hourlyVisitor.findMany({
    where: {
      datetime: {
        gte: twentyFourHoursAgo,
        lte: now,
      },
    },
    orderBy: { datetime: 'asc' },
  })

  // Fill in missing hours with zeros
  const result = []
  for (let i = 0; i < 24; i++) {
    const hourTime = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
    hourTime.setMinutes(0, 0, 0)

    const existing = hourlyVisitors.find(
      (v: any) => v.datetime.getTime() === hourTime.getTime()
    )

    if (existing) {
      result.push({
        datetime: hourTime.toISOString(),
        hour: existing.hour,
        desktop: existing.desktop,
        mobile: existing.mobile,
        total: existing.total,
      })
    } else {
      result.push({
        datetime: hourTime.toISOString(),
        hour: hourTime.getUTCHours(),
        desktop: 0,
        mobile: 0,
        total: 0,
      })
    }
  }

  return result
}
