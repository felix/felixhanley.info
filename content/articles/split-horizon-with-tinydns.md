---
title: Split horizon DNS with DJB's tinyDNS
description: How to implement split horizon DNS using the djbdns collection of tools
date: 2011-02-22
tags:
  - djbdns
  - dns
---

## What is 'split horizon' DNS?

Split horizon DNS basically means that one group of hosts receive different DNS
addresses to another group. Some of the uses of a split horizon DNS setup
include:

- serve private addresses to your internal network and public IP addresses to
  the rest of the Internet
- hide some hosts from the Internet while still making them available to your
  network
- use different mail routes and hosts for your local network while still
  providing a public facing mail service
- do all sorts of crazy division among your network!

My motivation for setting this up is keep a number of hosts purely internal
such as database servers and yet be able to manage them centrally using DNS to
enable moving things around a little easier.

## An example network

Imaging the following hypothetical setup:

3 physical servers, a.example.com, b.example.com and c.example.com

_a.example.com_
- private IP address 192.168.1.1
- publicIP address 1.1.1.1
- nameserver for example.com and example.net
- a web server

_b.example.com_
- private IP address 192.168.1.2
- publicIP address 1.1.1.2
- nameserver for example.com and example.net
- a mail server

_c.example.com_
- private IP address 192.168.1.3
- publicIP address 1.1.1.3
- internal database server for example.com

These are the basic steps to produce this setup:

- Install tinyDNS services on both _a_ and _b_ listening on their public IP
  addresses. This will answer DNS queries from the Internet for the domains
  example.com and example.net.
- Install another tinyDNS instance on both _a_ and _b_ listening on each host's
  loopback interface, 127.0.0.1. This will answer DNS queries from localhost
  (obviously) for example.com and example.net. These instances of tinyDNS can
  use the same data store as the public facing instances.
- Install dnscache instances on both _a_ and _b_ listening on each host's
  private IP addresses (192.168.1.0/24). These will answer and cache all DNS
  queries for the internal network (currently 3 hosts). It will talk to the
  'localhost' instances of tinyDNS for requests about example.com (and
  example.net if you want it to) but talk to the Internet (root name servers
  initially) for all other queries.
- configure all hosts to use _a_ and _b_ as their nameservers
- create both public and private entries in the tinyDNS data stores

## tinyDNS's method of separating internal and external DNS entries

The tinyDNS data file has all the usual record types that can be entered and
for each record type there are the usual attributes such as the IP address,
record type and time-to-live. So a typical A record entry would look like
this:

    =a.example.com:1.1.1.1:3600

Which would create an A record showing 1.1.1.1 as the address of a.example.com
with a TTL of 1 hour. (see [the complete data file
format](http://cr.yp.to/djbdns/tinydns-data.html)).

But there is one attribute (in version 1.04 and above) that can be used to
create internal and external address (or any number of groups). The last
attribute for any record entry in the data file specifies which group this
record should belong to. The groups are also define along with the source IP
addresses prefix that these entries should be given to as an answer. An
example:

    %in:192.168
    %ex

This says that all queries that come from IP addresses that _begin_ with
192.168 (so our example networks _internal_ address space) with be supplied
with records that are marked with 'in' and other request will be supplied with
entries marked with 'ex'. So we can have the following:

    +db.example.com:1.1.1.3:::ex
    +db.example.com:192.168.1.3:::in

This would provide a different address for internally originating requests as
apposed to external ones.

See [here for more
details](http://cr.yp.to/djbdns/tinydns-data.html#differentiation).

## Why so many services?

Now some astute readers may be wondering why we need the loopback listening
tinyDNS instances and not just get the dnscache instances to talk to the
public facing tinyDNS instances directly. The reason is that the location
entries in the tinyDNS data file (those beginning with '%' above) only allow
an IP _prefix_, not a range or a list of hosts. So for a situation where you
have a number of hosts where the private addresses that are supplied are part
of a large network block which other hosts belong, the IP prefix is not
useful.

This is the case with Linode where I have a number of VPSs which have
non-consecutive private IPs which are in the same network block as other
customers. I don't want other people to be able to resolve my internal IP
addresses.

The only way I could think to get around this is to set the source location of
internal addresses to localhost and then create another instance of tinyDNS
listen for those. Then the dnscache instances listen on the internal private
addresses but use the 'localhost' tinyDNS services for _some_ requests.


