import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://youtube.museum'

// Static routes with their priorities and change frequencies
const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/users', priority: '0.9', changefreq: 'daily' },
  { url: '/videos', priority: '0.9', changefreq: 'daily' }
]

// Function to scan for HTML files in /t/ directory
function scanHtmlFiles() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const tDir = path.join(projectRoot, 'public', 't')
  const routes = []
  
  if (fs.existsSync(tDir)) {
    const files = fs.readdirSync(tDir)
    files.forEach(file => {
      if (file.endsWith('.html')) {
        routes.push({
          url: `/t/${file}`,
          priority: '0.6',
          changefreq: 'monthly'
        })
      }
    })
  }
  
  return routes
}

// Generate sitemap XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0]
  const allRoutes = [...staticRoutes, ...scanHtmlFiles()]
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  allRoutes.forEach(route => {
    xml += '  <url>\n'
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`
    xml += `    <lastmod>${currentDate}</lastmod>\n`
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`
    xml += `    <priority>${route.priority}</priority>\n`
    xml += '  </url>\n'
  })
  
  xml += '</urlset>'
  return xml
}

// Write sitemap to public directory
function writeSitemap() {
  const sitemap = generateSitemap()
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml')
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8')
  console.log(`✅ Sitemap generated at ${sitemapPath}`)
  console.log(`📄 Generated ${staticRoutes.length + scanHtmlFiles().length} URLs`)
}

// Run if called directly
writeSitemap()

export { generateSitemap, writeSitemap }