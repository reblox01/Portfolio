import { getAllProjectsAction } from '@/actions/project.actions'
import { NextResponse } from 'next/server'
import { siteConfig } from '@/site.config'

export async function GET() {
  try {
    const { projects } = await getAllProjectsAction()

    const rawBase = siteConfig.structuredData?.url || siteConfig.meta?.['og:url'] || process.env.SITE_URL
    const baseUrl = (rawBase || '').replace(/\/$/, '') || ''

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

    const urls = staticUrls.map((u) => `${baseUrl}/${u}`)

    const projectUrls = (projects || []).map((p: any) => `${baseUrl}/projects/${p.id}`)

    const allUrls = [...urls, ...projectUrls]

    const lastmod = new Date().toISOString()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
      .map(
        (url) => {
          // Homepage gets priority 1.0, main pages 0.8, project pages 0.6
          const isHome = url === baseUrl + '/'
          const isProjectPage = url.includes('/projects/') && url.split('/').length > 4
          const priority = isHome ? '1.0' : isProjectPage ? '0.6' : '0.8'

          return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
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


