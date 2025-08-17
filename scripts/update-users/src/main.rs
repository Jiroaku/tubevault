use std::time::Duration;
use std::fs;
use std::path::Path;
use std::env;
use serde::{Deserialize, Serialize};
use youtubei::{InnertubeClient, models::Channel};
use anyhow::{Result, anyhow};
use youtube::{initialize_client, YouTubeDataV3Client, GoogleAPIRequest};

#[derive(Debug)]
struct ChannelData {
    display_name: String,
    description: String,
    subscribers: Option<i64>,
    videos: i32,
    views: i64,
    country: Option<String>,
    avatar_url: Option<String>,
    handle: Option<String>,
    verified: bool,
    status_code: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Video {
    video_id: String,
    title: String,
    description: String,
    created_at: i64,
    views: i64,
    likes: i64,
    comments: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    avatar_url: Option<String>,
    channel_id: Option<String>,
    confirmed: i32,
    country: Option<String>,
    created_at: Option<f64>,
    description: Option<String>,
    display_name: Option<String>,
    fallback_date: Option<String>,
    handle: Option<String>,
    notes: Option<String>,
    owner: Option<String>,
    status_code: i32,
    subscribers: Option<i64>,
    unconfirmed_reason: Option<String>,
    user_id: String,
    username: String,
    verified: Option<i32>,
    videos: Option<i32>,
    views: Option<i64>,
    wayback_archive: Option<String>,
    video_list: Option<Vec<Video>>,
}

impl From<Channel> for ChannelData {
    fn from(channel: Channel) -> Self {
        let status_code = if channel.terminated {
            1 // suspended
        } else if channel.deleted {
            2 // deleted
        } else if channel.hidden {
            3 // hidden
        } else {
            4 // active
        };

        Self {
            display_name: channel.display_name,
            description: channel.description,
            subscribers: channel.subscribers,
            videos: channel.videos,
            views: channel.views,
            country: channel.country,
            avatar_url: channel.profile_picture,
            handle: channel.handle,
            verified: channel.verified,
            status_code,
        }
    }
}

fn load_users_json() -> Result<Vec<User>> {
    let json_path = "../../public/users.json";
    
    if !Path::new(json_path).exists() {
        return Err(anyhow!("users.json file not found at {}", json_path));
    }
    
    let json_content = fs::read_to_string(json_path)
        .map_err(|e| anyhow!("Failed to read users.json: {}", e))?;
    
    let users: Vec<User> = serde_json::from_str(&json_content)
        .map_err(|e| anyhow!("Failed to parse users.json: {}", e))?;
    
    if users.is_empty() {
        return Err(anyhow!("No users found in users.json"));
    }
    
    println!("Loaded {} users from users.json", users.len());
    Ok(users)
}

fn save_users_json(users: &[User]) -> Result<()> {
    let json_path = "../../public/users.json";
    
    
    let json_content = serde_json::to_string_pretty(users)
        .map_err(|e| anyhow!("Failed to serialize users: {}", e))?;
    
    fs::write(json_path, json_content)
        .map_err(|e| anyhow!("Failed to write users.json: {}", e))?;
    
    println!("Successfully updated users.json");
    Ok(())
}

async fn fetch_channel_data(client: &mut InnertubeClient, channel_id: &str) -> Result<ChannelData> {
    println!("Fetching data for channel: {}", channel_id);
    
    let mut channel = client.get_channel(channel_id.to_string()).send().await
        .map_err(|e| anyhow!("Failed to get channel {}: {}", channel_id, e))?;
    
    // Try to get extended data, but don't fail if it doesn't work
    if let Err(e) = client.get_channel_extended(&mut channel).send().await {
        println!("Warning: Failed to get extended data for {}: {}", channel_id, e);
    }
    
    Ok(ChannelData::from(channel))
}

async fn fetch_channel_videos(youtube_client: &mut YouTubeDataV3Client, channel_id: &str, api_key: &str) -> Result<Vec<Video>> {
    println!("Fetching videos for channel: {}", channel_id);
    
    // Convert channel ID to uploads playlist ID (UC -> UU)
    let uploads_playlist_id = format!("UU{}", &channel_id[2..]);
    
    let mut videos = Vec::new();
    let mut page_token: Option<String> = None;
    
    loop {
        // Fetch playlist items
        let playlist_response = youtube_client
            .list_playlist_items(uploads_playlist_id.clone(), page_token.clone(), Some(50))
            .with_key(api_key)
            .send()
            .await?;
        
        if playlist_response.items.is_empty() {
            break;
        }
        
        // Extract video IDs
        let video_ids: Vec<String> = playlist_response.items.iter()
            .map(|item| item.content_details.video_id.clone())
            .collect();
        
        // Fetch detailed video information
        let video_response = youtube_client
            .list_videos(video_ids)
            .with_key(api_key)
            .send()
            .await?;
        
        for video in video_response {
            videos.push(Video {
                video_id: video.video_id,
                title: video.title.unwrap_or_default(),
                description: video.description.unwrap_or_default(),
                created_at: video.created_at,
                views: video.views,
                likes: video.likes,
                comments: video.comments,
            });
        }
        
        // Check if there's no next page
        if playlist_response.next_page_token.is_none() {
            break;
        }
        
        page_token = playlist_response.next_page_token;
        
        // Rate limiting
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    
    // Sort videos by creation date (newest first)
    videos.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    
    println!("Fetched {} videos for channel {}", videos.len(), channel_id);
    Ok(videos)
}

fn has_changes(existing: &User, new_data: &ChannelData) -> bool {
    let verified_int = if new_data.verified { 1 } else { 0 };
    
    existing.display_name.as_deref() != Some(&new_data.display_name) ||
    existing.description.as_deref() != Some(&new_data.description) ||
    existing.subscribers != new_data.subscribers ||
    existing.videos != Some(new_data.videos) ||
    existing.views != Some(new_data.views) ||
    existing.country != new_data.country ||
    existing.avatar_url != new_data.avatar_url ||
    existing.handle != new_data.handle ||
    existing.verified != Some(verified_int)
}

fn update_user_data(user: &mut User, data: &ChannelData) {
    let verified_int = if data.verified { 1 } else { 0 };
    
    user.display_name = Some(data.display_name.clone());
    user.description = Some(data.description.clone());
    user.subscribers = data.subscribers;
    user.videos = Some(data.videos);
    user.views = Some(data.views);
    user.country = data.country.clone();
    user.avatar_url = data.avatar_url.clone();
    user.handle = data.handle.clone();
    user.verified = Some(verified_int);
    user.status_code = data.status_code;
    
    println!("Updated user: {} ({})", data.display_name, user.user_id);
}

fn update_user_status_only(user: &mut User, status_code: i32) -> bool {
    if user.status_code == status_code {
        println!("Status already correct for user ({})", user.user_id);
        return false;
    }
    
    user.status_code = status_code;
    
    let status_name = match status_code {
        1 => "suspended",
        2 => "deleted", 
        3 => "hidden",
        4 => "active",
        _ => "unknown",
    };
    println!("Updated status to {} for user ({})", status_name, user.user_id);
    true
}

async fn update_channels(client: &mut InnertubeClient, youtube_client: &mut YouTubeDataV3Client, api_key: &str, users: &mut [User]) -> Result<()> {
    println!("Starting channel update cycle...");
    let mut updated_count = 0;
    let total_count = users.len();
    
    for user in users.iter_mut() {
        let channel_id = match &user.channel_id {
            Some(id) => id.clone(),
            None => {
                println!("Skipping user {} - no channel_id", user.username);
                continue;
            }
        };
        
        match fetch_channel_data(client, &channel_id).await {
            Ok(data) => {
                // API call succeeded, so we can determine the actual status from the Channel data
                if data.status_code == 4 {
                    // Channel is active - update all 9 fields + status_code if there are changes
                    if has_changes(user, &data) {
                        update_user_data(user, &data);
                        updated_count += 1;
                    } else {
                        // Even if no field changes, still update status_code if it changed
                        if update_user_status_only(user, data.status_code) {
                            updated_count += 1;
                        } else {
                            println!("No changes detected for active channel: {} ({})", data.display_name, channel_id);
                        }
                    }
                    
                    // Fetch videos for active channels that have videos
                    if user.videos.unwrap_or(0) >= 1 {
                        match fetch_channel_videos(youtube_client, &channel_id, api_key).await {
                            Ok(videos) => {
                                user.video_list = Some(videos);
                                println!("Updated video list for channel: {}", channel_id);
                                updated_count += 1;
                            }
                            Err(e) => {
                                eprintln!("Failed to fetch videos for channel {}: {}", channel_id, e);
                            }
                        }
                    }
                } else {
                    // Channel is not active (suspended/deleted/hidden) - only update status_code
                    if update_user_status_only(user, data.status_code) {
                        updated_count += 1;
                    }
                }
            }
            Err(e) => {
                eprintln!("Failed to fetch data for channel {}: {}", channel_id, e);
                
                // Try to determine status from error message and update status_code only
                let error_msg = e.to_string().to_lowercase();
                let status_code = if error_msg.contains("terminated") || error_msg.contains("suspended") {
                    1 // suspended
                } else if error_msg.contains("deleted") {
                    2 // deleted
                } else if error_msg.contains("hidden") || error_msg.contains("private") {
                    3 // hidden
                } else {
                    // For other errors, don't update status - might be temporary network issues
                    continue;
                };
                
                if update_user_status_only(user, status_code) {
                    updated_count += 1;
                }
            }
        }
        
        // Small delay between requests to be respectful
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    
    println!("Channel update cycle completed. Updated {}/{} channels.", updated_count, total_count);
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    println!("Starting YouTube Channel Data Updater...");
    
    // Get YouTube Data API key from environment
    let api_key = env::var("YOUTUBE_API_KEY")
        .map_err(|_| anyhow!("YOUTUBE_API_KEY environment variable not set"))?;
    
    // Load users from JSON file
    let mut users = load_users_json()?;
    
    // Initialize YouTube clients
    let mut client = InnertubeClient::new(None, "youtubei.googleapis.com".to_string(), None).await;
    println!("YouTube client initialized.");
    
    let http_client = initialize_client()?;
    let mut youtube_client = YouTubeDataV3Client::new("youtube.googleapis.com".to_string(), http_client).await;
    println!("YouTube Data API v3 client initialized.");
    
    // Update all channels
    if let Err(e) = update_channels(&mut client, &mut youtube_client, &api_key, &mut users).await {
        eprintln!("Error during channel update: {}", e);
        return Err(e);
    }
    
    // Save updated data back to JSON file
    save_users_json(&users)?;
    
    println!("YouTube channel data update completed successfully!");
    Ok(())
}