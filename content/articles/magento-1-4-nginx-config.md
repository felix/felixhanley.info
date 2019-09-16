---
kind: article
date: 2010-03-03
updated_at: 2010-05-20
title: 'Magento 1.4.0 Nginx configuration'
keywords: magento nginx config
description: 'An Nginx config for Magento 1.4.0'
tags:
- magento
- nginx
---

I have migrated my Magento installations to the new stable version and this is
my current Nginx configuration.

This is in a configuration file called _conf.d/magento.conf_:

    # not sure if this is needed but if the file exists just serve it
    if (-f $request_filename) {
      break;
    }

    # this should catch everything
    # if not found then it directs to the named location
    location / {
      index index.php;
      error_page 404 = @magento;
    }

    # this has the catcher for the downloader, the rest to the index
    location @magento {
      rewrite ^/downloader/(.*)$ /downloader/index.php$1;
      rewrite ^(.*)$ /index.php$1;
    }

I also have a separate configuration file for static domains called
*conf.d/static_domain.conf* that looks a little like this:

    # no need to log
    access_log  off;

    # set a nice long expires for all content and enable caching
    location / {
      expires max;
      add_header Cache-Control public;
    }

This enables me to reuse the configuration settings nicely. These are then
both combined into the virtual host configuration like this:

    server {
      server_name example.com www.example.com;
      root /var/www/vhost/example.com/htdocs;
      access_log /var/log/nginx/example.com.access.log main;
      index index.php;

      include conf.d/magento.conf;

      location ~* ^(.+\.php)(.*) {
        include conf.d/php5.conf;
      }
    }

    server {
      listen 1.1.1.1:443 default ssl;
      server_name secure.example.com;
      root /var/www/vhost/example.com/htdocs;
      access_log /var/log/nginx/example.com.access.log main;
      index index.php;

      ssl_certificate conf.d/your-certificate.pem;
      ssl_certificate_key conf.d/your-certificate-key.pem;

      include conf.d/magento.conf;

      location ~* ^(.+\.php)(.*) {
        include conf.d/php5.conf;
        fastcgi_param HTTPS on;
      }
    }

    server {
      # have as many 'static' servers as you need
      server_name static.example.com media.example.com;
      root /var/www/vhost/example.com/htdocs;

      include conf.d/static_domain.conf;
    }

The included php5.conf file looks a little like this:

    include /etc/nginx/fastcgi_params;
    fastcgi_index                index.php;
    fastcgi_connect_timeout      60;
    fastcgi_send_timeout         180;
    fastcgi_read_timeout         180;
    fastcgi_buffer_size          128k;
    fastcgi_buffers              4 256k;
    fastcgi_busy_buffers_size    256k;
    fastcgi_temp_file_write_size 256k;
    fastcgi_intercept_errors     on;
    fastcgi_param                SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_split_path_info      ^(.+\.php)(.*)$;
    fastcgi_param                PATH_INFO $fastcgi_path_info;
    fastcgi_pass                 php5;

Notice the static domain's root is the same as the main domain but it will only
serve files that actually exist, nothing is passed to PHP etc. This obviously
then requires that you set up Magento's verious URL settings to serve your CSS,
javascript and images from this static domain.

This cut a couple of seconds off a default install's page loading time and can
further be improved by combining javascript and CSS assets.
