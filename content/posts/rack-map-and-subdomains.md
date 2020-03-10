---
kind: article
date: 2010-07-04
title: Rack map and subdomains
keywords: rack locale sinatra subdomain nginx
description: "Using rack's map abilities for locale based subdomains"
tags:
- rack
- ruby
- nginx
aliases:
- /articles/rack-map-and-subdomains/
---

The situation: you are using subdomains for locales such as _en.example.com_
and _th.example.com_. Your app is Rack based and is behind Nginx with a
'wildcard' *server_name* directive such as:

    server {
      server_name .example.com;
      ...
    }

You are also using Rack's map abilities to have two different applications
mounted on different paths on your domain. This could be done like this in your
_config.ru_ file:

```ruby
    map '/users' do
      run Example::Admin
    end

    map '/' do
      run Example::Public
    end
```


## The problem

If the URL _http://th.example.com_ is hit, Nginx will set
'HTTP_HOST' as 'th.example.com' but 'SERVER_NAME' will be 'example.com'. What
his means is that tests within Rack fail and result in neither of the above
'maps' matching so a 404 is returned.

## A solution

In Rack apps you are able to modify the environment. This means that _one_ way
to fix this is to simply set the environment's' SERVER_NAME' to equal
'HTTP_HOST' by including something like this in your _config.ru_ file, before
your map calls:

```ruby
    module Rack
      class Blah
        def initialize app
          @app = app
        end

        def call env
          env['SERVER_NAME'] = env['HTTP_HOST']
          @app.call env
        end
      end
    end
    use Rack::Blah

    map '/users' do
    ...etc.
```
