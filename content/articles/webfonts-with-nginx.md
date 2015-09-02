---
kind: article
date: 2010-08-22
title: Webfonts with Nginx
description: Changes to Ningx's mime types for serving your own webfonts
tags:
- nginx
- webfonts
---

I just made some changes on my site to use webfonts for the main menu and any
Lahu language sections of the site. I have chosen to serve the font files
directly from my server as most of the other webfont servers don't provide a
good Unicode 5 version of any font required for Lahu display.

This does mean that I needed to update my Nginx mime types to serve the font
files with the correct mime type. I added the following to my mime.types file in
the Nginx config directory:


    application/x-font-ttf                ttf;
    font/opentype                         otf;
    application/vnd.ms-fontobject         eot;

and reloaded Nginx. Now they are served correctly instead of
'application/octet-stream'.
