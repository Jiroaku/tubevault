import { useNavigate } from '@solidjs/router'

function HomePage() {
  const navigate = useNavigate()
  
  return (
    <div id="channel-base-div">
      <div id="channel-body">
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; min-height: 80vh; padding: 20px; box-sizing: border-box;">
          <div style="width: 100%; max-width: 800px; text-align: center;">
            <div class="outer-box">
              <div class="inner-box" style="background-color: #fff;">
                <div class="yt-404-box-title yt-rounded-top">
                  <span class="title-text">TubeVault</span>
                </div>
                <div class="clear"></div>
                <div class="yt-404-box-data yt-rounded-bottom" style="margin-top: 0; padding: 30px;">
                  <h2 style="margin-bottom: 20px; font-size: 24px;">Welcome to TubeVault</h2>
                  <p style="margin-bottom: 20px; font-size: 14px; color: #666;">
                    Preserving YouTube's early history since 2005. Explore the platform's earliest users and videos.
                  </p>
                  

                  <div style="margin-bottom: 25px;">
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                      <button 
                        class="yt-uix-button yt-uix-button-urgent"
                        onClick={() => navigate('/users')}
                        style="font-size: 14px; padding: 8px 16px;"
                      >
Oldest Users
                      </button>
                      <button 
                        class="yt-uix-button yt-uix-button-urgent"
                        onClick={() => navigate('/videos')}
                        style="font-size: 14px; padding: 8px 16px;"
                      >
Oldest Videos
                      </button>
                    </div>
                  </div>

                  <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
                    <p style="margin: 0; font-size: 12px; color: #999; font-style: italic;">
                      "Broadcast Yourself" - Preserving the early days of user-generated content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage