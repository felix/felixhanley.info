---
kind: article
date: 2010-08-22
title: Webfonts with Nginx
description: Changes to Ningx's mime types for serving your own webfonts
tags:
- nginx
- webfonts
aliases:
- /articles/webfonts-with-nginx/
---

To serve your own webfonts from NginX they need to be served with the correct
content-type.  Add the following to my mime.types file in the Nginx config
directory:

    application/x-font-ttf                ttf;
    font/opentype                         otf;
    application/vnd.ms-fontobject         eot;

and reload Nginx. Now they are served correctly instead of
'application/octet-stream'.
