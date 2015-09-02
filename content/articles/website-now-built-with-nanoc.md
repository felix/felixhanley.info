---
kind: article
date: 2010-02-26
title: Second Drawer is now built with Nanoc
keywords: nanoc jekyll ruby
description: Why I moved from Jekyll to Nanoc
tags:
- jekyll
- nanoc
---
**UPDATE:** The source for seconddrawer.com.au is now available from my git
server, http://git.seconddrawer.com.au/

After a long while of building this (and other) sites with
[Jekyll](http://github.com/mojombo/jekyll) I eventually got too fed up with its
limitations and have moved to [Nanoc](http://nanoc.stoneship.org/).

Both Nanoc and Jekyll are static web site builders. You build the site
locally and then push the resulting site up to your server. This means
the webserver is only ever serving static files.

## Jekyll's downfall

One of Jekyll's features is that it is used by the code hosting site
Github. Github can build your pages if they are laid out as a Jekyll
site and it does it for you on the server. For this to work, Jekyll
cannot trust any of the content passed to it. This results in the
following annoying issues:

- you need to use the Liquid template engine which I found to be very limited
- other HTML builder languages such as HAML are second class citizens
- you are hamstrung by not being able to use Ruby code to build your site the way you want.

While Nanoc on the other hand has the following features that I like:

- almost any templating engine can be used via filters
- you can embed Ruby in your pages to generate almost anything at compile time
- your site structure can be customised completely (using Ruby)

The [Nanoc site](http://nanoc.stoneship.org/) has some good
[tutorials](http://nanoc.stoneship.org/tutorial/) and
[docs](http://nanoc.stoneship.org/manual/) to get you started but you will
learn the most by examining some example sites such as the authors own site
[Stoneship](http://projects.stoneship.org/hg/sites-stoneship/).  One day I will
stick mine up...


