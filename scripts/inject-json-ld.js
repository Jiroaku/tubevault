import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://youtube.museum'

function generateJsonLdScript() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const usersPath = path.join(projectRoot, 'public', 'users.json')
  const videosPath = path.join(projectRoot, 'public', 'videos.json')
  
  let jsonLdScripts = []
  
  // Users JSON-LD
  if (fs.existsSync(usersPath)) {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
    
    const itemListElement = []
    users.forEach((user, originalIndex) => {
      if (user.channel_id) {
        itemListElement.push({
          "@type": "Person",
          "@id": `${SITE_URL}/users#${originalIndex + 1}`,
          "name": user.username,
          "identifier": user.username,
          "url": `https://www.youtube.com/channel/${user.channel_id}`
        })
      }
    })
    
    const usersJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage", 
      "name": "Oldest YouTube Users",
      "description": "Archive of the oldest YouTube users from 2005",
      "url": `${SITE_URL}/users`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": itemListElement.length,
        "itemListElement": itemListElement
      }
    }
    
    jsonLdScripts.push(`    <!-- Users Collection JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(usersJsonLd, null, 6)}
    </script>`)
  }
  
  // Videos JSON-LD
  if (fs.existsSync(videosPath)) {
    const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'))
    
    const itemListElement = []
    videos.forEach((video, originalIndex) => {
      if (video.title && video.title.trim() !== '') {
        itemListElement.push({
          "@type": "VideoObject",
          "@id": `${SITE_URL}/videos#${originalIndex + 1}`,
          "name": video.title,
          "identifier": video.video_id,
          "url": `https://www.youtube.com/watch?v=${video.video_id}`,
          "uploadDate": video.timestamp ? new Date(parseInt(video.timestamp) * 1000).toISOString().split('T')[0] : undefined,
          "creator": video.username ? {
            "@type": "Person",
            "name": video.username
          } : undefined
        })
      }
    })
    
    const videosJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Oldest YouTube Videos", 
      "description": "Archive of the oldest YouTube videos from 2005",
      "url": `${SITE_URL}/videos`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": itemListElement.length,
        "itemListElement": itemListElement
      }
    }
    
    jsonLdScripts.push(`    <!-- Videos Collection JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(videosJsonLd, null, 6)}
    </script>`)
  }
  
  return jsonLdScripts.join('\n\n')
}

function injectJsonLd() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const distIndexPath = path.join(projectRoot, 'dist', 'index.html')
  
  if (!fs.existsSync(distIndexPath)) {
    console.log('❌ dist/index.html not found. Run build first.')
    return
  }
  
  let html = fs.readFileSync(distIndexPath, 'utf8')
  const jsonLdScripts = generateJsonLdScript()
  
  // Find the closing </head> tag and inject before it
  const headCloseIndex = html.lastIndexOf('</head>')
  if (headCloseIndex !== -1) {
    html = html.slice(0, headCloseIndex) + 
           '\n' + jsonLdScripts + '\n  ' +
           html.slice(headCloseIndex)
           
    fs.writeFileSync(distIndexPath, html, 'utf8')
    console.log('✅ JSON-LD injected into dist/index.html')
  } else {
    console.log('❌ Could not find </head> tag in dist/index.html')
  }
}

// Run if called directly
injectJsonLd()

export { injectJsonLd }