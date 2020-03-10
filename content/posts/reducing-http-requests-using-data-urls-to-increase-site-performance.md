---
kind: article
date: 2009-12-18
title: Reducing HTTP requests using data URLs to increase performance
description: How to squeeze a little bit more out of your websites performance
tags:
- performance
aliases:
- /articles/reducing-http-requests-using-data-urls-to-increase-site-performance/
---

There are many ways you can increase the performance of your website. One of
the areas that can be looked at is the number of HTTP requests that are
required to retrieve many of the smaller assets for your page. Each request
will have a certain latency and download time associated with it. 

For some assets (like javascript and CSS) you may be able to combine the files
to reduce HTTP requests. Images can also be combined and image 'sprites' used
to reduce many small downloads (ie. for rollovers). This has been used to
display the images in this site's main menu.

But another option available is data URLs.

## Data URLs

This technique is something that could not really be taken advantage of until
recent times. This is due to the fact that Internet Explorer up to and
including version 7 don't support it. Version 8 does with some limitations.

What it basically entails is rather than specifying an external resource in
your HTML or CSS file that the browser has to go and fetch (another HTTP
request), you encode the resource and embed it into the HTML or CSS file
itself. This eliminates more HTTP requests and their associated waiting.

## Benefits & disadvantages

Just some of the benefits include:

- Less HTTP connections to the host reduces the total time and bandwith
  required to render the page.
- You are not limited to the maximum number of concurrent downloads that
  browser enforce on site. Resources served from data URLs are available
  immediately.
- A site served over HTTPS has extra over head associated with connections.
  Some people server static assets from a non-HTTPS site which then can pop up
  a warning about 'unsecure content'. Data URLs enable you to serve all those
  small resources directly.

The cons include the following:

- more difficult to develop and adjust pages. The data URLs need to be encoded
  and then embedded so when changes are performed this needs to be repeated.
  For some pages you may be able to perform this encoding once and cache the
  result for use in subsequent requests.
- Base 64 encoded items are generally larger in size. This means you need to
  determine whether the extra size counteracts the additional HTTP request and
  its slowdown. In general, though, small images work fine. Also, if gzip
  compression is used on the server side, this can help offset any increase in
  size.
- Data URLs are downloaded everytime the host document is, they are not cached.
  If there are many data URLs to be used they could be placed in a separate
  file which could be cached (ie. a CSS file for all data URLs). This would
  only work for many instances. 

## Example

So in your CSS file, instead of this:

    #foo {
      background: transparent url(/images/bar.png) top left no-repeat;
    }

you would have this:

    #foo {
      background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kMEgYuCMdUaP4AAAAZdEVYd') top left no-repeat;
    }

Now this doesn't make your CSS file any nicer looking but if you happen to use
a number of small images (like list/bullet images) then this technique can
improve your page load times.

Care must be taken, however. You may need to include conditional comments to
load a legacy style sheet (for CSS embedded data URLs) for certain browsers,
overriding the valid CSS properties. For example:

    <link rel="stylesheet" type="text/css" href="/css/default.css" />
    <!--[if lte IE 7]>
    <link rel="stylesheet" type="text/css" href="/css/crappy-browsers.css" />
    <![endif]-->

## Online tools

There are many around, here is another one:

<form id="data-url" enctype="multipart/form-data" action="/data-urls/encode/" method="post">
File to encode:<input name="origfile" type="file" />
<input id="data-url-submit" type="submit" value="Encode File" disabled="disabled" />
<span id="data-url-loading"><img src="/images/loader.gif" alt="loading" /></span>
</form>
<div id="data-url-response"></div>
<script type="text/javascript">
$(document).ready(function(){
  $.getScript('/js/jquery.form.min.js', function(){
    $('#data-url-loading').hide();
    $('#data-url-submit').attr('disabled','');
    $('#data-url').ajaxForm({
      target: '#data-url-response',
      beforeSubmit: function(){
        $('#data-url-loading').show();
        },
      success: function(){
        $('#data-url-loading').hide();
        $('#data-url-response').show();
        }
      });
    });
  });
</script>
