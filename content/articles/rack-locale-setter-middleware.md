---
kind: article
date: 2010-04-23
title: Rack locale setter middleware
keywords: rack locale sinatra r18n
description: A Rack middleware for setting the locale for Sinatra (and others)
tags:
- sinatra
- rack
- ruby
- i18n
---

For a project I am currently working on I am using the nice i18n library
_[r18n](http://github.com/ai/r18n)_ which provides i18n for
[Rails](http://rubyonrails.org/), [Sinatra](http://sinatrarb.org/) and most
general Ruby projects. It also is reasonably ORM agnostic and so I am using it
quite easily with [DataMapper](http://datamapper.org/).

I have decided to use a subdomain to specify the locale rather than having it be
part of the path. So instead of this:

    http://example.com/en/foo/

I have this:

    http://en.example.com/foo/

I find this makes it easier by being able to specify relative paths everywhere
that don't need to have the locale played with. Switching the locale for the
site is also just a matter of changing the domain.

That said, r18n expects the locale to be placed in the 'params' array for
Sinatra and I thought a simple Rack middleware would do this well. So here it
is:


~~~ ruby
module Rack
  class LocaleSetter
    def initialize(app)
        @app = app
    end

    def call(env)
        req = Rack::Request.new(env)
        if m = req.host.match(/^(?:www\.)?([a-z]{2})\./)
        locale = m[1]
        else
        locale = 'en'
        end
        req.params['locale'] ||= locale
        @app.call env
    end
  end
end
~~~

Due to many peoples' habit of putting 'www' at the start of the domain, this
should account for _en.example.com_ **and** _www.en.example.com_. It also
allows for the locale to be specified in the query string. So
_en.example.com/foo?locale=th_ will set the locale to 'th'.
