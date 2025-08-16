---
title: Conversion of video with ffmpeg
keywords: [ffmpeg]
---

- Use as slow-a-prefix as I have patience for
- A value of `-crf 18` should have the same quality as the original
- A value of `-crf 30` is getting blocky
- Audio is just copied as its space is negligible

```sh
# For almost lossless conversion
$ ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow -c:a copy output.mkv
```

```sh
# For those tv episodes I will never watch again
$ ffmpeg -i input.mp4 -c:v libx264 -crf 30 -preset ultrafast -c:a copy output.mkv
```
