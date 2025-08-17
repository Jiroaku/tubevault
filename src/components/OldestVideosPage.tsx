import { createSignal, For, Show, createResource } from 'solid-js'
import '../styles/tubevault.css'

interface Video {
  video_id: string
  video?: string
  status: number
  date_fallback?: string
  timestamp?: string
  title: string
  username: string
  length?: number
  description: string
  archive?: string
  thumbnail?: string
  old_video_id?: string
  originalIndex?: number
}

const fetchVideos = async (): Promise<Video[]> => {
  const response = await fetch('/videos.json')
  return response.json()
}

const fetchUsers = async () => {
  const response = await fetch('/users.json')
  return response.json()
}

function OldestVideosPage() {
  const [selectedVideo, setSelectedVideo] = createSignal<Video | null>(null)
  const [showRankings, setShowRankings] = createSignal(true)
  const [showUnknownVideos, setShowUnknownVideos] = createSignal(false)
  
  const formatDate = (video: Video) => {
    if (video.timestamp) {
      const date = new Date(parseInt(video.timestamp) * 1000)
      const dateStr = date.toLocaleDateString('en-CA', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const timeStr = date.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      return `${dateStr} ${timeStr}`
    }
    return video.date_fallback || '???'
  }

  const formatDateTime = (video: Video) => {
    if (video.timestamp) {
      const date = new Date(parseInt(video.timestamp) * 1000)
      const dateStr = date.toLocaleDateString('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const timeStr = date.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      return `${dateStr}, ${timeStr}`
    }
    return video.date_fallback || '???'
  }

  const formatLength = (length?: number) => {
    if (!length) return 'Unknown'
    const minutes = Math.floor(length / 60)
    const seconds = length % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getStatusText = (status: number, video?: Video) => {
    switch (status) {
      case 0: return 'Unknown'
      case 1: return video?.video ? 'Deleted (Recovered)' : 'Deleted'
      case 2: return 'Suspended'
      case 3: return 'Private'
      case 4: return 'Striked'
      case 5: return 'Public'
      default: return 'Unknown'
    }
  }

  const getStatusClass = (status: number, video?: Video) => {
    switch (status) {
      case 1: return video?.video ? 'recovered' : 'deleted'
      case 2: return 'terminated'
      case 3: return 'private'
      case 4: return 'striked'
      case 5: return 'public'
      default: return 'unknown'
    }
  }

  const getThumbnailUrl = (video: Video) => {
    if (video.thumbnail) {
      return video.thumbnail
    }
    return `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`
  }

  const [videos] = createResource(fetchVideos)
  const [users] = createResource(fetchUsers)
  
  const getUserRanking = (username: string) => {
    const usersList = users()
    if (!usersList) return null
    const userIndex = usersList.findIndex((u: any) => u.username.toLowerCase() === username.toLowerCase())
    return userIndex !== -1 ? userIndex + 1 : null
  }
  
  const oldestVideos = () => {
    const allVideos = videos() || []
    // Add original index to each video for consistent ranking
    const videosWithIndex = allVideos.map((video, index) => ({
      ...video,
      originalIndex: index + 1
    }))
    
    if (!showUnknownVideos()) {
      return videosWithIndex.filter(video => video.title && video.title.trim() !== '')
    }
    return videosWithIndex
  }

  const openVideoModal = (video: Video, ranking: number) => {
    setSelectedVideo(video)
    window.location.hash = ranking.toString()
  }

  const closeModal = () => {
    setSelectedVideo(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return (
    <div id="channel-base-div">
      <div id="channel-body">
        <div class="page-container">
          <div class="page-content">
            <div class="outer-box">
              <div class="inner-box">
                <div class="box-header">
                  <div class="box-title">Oldest Videos (100)</div>
                  <div style="display: flex; gap: 8px;">
                    <button
                      onClick={() => setShowRankings(!showRankings())}
                      class="toggle-button"
                      title={showRankings() ? 'Hide rankings' : 'Show rankings'}
                    >
                      {showRankings() ? 
                        <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z"/>
                        </svg>
                        : 
                        <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z"/>
                          <line x1="100" y1="-860" x2="860" y2="-100" stroke="currentColor" stroke-width="60"/>
                        </svg>
                      }
                    </button>
                    <button
                      onClick={() => setShowUnknownVideos(!showUnknownVideos())}
                      class="toggle-button"
                      title={showUnknownVideos() ? 'Hide videos with unknown titles' : 'Show all videos (filter is active)'}
                    >
                      {showUnknownVideos() ? 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                        : 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
                        </svg>
                      }
                    </button>
                  </div>
                </div>
                <div class="clear"></div>
                <div class="video-grid-container">
                  <For each={oldestVideos()}>
                    {(video, index) => (
                      <div class="video-grid-item">
                        <div 
                          class="video-thumbnail-container"
                          onClick={() => openVideoModal(video, video.originalIndex || index() + 1)}
                        >
                          <Show when={showRankings()}>
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              'background-color': 'rgba(255, 255, 255, 0.9)',
                              color: '#333',
                              'font-size': '10px',
                              'font-weight': 'bold',
                              width: '18px',
                              height: '15px',
                              display: 'flex',
                              'align-items': 'center',
                              'justify-content': 'center',
                              'border-radius': '2px',
                              'font-family': 'Arial, sans-serif',
                              'box-shadow': '0 1px 3px rgba(0,0,0,0.2)',
                              'z-index': '1'
                            }}>
                              #{video.originalIndex || index() + 1}
                            </div>
                          </Show>
                          <img 
                            src={getThumbnailUrl(video)} 
                            alt={video.title}
                            class="video-thumbnail"
                            referrerpolicy="no-referrer"
                          />
                          {video.status !== 5 && (
                            <div class={`video-status-overlay video-status-${getStatusClass(video.status, video)}`}>
                              {getStatusText(video.status, video)}
                            </div>
                          )}
                          {video.length && (
                            <div class="video-duration">
                              {formatLength(video.length)}
                            </div>
                          )}
                        </div>
                        <div class="video-info">
                          <h3 
                            class="video-title"
                            onClick={() => openVideoModal(video, video.originalIndex || index() + 1)}
                          >
                            {video.title || 'Unknown Video'}
                          </h3>
                          <div class="video-meta">
                            {(() => {
                              const username = video.username
                              const date = formatDate(video)
                              
                              if (!username && date === '???') {
                                return ''
                              }
                              
                              if (!username) {
                                return date
                              }
                              
                              if (date === '???') {
                                return username
                              }
                              
                              return (
                                <>
                                  <span class="video-username">{username}</span>
                                  <span class="video-separator">•</span>
                                  <span class="video-date">{date}</span>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      <Show when={selectedVideo()}>
        <div class="modal-overlay" onClick={closeModal}>
          <div 
            class="outer-box modal-content video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="inner-box">
              <div class="modal-header">
                <div class="box-title">Video Details</div>
                <button 
                  onClick={closeModal}
                  class="modal-close-button"
                >
                  ✕
                </button>
              </div>
              
              <div class="video-modal-content">
                <div class="video-player-section">
                  <Show when={selectedVideo()!.video} fallback={
                    <div class="video-thumbnail-large">
                      <img 
                        src={getThumbnailUrl(selectedVideo()!)} 
                        alt={selectedVideo()!.title}
                        referrerpolicy="no-referrer"
                      />
                      {selectedVideo()!.status !== 5 && (
                        <div class={`video-status-overlay video-status-${getStatusClass(selectedVideo()!.status, selectedVideo()!)}`}>
                          {getStatusText(selectedVideo()!.status, selectedVideo()!)}
                        </div>
                      )}
                    </div>
                  }>
                    <video 
                      controls 
                      class="video-player"
                      preload="metadata"
                    >
                      <source src={selectedVideo()!.video!} type="video/webm" />
                      <source src={selectedVideo()!.video!} type="video/mp4" />
                      <source src={selectedVideo()!.video!} type="video/x-matroska" />
                      Your browser does not support the video tag.
                    </video>
                  </Show>
                </div>
                
                <div class="video-details">
                  <h2 class="video-modal-title">
                    {selectedVideo()!.title}
                    <Show when={selectedVideo()!.archive}>
                      <a 
                        href={selectedVideo()!.archive!}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="archive-icon"
                        title="View archived version"
                      >
                        <svg width="8" height="8" viewBox="0 0 196.234 196.234" fill="currentColor">
                          <path d="M112.567,168.653V59.754h21.045v108.898C133.612,168.653,112.567,168.653,112.567,168.653z M179.522,168.653V59.754h-21.064v108.898C158.457,168.653,179.522,168.653,179.522,168.653z M96.876,0L13.243,55.143H183 L96.876,0z M10.185,176.615v19.618h175.863v-19.618H10.185z M37.786,168.653V59.754H16.731v108.898 C16.731,168.653,37.786,168.653,37.786,168.653z M82.074,168.653V59.754H61.01v108.898 C61.01,168.653,82.074,168.653,82.074,168.653z"/>
                        </svg>
                      </a>
                    </Show>
                  </h2>
                  
                  <div class="video-modal-meta">
                    <div class="show_info">
                      <span class="profile-info-label">Video ID:</span>
                      <span class="profile-info-value">
                        <a 
                          href={`https://www.youtube.com/watch?v=${selectedVideo()!.video_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="video-id-link"
                        >
                          {selectedVideo()!.video_id}
                        </a>
                      </span>
                      <div class="clear"></div>
                    </div>
                    
                    <Show when={selectedVideo()!.timestamp || selectedVideo()!.date_fallback}>
                      <div class="show_info">
                        <span class="profile-info-label">Date:</span>
                        <span class="profile-info-value">{formatDateTime(selectedVideo()!)}</span>
                        <div class="clear"></div>
                      </div>
                    </Show>
                    
                    <Show when={selectedVideo()!.username}>
                      <div class="show_info">
                        <span class="profile-info-label">Username:</span>
                        <span class="profile-info-value">
                          <Show when={getUserRanking(selectedVideo()!.username)} fallback={selectedVideo()!.username}>
                            <a 
                              href={`/users#${getUserRanking(selectedVideo()!.username)}`}
                              class="video-username-link"
                            >
                              {selectedVideo()!.username}
                            </a>
                          </Show>
                        </span>
                        <div class="clear"></div>
                      </div>
                    </Show>
                    
                    <Show when={selectedVideo()!.length}>
                      <div class="show_info">
                        <span class="profile-info-label">Duration:</span>
                        <span class="profile-info-value">{formatLength(selectedVideo()!.length)}</span>
                        <div class="clear"></div>
                      </div>
                    </Show>
                    
                    <div class="show_info">
                      <span class="profile-info-label">Status:</span>
                      <span class="profile-info-value">{getStatusText(selectedVideo()!.status, selectedVideo()!)}</span>
                      <div class="clear"></div>
                    </div>
                  </div>
                  
                  <Show when={selectedVideo()!.description}>
                    <div class="about-section">
                      <h3 class="about-title">Description</h3>
                      <p class="about-text video-description">
                        {selectedVideo()!.description.replace(/\\n/g, '\n')}
                      </p>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default OldestVideosPage