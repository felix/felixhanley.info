---
kind: article
date: 2010-05-21
title: Optimise images for performance and consistency
description: using pngcrush/optipng to speed up your website and make colours more consistent
keywords: optimisation pngcrush optipng
tags:
- performance
- www
---

In an effort to reduce your website's page size, whether it be to just provide a
better experience for the user or to work inline with [Google's plans to factor
page speed into
rankings](http://googlewebmastercentral.blogspot.com/2010/04/using-site-speed-in-web-search-ranking.html),
you will inevitably get to the point of dealing with your site's images.

In many sites the images take up a large proportion of the site's weight (in
bytes). So getting the most out of them is very important. One tool that is
essential in this regard is [pngcrush](http://pmt.sourceforge.net/pngcrush/).

## pngcrush

Pngcrush is a tool that _lossless_ reduces the size of PNG files. PNG are used
mainly for styling the website and so are vital to the look (and often the
readability) of the site itself. JPEGs are great for photographs which need no
restriction on the number of colours. Compression of JPEGs are dealt with
differently. Few modern designers use GIFs anymore now that IE supports alpha
transparency in PNGs, so we will assume that we are only dealing with PNGs.

Pngcrush uses a number of techniques to reduce the size of your PNGs such as
reducing the palette or applying different compression algorithms to the image
data.

## An example

A good example of the size difference is the [menu image used on this
site](/images/menu.png). An initial save of the PNG image was 159Kb. This same
image when run through pngcrush resulted in a size of 14.5Kb, with no reduction
in quality. It is a simple as this:

    pngcrush infile.png outfile.png

or trying more methods to reduce size:

    pngcrush -brute infile.png outfile.png

For my site, I am already using the sprite technique to combine images for my
main menu so together I am able to reduce, not only the total amount to be
downloaded, but also the number of HTTP requests needed to create my menu.

## Alternatives

There are several other alternatives to pngcrush such as its fork,
[optiPNG](http://optipng.sourceforge.net/). This does pretty
much the same job.

## Colour consistency

One thing that pngcrush does that others do not yet seem to do is reduce the
file size by removing the colour correction (or colour profile) data from the
file. This can sometimes reduce the size by up to 40%. What this also means is
that your images will appear more consistently across browsers. How so?

Many image manipulation programs will place a colour profile within the image to
enable different systems to display the image as close as possible to the
original. Firefox, for instance, will use these profiles to adjust the colours
before displaying them. Google Chrome, on the other hand, will not. What this
means is that some images on your site will appear differently in Firefox and
Chrome. It could also mean that colour values in CSS style sheets will not match
those colours, while using identical codes, in PNG files.

The command line to remove all colour profiles from your PNG is as follows:

    pngcrush -rem gAMA -rem cHRM -rem iCCP -rem sRGB infile.png outfile.png


## Conclusion

By removing the colour profile data from your images, you not only reduce the
file size but you force browsers (such as Firefox) to make do without the profile
and so render them more consistently, with other systems _and_ with CSS colour
values. A faster and more colour accurate site.
