# Redirects

There are two redirect features on YouTube - **Channel Redirects** and **Conditional Redirects**, both of which are very different. This article does not cover ["live redirects"](https://support.google.com/youtube/answer/10359590?hl=en) as they are not special.

## Channel Redirects

Channel redirects allow you to redirect the shortened of a YouTube URL to any other YouTube page (including videos).

<img src="/assets/channel_redir.png">{scale=0.6}

For channels with a legacy username ex. `/user/smosh` or with a Custom URL `/+smosh`, `/smosh` would be the shortened version. By setting the channel redirect feature, these can be redirected to any other youtube.com page. It's also possible to redirect viewers off-site by chaining this with an open redirect.

The handle URL ex. `/@smosh` is considered a "shortened version" and hence works with the Channel redirect feature.

In the past, this feature was automatically granted when a channel is linked to a [CMS account](https://support.google.com/youtube/answer/6301172?hl=en). If you left/were removed from the CMS, the feature remained, leaving many channels from the MCN era to keep this feature. However, recently a changed was made such that if a channel is unlinked from the CMS, this feature is disabled. This feature is also **no longer automatically granted**.

For channels with a "Vanity URL" (ex. [/mrbeast](https://www.youtube.com/mrbeast)), it does not work with the Channel redirect feature.

## Conditional Redirects

Conditional redirects allow you to conditionally redirect users on your channel page to any other channel based on country/locale/age/gender rules.

<img src="/assets/conditional_redir.png">{scale=0.6}

Unlike channel redirects, these work as long as you land on the channel page. After [an incident in 2022](https://www.vice.com/en/article/youtube-mystery-custom-urls/), the documentation of this feature was removed from the support article ([original](https://web.archive.org/web/20220319075634/https://support.google.com/youtube/answer/2976814#zippy=%2Cconditional-redirects), [current](https://support.google.com/youtube/answer/2976814)).

This feature was originally granted alongside channel redirects for partnered channels back in the day. However, due to an [impersonation incident in 2013](https://www.youtube.com/watch?v=Nw-HByz-le8), all channels that were not hidden or had the feature in use had it removed. This feature is available on request for channels tied to a Partner Manager (whether indirectly through a CMS or not). There is currently wide-spread abuse of this feature for social-engineering YouTube's support team for stealing creator awards, handles or viewing unauthorized channel analytics.

<table class="markdown-table">
<thead>
<tr>
<th>Example redirect</th>
<th>Redirect result</th>
</tr>
</thead>
<tbody>
<tr>
<td>en_,jawed</td>
<td>Redirects all English speakers to jawed.</td>
</tr>
<tr>
<td>UCX6OQ3DkcsbYNE6H8uQQuVA</td>
<td>Redirects all users to MrBeast.</td>
</tr>
<tr>
<td>_us,&lt;21,_block</td>
<td>Blocks all users who are in the United States and under the age of 21 from visiting this channel.</td>
</tr>
<tr>
<td>_us,&gt;=21,f,jawed<br>_block</td>
<td>Redirects who are in the United States, 21 years old or older, and female to jawed and blocks all other users.</td>
</tr>
</tbody>
</table>