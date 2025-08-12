"use server"
import prisma from "@/db"

export async function seedVisitors(days = 90) {
  const now = new Date()
  const records = [] as { date: Date; desktop: number; mobile: number; total: number }[]

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const desktop = Math.floor(Math.random() * 500)
    const mobile = Math.floor(Math.random() * 500)
    records.push({ date: d, desktop, mobile, total: desktop + mobile })
  }

  for (const r of records) {
    try {
      await prisma.visitor.upsert({
        where: { date: r.date },
        update: { desktop: r.desktop, mobile: r.mobile, total: r.total },
        create: { date: r.date, desktop: r.desktop, mobile: r.mobile, total: r.total },
      })
    } catch (err) {
      console.error('seed error', err)
    }
  }

  return { inserted: records.length }
}


