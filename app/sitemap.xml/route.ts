import { getAllProjectsAction } from '@/actions/project.actions'
import { NextResponse } from 'next/server'
import { siteConfig } from '@/site.config'

export async function GET() {
  try {
    const { projects } = await getAllProjectsAction()

    const rawBase = siteConfig.structuredData?.url || siteConfig.meta?.['og:url'] || process.env.SITE_URL || ''
    const baseUrl = rawBase.replace(/\/$/, '')

    const staticUrls = [
      '',
      'about',
      'projects',
      'experience',
      'education',
      'certification',
      'techstack',
      'contact',
    ]

    const urls = staticUrls.map((u) => (u === '' ? baseUrl : `${baseUrl}/${u}`))

    const projectUrls = (projects || []).map((p: any) => `${baseUrl}/projects/${p.id}`)

    const allUrls = [...urls, ...projectUrls]

    // Static pages use a fixed date (last significant site update).
    // Dynamic lastmod on every request misleads crawlers and wastes crawl budget.
    const staticLastmod = '2026-02-27'

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
      .map(
        (url) => {
          const isHome = url === baseUrl
          const isProjectPage = url.includes('/projects/') && url.split('/').length > 4
          const priority = isHome ? '1.0' : isProjectPage ? '0.6' : '0.8'
          const changefreq = isHome ? 'weekly' : isProjectPage ? 'monthly' : 'monthly'
          // Project pages use their own updatedAt from the DB; static pages use fixed date
          const project: any = isProjectPage
            ? (projects || []).find((p: any) => url.endsWith(p.id))
            : null
          const lastmod = project?.createdAt
            ? new Date(project.createdAt).toISOString().split('T')[0]
            : staticLastmod

          return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
        }
      )
      .join('\n')}\n</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (e) {
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}


