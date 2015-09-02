---
kind: article
date: 2010-01-14
updated_at: 2010-03-03
title: Simple Nginx config for Magento
description: A simple Nginx config for Magento Ecommerce using Magento 1.3
tags:
- magento
- nginx
---

**UPDATE:** Magento 1.4.0 has since been released and my new [configuration for
Nginx](/articles/magento-1-4-nginx-config/) is more recent.

Magento comes with rewrite rules designed for Apache and these work well out of
the box. They are actually located in .htaccess files in appropriate locations
so all that is often needed is to ensure the rewrite module is loaded and
Magento is told about it.

I have started using Nginx for my Magento hosting and constructing an
appropriate config file is very important. Of the resources spread around there
are some very convoluted Nginx configurations so a clean and simple
implementation was a goal. See how this goes:

    server {
      server_name example.com;
      root /var/www/vhost/example.com/htdocs;
      access_log /var/log/nginx/example.com.access.log main;
      index index.php;

      # set a nice expire for assets
      location ~* "^.+\.(jpe?g|gif|css|png|js|ico|pdf|zip|tar|t?gz|mp3|wav|swf)$" {
        expires    max;
        add_header Cache-Control public;
      }

      # if the file exists just serve it
      if (-f $request_filename) {
        break;
      }

      # the downloader has its own index.php that needs to be used
      location ~* ^(/downloader|/js|/404|/report)(.*) {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass php5;
        fastcgi_param  SCRIPT_FILENAME  $document_root$1/index.php$1;
        fastcgi_read_timeout 600;
      }

      # catch rewritten and standard URLs
      location ~* ^(/index.php)?(.*) {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass php5;
        fastcgi_param  SCRIPT_FILENAME  $document_root/index.php$1;
        fastcgi_read_timeout 600;
      }

    }

I pass all PHP calls to an upstream server called 'php5' which allows me to
configure it separately. I also do not have the fastcgi timeout as high as
Magento wants (18000 seconds) but high enough for some larger processes like
imports.

The important part is in the 'location' regular expressions and the fact that
there are two locations being caught. The first one catches URLs with
'downloader' in them which is for the Magento Connect extension manager. These
need to be passed to the index.php script in the downloader directory.

The final location section should catch all other URLs and pass them all to the
root index.php script. It also allows for URLs of the form '/index.php/admin/'
by recognising it in the expression.

This is being used with Nginx 0.7.64 and seems to work fine. Obviously if you
find an error or improvement I would like to know about it!

## Magento 1.4

The release candidate for Magento 1.4 is out and this config can be changed to
suit. Essentially you just remove the 'js', '404' and 'report' parts of the
location regular expression as these folders no longer exist. But things could
change!

