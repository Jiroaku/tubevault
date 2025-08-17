# Channel IDs

For channel IDs of active channels, they can be found from the share modal of the channel page. However, in order to find the channel ID of a suspended/deleted channel with only the username, we need to look at wayback archives.

## 2014 - 2018 Archives (HitchHiker Layout)

From 2014 - 2018, `/user/` pages still resolved to the actual channel page, rather than returning 404, even if the channel was suspended/deleted. The page source of this page also contained the channel ID.

In the [page source](https://web.archive.org/web/20150826202611/https://www.youtube.com/user/0), we can `Ctrl-F` for "CHANNEL_ID" to find the channel ID:

```js
yt.setConfig('CHANNEL_ID', "UCe-YfgvFkhbX6tfZ34sAKig");
```

## 2010 - 2013 Archives (Beta & Cosmic Panda)

In early 2010, profile pictures switched from `http://i4.ytimg.com/vi/kGA_keUyqSo/default.jpg` format to `http://i1.ytimg.com/i/pAaoXljPxFhnHMg3dIqpeQ/1.jpg?v=8dd12c`

The `pAaoXljPxFhnHMg3dIqpeQ` value in the profile picture is actually the latest YouTube user ID (not to be confused with the old user IDs). the channel ID is [UCpAaoXljPxFhnHMg3dIqpeQ](https://www.youtube.com/channel/UCpAaoXljPxFhnHMg3dIqpeQ)

An example can be seen in [this archive](https://web.archive.org/web/20100307154423/https://www.youtube.com/user/sameer):

<img src="/assets/user_id_in_pfp_url.png">{scale=1}
