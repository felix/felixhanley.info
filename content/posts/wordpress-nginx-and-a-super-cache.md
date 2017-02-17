---
kind: article
date: 2009-05-16
title: Wordpress, Nginx and a super cache
keywords: wordpress, nginx, cache
description: How to set up Wordpress on Nginx and enable advanced caching
tags:
- nginx
- wordpress
- performance
---
[Wordpress](http://wordpress.org/) is one of the more popular blogging and CMS
platforms these days. It is written in PHP and therefore means it will run on
just about any host with a small startup cost. It is not my favourite platform
but it works well and people know it.

[Nginx](http://wiki.nginx.org/) is something that I really DO like so here is
how you install Wordpress on Nginx.

Before you can do the "5 minute install" of Wordpress you need to do the "2
minute setup" of Nginx. Here is a simple virtual host configuration for Nginx
that has some extra features:

    server {
      listen   80;
      server_name .example.com;
      access_log /var/log/nginx/example.com.access.log;

      set $domain $host;
      if ( $domain ~ "^(w{3}\.)?(.*)") {
        set $domain $2;
      }

      location / {
        root /var/www/vhost/$domain/htdocs;
        index  index.php index.html;

        # this serves static files that exist without running other rewrite tests
        if (-f $request_filename) {
          expires 30d;
          break;
        }

        set $supercache_file '';
        set $supercache_uri $request_uri;

        if ($request_method = POST) {
          set $supercache_uri '';
        }

        # Using pretty permalinks, so bypass the cache for any query string
        if ($query_string) {
          set $supercache_uri '';
        }

        if ($http_cookie ~* "comment_author_|wordpress|wp-postpass_" ) {
          set $supercache_uri '';
        }

        # if we haven't bypassed the cache, specify our supercache file
        if ($supercache_uri ~ ^(.+)$) {
          set $supercache_file /var/www/$domain/htdocs/wp-content/cache/supercache/$domain/$1index.html;
        }

        # only rewrite to the supercache file if it actually exists
        if (-f $document_root$supercache_file) {
          rewrite ^(.*)$ $supercache_file break;
        }

        # all other requests go to Wordpress
        if (!-e $request_filename) {
          rewrite . /index.php last;
        }
      }
      
      location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  /var/www/$domain/htdocs/$fastcgi_script_name;
        fastcgi_pass   127.0.0.1:8001;
        fastcgi_index  index.php;
      }

    }

There are few things here you should change. Obviously the domain references at
the top and then the absolute paths to the Wordpress installation. Also the
port that the PHP5 fast CGI services runs on (or the UNIX socket, which you can
use spawn-fcgi to create).

The other sections, those referring to 'supercache' are where the action
happens in Wordpress. It enables Nginx to serve up the cache files that
[wp-super-cache](http://wordpress.org/extend/plugins/wp-super-cache/) creates
directly. There is no need to have Wordpress serve them up. It also serves up
static files directly from your template directory too.

*[CGI]: Common Gateway Interface
*[CMS]: Content Management System
