---
kind: article
title: Nginx virtual host config
date: 2009-01-16
keywords: nginx virtual hosting config
description: Simple configuration for virtual hosts using Nginx
tags:
- nginx

---
This has been working for me for some time now. It enables virtual hosts to be
dynamically added to your server, serve PHP files and set expires on assets.

There is no need to set up directories for www.example.com in addition to
example.com, this does the rewrite for you.

    server {
      listen 80;
      server_name _;
      server_name_in_redirect off;

      # remove www. off the front
      set $domain $host;
      if ( $domain ~ "^(w{3}\.)?(.*)") {
        set $domain $2;
      }

      root /var/www/vhost/$domain/htdocs;

      location / {
        root /var/www/vhost/$domain/htdocs/;
        index index.html index.php;
      }


      # serve static files directly
      location ~* ^.+.(jpg|jpeg|gif|css|png|js|ico|html)$ {
        expires 30d;
      }


      location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_param  SCRIPT_FILENAME  /var/www/vhost/$domain/htdocs/$fastcgi_script_name;
        fastcgi_pass   127.0.0.1:8001;
        fastcgi_index  index.php;
      }

    }
