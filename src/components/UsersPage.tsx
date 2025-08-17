import { createSignal, For, Show, createResource, createEffect } from 'solid-js'
import { useParams, useNavigate } from '@solidjs/router'
import '../styles/tubevault.css'

interface Video {
  video_id: string
  title: string
  description: string
  created_at: number
  views: number
  likes: number
  comments: number
}

interface YouTubeUser {
  avatar_url: string | null
  channel_id: string
  confirmed: number
  country: string | null
  created_at: number | null
  description: string | null
  display_name: string | null
  fallback_date: string
  handle: string | null
  notes: string | null
  owner: string
  status_code: number
  subscribers: number | null
  unconfirmed_reason: string | null
  user_id: string
  username: string
  verified: number | null
  videos: number | null
  views: number | null
  wayback_archive: string | null
  video_list?: Video[]
}

const fetchUsers = async (): Promise<YouTubeUser[]> => {
  const response = await fetch('/users.json')
  return response.json()
}

function UsersPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = createSignal<YouTubeUser | null>(null)
  const [showRankings, setShowRankings] = createSignal(true)
  
  const formatDate = (user: YouTubeUser) => {
    if (user.created_at) {
      const date = new Date(user.created_at * 1000)
      return date.toLocaleDateString('en-CA', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    return user.fallback_date
  }

  const formatDateTime = (user: YouTubeUser) => {
    if (user.created_at) {
      const date = new Date(user.created_at * 1000)
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
    return user.fallback_date
  }

  const formatVideoDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-CA', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatViewCount = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatDescription = (description: string) => {
    return description.replace(/\r\n/g, '\n').replace(/\n/g, ' ')
  }

  
  const [users] = createResource(fetchUsers)
  const oldestUsers = () => users() || []

  const getUserRanking = (user: YouTubeUser) => {
    const usersList = oldestUsers()
    const index = usersList.findIndex(u => u.user_id === user.user_id)
    return index !== -1 ? index + 1 : null
  }

  const openUserProfile = (user: YouTubeUser, ranking: number) => {
    setSelectedUser(user)
    window.location.hash = ranking.toString()
  }

  const closeModal = () => {
    setSelectedUser(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  // Handle /user/<username> redirect and hash navigation
  createEffect(() => {
    const usersList = oldestUsers()
    if (usersList.length > 0) {
      // Handle /user/<username> redirect to /users#ranking
      if (params.username) {
        const user = usersList.find(u => u.username.toLowerCase() === params.username.toLowerCase())
        if (user) {
          const ranking = usersList.indexOf(user) + 1
          navigate('/users#' + ranking, { replace: true })
        } else {
          navigate('/users', { replace: true })
        }
        return
      }
      
      // Check for hash on mount and when users data loads
      const hash = window.location.hash.slice(1) // Remove the #
      if (hash) {
        const ranking = parseInt(hash)
        if (!isNaN(ranking) && ranking >= 1 && ranking <= usersList.length) {
          const user = usersList[ranking - 1] // Convert 1-based ranking to 0-based index
          if (user) {
            setSelectedUser(user)
          }
        }
      }
    }
  })

  return (
    <div id="channel-base-div">
      <div id="channel-body">
          <div class="page-container">
            <div class="page-content">
              {/* Subscribers Box - Modified for Oldest Users */}
                <div class="outer-box">
                  <div class="inner-box">
                    <div class="box-header">
                      <div class="box-title">Oldest Users (100)</div>
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
                    </div>
                    <div class="clear"></div>
                  <div class="user-peep-container">
                      <For each={oldestUsers()}>
                        {(user, index) => (
                          <div class="user-peep user-peep-item">
                            <div 
                              class="user-thumb-xlarge user-thumbnail"
                              onClick={() => openUserProfile(user, index() + 1)}
                            >
                              <Show when={showRankings()}>
                                <div style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  'background-color': user.unconfirmed_reason ? 'rgba(255, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                                  color: user.unconfirmed_reason ? '#fff' : '#333',
                                  'font-size': '10px',
                                  'font-weight': 'bold',
                                  width: '18px',
                                  height: '15px',
                                  display: 'flex',
                                  'align-items': 'center',
                                  'justify-content': 'center',
                                  'border-radius': '2px',
                                  'font-family': 'Arial, sans-serif',
                                  'box-shadow': '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                  #{index() + 1}
                                </div>
                              </Show>
                              <img src={user.avatar_url ? (user.avatar_url.startsWith('http') ? user.avatar_url : `https://yt3.googleusercontent.com/${user.avatar_url}`) : 'https://s.ytimg.com/yt/img/no_videos_140-vfl1fDI7-.png'} alt={user.username} referrerpolicy="no-referrer" />
                              {user.status_code !== 4 && (
                                <div class={`status-overlay ${user.status_code === 1 ? 'suspended' : user.status_code === 2 ? 'deleted' : user.status_code === 3 ? 'hidden' : 'unknown'}`}>
                                  {user.status_code === 1 ? 'suspended' : user.status_code === 2 ? 'deleted' : user.status_code === 3 ? 'hidden' : 'unknown'}
                                </div>
                              )}
                            </div>
                            <div class="username-container">
                              <a 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault()
                                  openUserProfile(user, index() + 1)
                                }}
                                class={`username-link ${user.status_code !== 4 ? (user.status_code === 1 ? 'suspended' : user.status_code === 2 ? 'deleted' : user.status_code === 3 ? 'hidden' : 'unknown') : ''}`}
                              >
                                {user.username}
                              </a>
                            </div>
                            <div class="join-date-container">
                              {formatDate(user)}
                            </div>
                          </div>
                        )}
                      </For>
                  </div>
                </div>
              </div>
            </div>

          <div class="clear"></div>
        </div>
      </div>

      {/* Modal Popup */}
      <Show when={selectedUser()}>
        <div class="modal-overlay" onClick={closeModal}>
          <div 
            class="outer-box modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="inner-box">
              <div class="modal-header">
                <div class="box-title">User Profile</div>
                <button 
                  onClick={closeModal}
                  class="modal-close-button"
                >
                  ✕
                </button>
              </div>
              
              <div class="profile-content">
                <div class="user-thumb-xlarge profile-avatar">
                  <img src={selectedUser()?.avatar_url ? (selectedUser()!.avatar_url!.startsWith('http') ? selectedUser()!.avatar_url! : `https://yt3.googleusercontent.com/${selectedUser()!.avatar_url!}`) : 'https://s.ytimg.com/yt/img/no_videos_140-vfl1fDI7-.png'} alt={selectedUser()!.username} referrerpolicy="no-referrer" />
                  {selectedUser()!.status_code !== 4 && (
                    <div class={`status-overlay ${selectedUser()!.status_code === 1 ? 'suspended' : selectedUser()!.status_code === 2 ? 'deleted' : selectedUser()!.status_code === 3 ? 'hidden' : 'unknown'}`}>
                      {selectedUser()!.status_code === 1 ? 'suspended' : selectedUser()!.status_code === 2 ? 'deleted' : selectedUser()!.status_code === 3 ? 'hidden' : 'unknown'}
                    </div>
                  )}
                </div>
                <div class="profile-info">
                  <h2 class={`profile-username ${selectedUser()!.status_code !== 4 ? (selectedUser()!.status_code === 1 ? 'suspended' : selectedUser()!.status_code === 2 ? 'deleted' : selectedUser()!.status_code === 3 ? 'hidden' : 'unknown') : ''}`}>
                    <Show when={selectedUser()!.channel_id} fallback={selectedUser()!.username}>
                      <a 
                        href={`https://www.youtube.com/channel/${selectedUser()!.channel_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="profile-channel-link"
                        style="color: inherit; text-decoration: none;"
                      >
                        {selectedUser()!.username}
                      </a>
                    </Show>
                  </h2>
                  <div class="profile-details">
                    <div class="show_info">
                      <span class="profile-info-label">User ID:</span>
                      <Show when={selectedUser()!.wayback_archive} fallback={
                        <span 
                          class="profile-info-value"
                          style={{ color: selectedUser()!.unconfirmed_reason ? '#cc0000' : 'inherit' }}
                        >
                          {selectedUser()!.user_id}
                        </span>
                      }>
                        <a 
                          href={selectedUser()!.wayback_archive!} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          class="profile-value-link"
                          style={{ color: selectedUser()!.unconfirmed_reason ? '#cc0000' : 'inherit' }}
                        >
                          {selectedUser()!.user_id}
                        </a>
                      </Show>
                      <div class="clear"></div>
                    </div>
                    <div class="show_info">
                      <span class="profile-info-label">Joined:</span>
                      <span class="profile-info-value">{formatDateTime(selectedUser()!)}</span>
                      <div class="clear"></div>
                    </div>
                    <Show when={selectedUser()!.owner}>
                      <div class="show_info">
                        <span class="profile-info-label">Owner:</span>
                        <span class="profile-info-value">{selectedUser()!.owner}</span>
                        <div class="clear"></div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
              
              <Show when={selectedUser()!.description}>
                <div class="about-section">
                  <h3 class="about-title">About</h3>
                  <p class="about-text">
                    {selectedUser()!.description}
                  </p>
                </div>
              </Show>
              
              <Show when={selectedUser()!.video_list && selectedUser()!.video_list!.length > 0}>
                <div class="videos-section">
                  <h3 class="about-title">Videos</h3>
                  <div class="video-list">
                    <For each={selectedUser()!.video_list}>
                      {(video) => (
                        <a 
                          href={`https://www.youtube.com/watch?v=${video.video_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="video-item-link"
                        >
                          <div class="video-item">
                            <div class="video-thumbnail">
                              <img 
                                src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`} 
                                alt={video.title}
                                referrerpolicy="no-referrer"
                              />
                            </div>
                            <div class="video-info">
                              <h4 class="video-title">{video.title}</h4>
                              <div class="video-meta" style="font-size: 9px;">
                                <span class="video-views">{formatViewCount(video.views)}</span>
                                <span class="video-separator">•</span>
                                <span class="video-date">{formatVideoDate(video.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
                
              <Show when={selectedUser()!.notes}>
                <div class="notes-section">
                  <h3 class="about-title">Notes</h3>
                  <p class="notes-text">
                    {selectedUser()!.notes}
                  </p>
                </div>
              </Show>
              
              <Show when={selectedUser()!.unconfirmed_reason}>
                <div class="unconfirmed-section">
                  <h3 class="about-title">
                    Unconfirmed Reason{' '}
                    <span 
                      title="There is no known way to definitively prove that this username belongs to this specific user ID. The association may be uncertain or based on incomplete data."
                      style={{
                        cursor: 'help',
                        color: '#666',
                        'font-size': '11px',
                        'font-weight': 'normal'
                      }}
                    >
                      [?]
                    </span>
                  </h3>
                  <p class="unconfirmed-text">
                    {selectedUser()!.unconfirmed_reason}
                  </p>
                </div>
              </Show>
              
              <div class="stats-section">
                <div class="stats-container">
                  <Show when={selectedUser()!.subscribers !== null && selectedUser()!.subscribers !== undefined}>
                    <div class="stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>{selectedUser()!.subscribers!.toLocaleString()}</span>
                    </div>
                  </Show>
                  <Show when={selectedUser()!.videos !== null && selectedUser()!.videos !== undefined}>
                    <div class="stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                      <span>{selectedUser()!.videos}</span>
                    </div>
                  </Show>
                  <Show when={selectedUser()!.views !== null && selectedUser()!.views !== undefined}>
                    <div class="stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      <span>{selectedUser()!.views!.toLocaleString()}</span>
                    </div>
                  </Show>
                  <Show when={selectedUser()!.country}>
                    <div class="stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>{selectedUser()!.country}</span>
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

export default UsersPage