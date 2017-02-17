---
kind: article
date: 2009-06-23
updated_at: 2011-03-08
title: Setting up subdomain cookies, varnish and Nginx for faster asset serving
description: How to set up your subdomain cookies for faster static asset serving
tags:
- performance
- nginx
- varnish
---

Not long ago I wrote about [using subdomains to improve your sites'
performance](/posts/www-subdomain-usage/). Well this is one way you can
combine it all to speed up your site.

## Nginx subdomain setup

Firstly, you need to set up a separate subdomain to serve your static,
cookie-less content. Let's say http://static.example.com/. This requires a
section in your Nginx server config as follows:

    server {
      server_name example.com www.example.com;
      root   /var/www/.../example.com/htdocs/;

      # lets add www
      if ($host !~* "^www\.") {
        rewrite  ^/(.*)$  http://www.$host/$1  permanent;
      }

      # serve static files directly
      if ($request_uri ~* "\.(jpe?g|gif|css|png|js|ico|pdf|zip|gz)$") {
        expires 30d;
        break;
      }

      #... other stuff here ...

    }

    server {
      server_name static.example.com;

      if ($request_uri !~* "\.(jpe?g|gif|css|png|js|ico|pdf|zip|gz)$") {
        rewrite ^(.*) http://www.example.com$1 permanent;
        break;
      }

      location / {
        root   /var/www/.../example.com/htdocs/;
        expires max;
        add_header Cache-Control private;
      }
    }

Some of the important points to notice:

- We do a permanent redirect to the 'www' subdomain for any requests to
  example.com. 
- We also set a month expires on any static content served from www.example.com
  just in case. 
- The second 'server' section catches requests to static.example.com and sets
  the expires header and the cache control header for longevity. Notice it has
  the same 'root' setting as it is essentially the same as the first server
  configuration except with different headers. We also catch content requests
  that should have gone to the main domain and redirect them with a 301
  redirect.

This setup allows us to set cookies on the www.example.com domain and not
static.example.com.

Now you just have to remember to refer to static elements of your page from the
static.example.com domain. This is only for items that are unlikely to change
like images, CSS, javascript etc.

## Varnish's cache

[Varnish](http://varnish.projects.linpro.no/) (or another proxy) will now be
able to cache all content from static.example.com as it has no cookies set.
There are ways to set up Varnish to enable caching of cookied content but it is
easy to run into trouble there. This method can be done on a per site basis
without having to adjust Varnish and have very good results.

## Conclusion

By being a little more careful in how you construct your subdomain structure
and how your site uses it, you are able to reduce bandwidth and enable other
parts of the delivery chain to do their job better.
