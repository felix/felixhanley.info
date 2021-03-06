---
kind: article
date: 2010-03-11
lastmod: 2011-03-07
title: 'tinydnsdyn - Dynamic DNS for DJBDNSs tinydns'
description: tinydnsdyn is a script to enable dynamic DNS for DJB's tinydns DNS server
tags:
- tinydnsdyn
- python
- djbdns
- dns
aliases:
- /articles/tinydnsdyn-dynamic-dns-for-djbdns/
---

A simple Python script to enable dynamic DNS services for the tinyDNS DNS
software.

## Why tinydnsdyn

- [djbdns](http://cr.yp.to/djbdns.html) is a simple, fast DNS server.
- I like the 'DJB way' (although I use '[runit](http://smarden.org/runit/)' instead of 'daemontools').
- Dynamic DNS is handy.

[Tinydnsdyn](/projects/tinydnsdyn/) is a simple script to enable dynamic DNS
for the DNS server written by Dan Bernstein, tinydns. It fills a small hole
that was missing on one of my previous jobs and was written quickly and roughly
to fill that void.

## Features?!

It is pretty simple but here are some of its features:

- It uses Python which is available on most \*nix servers.
- It is designed to be run using daemontools (or similar) which if you are
  running tinydns then you will most likely already have that up and running.
- It works much like dyndns.com's update service so you should be able to use
  its clients also.
- Simple logging
- You can use it from your OpenWRT box

So see how it fits you.

## Getting it

Code can be grabbed from the [tinydnsdyn Git
repository](http://src.userspace.com.au/tinydnsdyn).
