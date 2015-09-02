---
kind: article
date: 2009-05-01
title: "'www' subdomain improves site usability and performance"
keywords: nginx, subdomain, cache, redirect
description: "Usage of the 'www' subdomain can improve your site's performance and usability"
tags:
- www
- performance
---
Does it really matter whether your website has the 'www' prefix on the domain?
Is it just historical? Can it affect performance?

**UPDATE:** Have a look at a more [recent post that explains how you might
implement some of these
points](/articles/setting-up-subdomain-cookies-google-analytics-and-nginx-for-faster-assets/).

## Subdomains

The 'www' on the front of the domain, as in '**www**.example.com' is an example
of a subdomain. The Domain Name System is structured so that subdomains express
some type of dependence upon the base domain. For example, _mail.example.com_
shows that the domain 'mail' is dependent, or part, of the domain 'example.com'
and that the domain 'example' is actually part of the 'com' domain.

It has become quite popular of late to have websites hosted on domains without
a 'www' subdomain such as  http://**example.com**/ rather than
http://**www.example.com**/. Some even redirect visitors from the 'www'
subdomain to the base domain name. Because of this trend it could be
detrimental to provide access to your website via the 'www' subdomain only. You
may, though, choose to redirect visitors to the 'www' upon landing on the base
domain, its up to you. So why use the 'www' subdomain?

## User expectation

Recently I have dealt with some clients that are not the most savvy when it
comes to their 'Internets'. It reminded me that the common perception is still
that websites _need_ to have 'www.' appended to the domain name in order for it
to load. While this may be correct for many websites it is not a rule. However,
that is often what the user expects. It may be a "given" that the 'www'
subdomain will load the main site, it is not always the case. Best to check.

Historically, many domains were set up to describe the purpose of the machine
or network that the subdomain pointed to. So _**ftp**.example.com_ would
provide FTP services, _**mail**.example.com_ would provide mail service and
_**www**.example.com_ provided WWW or web services.

So by enabling the 'www' subdomain you meet user expectation and it keeps your
subdomain schema nice and orderly.

## Cookie domains

When a cookie is set in the client's browser, it is set with a domain, usually
the current subdomain of the page that is setting it. This stops cookies being
read by any other sites. There are some restrictions, however, as to which
sites, or even subdomains can read which cookies. This is generally how it
works:

- a cookie set for **example.com** can be read by example.com and any
  subdomains, ie foo.example.com, www.example.com etc. It cannot be read by
  foo.com or any other domain that is not _dependent_ on example.com.
- a cookie set for **.example.com** (notice the dot) can be read by any
  subdomain of example.com but not by example.com (notice the lack of dot).
- a cookie set for **www.example.com** can be read by www.example.com and any
  subdomain but NOT by example.com, foo.example.com or static.example.com

How could this be advantageous? Well notice the last example. A cookie set by
www.example.com cannot be read by a different subdomain of the base domain. We
can use this to reduce the amount of traffic going between the client and
server for certain request. How?

When a cookie is set on a client's browser, a request to any subdomain that the
cookie is valid for will make the browser send the cookies along with the page
request. For most cookies this extra traffic is negligible but some cookies get
large, and on complex sites with many images and assets, this extra data can
add up.

Also, some/many proxy servers or HTTP accelerators like
[Varnish](http://varnish.projects.linpro.no/) by default do not cache page
content that has been requested with cookies set. So if you set a cookie for
the domain **example.com** and then server all your content from
**www.example.com** or even **example.com**, varnish will not be caching the
pages (by default, it can be changed). By setting cookies for
**www.example.com** and then serving static data (the stuff you want Varnish to
cache anyway) from a separate subdomain like static.example.com, the cookies
wont be valid, wont be set, and Varnish will cache them. This will result in a
much faster site.

*[FTP]: File Transfer Protocol
*[WWW]: World Wide Web
