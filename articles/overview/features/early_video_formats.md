# Early Video Formats

YouTube's early video system relied heavily on Flash Video (FLV) containers and specific codecs that were optimized for web delivery in 2005-2006. Understanding these formats is crucial for archival work and understanding the technical constraints of early YouTube.

## Flash Video (FLV) Container

YouTube exclusively used the Flash Video container format from its launch in April 2005 until the introduction of HTML5 video support in 2010. The FLV format was chosen because:

- **Universal browser support**: Flash Player was installed on 99% of computers by 2005
- **Progressive download**: Videos could start playing before fully downloaded
- **Small file sizes**: Optimized for dial-up and early broadband connections
- **Metadata support**: Could embed title, description, and timing information

### FLV Structure

Early YouTube FLV files contained:

```
FLV Header (9 bytes)
├── Signature: "FLV"
├── Version: 1
├── Flags: Video + Audio
└── Header Size: 9

Video Tag
├── Tag Type: 9 (Video)
├── Data Size: Variable
├── Timestamp: 0
├── Stream ID: 0
└── Video Data: Sorenson Spark/VP6 encoded

Audio Tag (if present)
├── Tag Type: 8 (Audio)
├── Data Size: Variable
├── Timestamp: 0
└── Audio Data: MP3 encoded
```

## Video Codecs

### Sorenson Spark (2005-2006)

YouTube's initial video codec was Sorenson Spark, a proprietary codec optimized for low-bitrate streaming:

- **Bitrate**: 200-500 kbps typical
- **Resolution**: 320x240 standard, 640x480 for "high quality"
- **Frame rate**: 15-30 fps
- **Color depth**: 24-bit RGB
- **Compression**: Lossy, optimized for web delivery

Sorenson Spark was chosen because it provided good quality at very low bitrates, essential for YouTube's early user base on dial-up connections.

### VP6 Transition (2006-2007)

In late 2006, YouTube began transitioning to On2 VP6 codec:

- **Better compression**: 20-30% smaller files than Sorenson Spark
- **Improved quality**: Better detail preservation at low bitrates
- **Hardware acceleration**: Supported by newer Flash Player versions
- **Backward compatibility**: Older videos remained in Sorenson Spark

The transition was gradual, with new uploads using VP6 while existing content remained unchanged.

## Audio Encoding

### MP3 Audio (2005-2008)

Early YouTube videos used MP3 audio encoding:

- **Bitrate**: 64-128 kbps
- **Sample rate**: 22.05 kHz or 44.1 kHz
- **Channels**: Mono or stereo
- **Quality**: Optimized for speech and music

MP3 was chosen for its universal compatibility and efficient compression.

## File Size Limitations

### Early Constraints (2005-2006)

YouTube's original upload limits were:

- **File size**: 100 MB maximum
- **Duration**: 10 minutes maximum
- **Resolution**: 320x240 recommended
- **Bitrate**: 200-500 kbps video, 64-128 kbps audio

These limits were designed for the technical constraints of 2005 web infrastructure and user bandwidth.

### Quality Settings

YouTube offered three quality levels:

1. **Low Quality**: 200 kbps, 15 fps, 320x240
2. **Medium Quality**: 400 kbps, 24 fps, 320x240
3. **High Quality**: 500 kbps, 30 fps, 640x480

The "High Quality" option was only available for videos uploaded at 640x480 or higher resolution.

## Technical Implementation

### Flash Player Integration

YouTube's video player was built using ActionScript 2.0 and Flash Player 7+:

```actionscript
// Early YouTube player initialization
var videoPlayer:Video = new Video();
videoPlayer.attachVideo(stream);
stream.play("rtmp://youtube.com/video/" + videoId);
```

### Progressive Download

Videos were served via HTTP progressive download:

- **No streaming protocol**: Videos downloaded as regular HTTP files
- **Seek capability**: Users could jump to any point once downloaded
- **Bandwidth adaptation**: Player adjusted quality based on connection speed
- **Caching**: Videos cached in browser for repeat viewing

## Archival Considerations

### Format Preservation

When archiving early YouTube videos, consider:

1. **Original format**: Preserve FLV files when possible
2. **Codec information**: Document Sorenson Spark vs VP6 encoding
3. **Metadata**: Extract embedded title, description, and timing data
4. **Quality assessment**: Note original bitrate and resolution settings

### Conversion Challenges

Converting early YouTube videos presents unique challenges:

- **Codec support**: Modern players may not support Sorenson Spark
- **Quality loss**: Re-encoding can degrade already compressed content
- **Metadata preservation**: FLV metadata may be lost in conversion
- **Aspect ratio**: Early videos often had non-standard aspect ratios

## Historical Significance

These early video formats represent a crucial period in web video history:

- **Technical innovation**: YouTube pioneered web video delivery at scale
- **User experience**: Format choices directly impacted early user adoption
- **Industry influence**: YouTube's format decisions influenced the entire web video industry
- **Preservation challenges**: Understanding these formats is essential for digital preservation

The transition from Sorenson Spark to VP6, and eventually to H.264, represents the evolution of web video technology during YouTube's formative years.

## References

- [Flash Video Format Specification v1.0](https://www.adobe.com/content/dam/acom/en/devnet/flv/video_file_format_spec_v10.pdf) - Adobe's official FLV format documentation
- [YouTube Blog Archive (2005-2006)](https://web.archive.org/web/20051201000000*/youtube.com/blog) - Wayback Machine archives of YouTube's technical blog posts
- [Sorenson Spark Codec Documentation](https://web.archive.org/web/20051201000000*/sorenson.com) - Archived documentation of the Sorenson Spark codec
- [Early YouTube API Documentation](https://web.archive.org/web/20051201000000*/youtube.com/dev) - Wayback Machine archives of YouTube's developer documentation
- [Flash Player 7 Release Notes](https://web.archive.org/web/20041201000000*/adobe.com/products/flashplayer) - Technical specifications for Flash Player 7+ support
- [On2 VP6 Codec Documentation](https://web.archive.org/web/20061201000000*/on2.com) - Archived documentation of the VP6 codec used by YouTube
