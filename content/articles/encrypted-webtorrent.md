---
title: Encrypted WebTorrent
date: 2016-05-26
keywords: webtorrent
description: Sending encrypted files via WebTorrent
draft: true
tags:
- webtorrent
- javascript
---

## WebTorrent

[WebTorrent](https://webtorrent.io) is cool. It is "a streaming torrent client
for node.js and the browser" which means you can do all sorts of distributed
stuff in Javascript.

Encryption is also cool. It lets you do all sorts of other stuff securely and
verifiably (not a word!?).

So lets combine them:

Upload a file: <input type="file" id="upload" name="files" multiple>

<form>
    <label for="torrentId">Download from a magnet link: </label>
    <input name="torrentId", placeholder="magnet:">
    <button type="submit">Download</button>
</form>

<h2>Log</h2>
<div class="log"></div>


<script src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js"></script>
<script src="/js/posts/dragdrop.min.js"></script>
<script src="/js/posts/encrypted-webtorrent.js"></script>
