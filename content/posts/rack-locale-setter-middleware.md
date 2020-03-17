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
aliases:
- /articles/rack-locale-setter-middleware/
---

# Goal

To use a sub-domain to specify the locale rather than having it be
part of the path. So instead of this:

    http://example.com/en/foo/

we want this:

    http://en.example.com/foo/

This makes it easier by being able to specify relative paths everywhere
that don't need to have the locale played with. Switching the locale for the
site is also just a matter of changing the domain.

That said, [r18n](http://github.com/ai/r18n) expects the locale to be placed in
the 'params' array for Sinatra so a simple Rack middleware would do this well.
So here it is:


``` ruby
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
```

Due to many peoples' habit of putting 'www' at the start of the domain, this
should account for _en.example.com_ **and** _www.en.example.com_. It also
allows for the locale to be specified in the query string. So
_en.example.com/foo?locale=th_ will set the locale to 'th'.
