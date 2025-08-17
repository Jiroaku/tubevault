# Incremental IDs

Video IDs (ex. [jNQXAC9IVRw](https://www.youtube.com/watch?v=jNQXAC9IVRw)) are just [64-bit sequential MySQL primary keys](https://news.ycombinator.com/item?id=25302558), encrypted with [3DES](https://en.wikipedia.org/wiki/Triple_DES). This led to a security flaw in which the secret was hard-coded in Google's source code and any employee or third-party contractor with access to the source code could convert back-and-forth.

As a result, anyone with the secret would be able to convert all numbers from 1 onwards to the encrypted video ID and scrape all videos to find unlisted videos, undermining the whole security of unlisted videos. To mitigate this, YouTube made a decision in 2021 to [set all of these "insecure" unlisted videos (unlisted videos created before 2017) to private](https://blog.youtube/news-and-events/update-youtube-unlisted-links/).

However, YouTube also used these IDs for old user IDs, [blog IDs](https://web.archive.org/web/20090307103432/http://www.youtube.com/blog?entry=jNQXAC9IVRw), among several other IDs, meaning IDs taken from elsewhere could also be used to find videos. The first user ID **jNQXAC9IVRw** is also the first video ID [www.youtube.com/watch?v=**jNQXAC9IVRw**](https://www.youtube.com/watch?v=jNQXAC9IVRw). Recently, there was an important discovery that allowed anyone to increment numbers from 1-X and find the associated encrypted ID. This allows us to map the results and reverse this encryption to get the original ID for videos and users, hence allowing us to **find their position as the first nth user/video**. The first 10,000 IDs can be found <a href="/data/first_10k.csv" target="_blank">here</a>.

{user-id-decoder}

## Legacy User IDs

From late 2009, to early 2011 (before [Cosmic Panda layout](https://googlesystem.blogspot.com/2011/07/youtube-cosmic-panda.html)), user IDs were leaked on the page source of all user pages. Looking at the [page source for jawed](https://web.archive.org/web/20100507021416/youtube.com/user/jawed):

```html
<a id="aProfileBlockUser" href="#" onclick="yt.www.watch.user.blockUserLink('jNQXAC9IVRw', '/user/jawed');return false;">Block User</a>
```

We can see jawed's user ID: `jNQXAC9IVRw`. From this we can verify that jawed is **user #1**.

For channels that are still active (not hidden/suspended/deleted), we can use [YouTube's RSS Feeds endpoint](https://www.youtube.com/feeds/videos.xml?user=jawed) to return the exact creation date of the channel:

```xml
<author>
    <name>jawed</name>
    <uri>https://www.youtube.com/channel/UC4QobU6STFB0P71PMvOGN5A</uri>
</author>
<published>2005-04-24T03:20:54+00:00</published>
```

For channels that are no longer active, we can refer to [Wayback Machine archives](https://web.archive.org/web/20091218171638/youtube.com/user/rats) (from 2013 and earlier), or [Nick's list](https://www.youtube.com/watch?v=1fdoDtkrmlY) for join dates. The join dates returned from the YouTube frontend during this range are always in the PDT timezone. After the release of [YouTube's HitchHiker layout](https://blog.youtube/news-and-events/youtube-one-channel-now-available-for/), join dates might be adjusted according to the viewer's timezone and hence archives are unreliable.

Using exact creation date data, converted to UNIX timestamp data, as well as PDT join dates, we're able to confirm rankings for users without user ID archives.

[Visit Google Sheet](https://docs.google.com/spreadsheets/d/1u0oKvBDoFEK-qGUq3LpWpUCXHTg9wDvKPH61ruYhWS8/edit?gid=0#gid=0){button}

User IDs in red in the sheet indicates that the User ID specified for that username might be inaccurate as there is no way to determine it's ranking, as there are no User ID archives for that username, and it's not possible to determine it's ranking from creation date timestamps or Join Date archive data.

## Legacy Channel Service Account Emails

On ~2016-11-10, legacy channels that are not tied to any Google account were moved to [Brand Accounts](https://support.google.com/accounts/answer/7001996) such that they could be claimed via [youtube.com/gaia_link](youtube.com/gaia_link) using their [old YouTube username and password](https://support.google.com/youtube/answer/55757).

Service Accounts were automatically created by Google in the format of `youtube-legacy-channel-owner-XXXX@youtube-channels-madison-account-owner.gserviceaccount.com` and these emails were set as the primary owner of the Brand Account.

For the initial users, these emails were incremental according to their ranking as the earliest users:

```
1013 is gp (April 24)
1021 is rats (April 27)
1088 is sunnyd503 (June 12)
1099 is borrame (June 13)
1108 is codejunkee (June 13)
1146 is Lucky (June 14)
1202 is kimsmith (June 14)
1247 is Mista (June 15)
```

These emails were obtained by [SeedTech](https://seed.soy) using a social engineering "vulnerability" and released to the public. They allow us to confirm [sunnyd503](/users#88) and [borrame](/users#99)'s placements as 88th and 99th respectively.