import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://tubevault.org'

// Generate static JSON-LD for users page
function generateUsersJsonLd() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const usersPath = path.join(projectRoot, 'public', 'users.json')
  
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
  
  const itemListElement = users.slice(0, 100).map((user, index) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/users#${index + 1}`,
    "name": user.username,
    "identifier": user.username,
    "url": user.channel_id ? `https://www.youtube.com/channel/${user.channel_id}` : undefined
  })).filter(item => item.url) // Only include users with channel_id
  
  return {
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
}

// Generate static JSON-LD for videos page  
function generateVideosJsonLd() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  const videosPath = path.join(projectRoot, 'public', 'videos.json')
  
  if (!fs.existsSync(videosPath)) {
    console.log('❌ videos.json not found, skipping videos JSON-LD')
    return null
  }
  
  const videos = JSON.parse(fs.readFileSync(videosPath, 'utf8'))
  
  const itemListElement = videos.slice(0, 100).map((video, index) => ({
    "@type": "VideoObject", 
    "@id": `${SITE_URL}/videos#${index + 1}`,
    "name": video.title || "Unknown Video",
    "identifier": video.video_id,
    "url": `https://www.youtube.com/watch?v=${video.video_id}`,
    "uploadDate": video.timestamp ? new Date(parseInt(video.timestamp) * 1000).toISOString().split('T')[0] : undefined,
    "creator": video.username ? {
      "@type": "Person",
      "name": video.username
    } : undefined
  }))
  
  return {
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
}

function writeJsonLdFiles() {
  const scriptDir = path.dirname(import.meta.url.replace('file:///', ''))
  const projectRoot = path.dirname(scriptDir)
  
  // Generate users JSON-LD
  const usersJsonLd = generateUsersJsonLd()
  const usersJsonLdPath = path.join(projectRoot, 'public', 'users-jsonld.json')
  fs.writeFileSync(usersJsonLdPath, JSON.stringify(usersJsonLd, null, 2), 'utf8')
  console.log(`✅ Users JSON-LD generated at ${usersJsonLdPath}`)
  
  // Generate videos JSON-LD
  const videosJsonLd = generateVideosJsonLd()
  if (videosJsonLd) {
    const videosJsonLdPath = path.join(projectRoot, 'public', 'videos-jsonld.json')
    fs.writeFileSync(videosJsonLdPath, JSON.stringify(videosJsonLd, null, 2), 'utf8')
    console.log(`✅ Videos JSON-LD generated at ${videosJsonLdPath}`)
  }
}

// Run if called directly
writeJsonLdFiles()

export { generateUsersJsonLd, generateVideosJsonLd, writeJsonLdFiles }