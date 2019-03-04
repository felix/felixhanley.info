---
title: tinydnsdyn for tinydns
linktitle: tinydnsdyn
kind: article
description: "Dynamic DNS for DJB's tinydns DNS server"
tags:
- tinydnsdyn
- djbdns
- python
- dns
menu:
  main:
    parent: projects
    weight: 40
---

This is a basic dynamic client and server for the djbdns DNS server 'tinydns'
by Dan Bernstein.

<!--more-->

## Requirements

* Administrative access to a server running tinydns and hence
  daemontools or similar
* Administrative access to a \*nix box on you local network
* Python (version 2!) installed on both client and server
* An open port on the server's firewall

## Installation

To install the server code:

* Copy script and all files onto your server (i.e. /etc/tinydnsdyn/)

* The supplied 'run' script is tailored for debian/ubuntu and may need to be
   changed.

* You can add dynamic DNS entries to your main data file or alternatively use
a seperate file for dynamic entries. An existing entry in the tinydns data file
should already exist. This script will NOT add one. Only those hosts listed
(with prefixes '+' and '=') are able to update their entries.

For example:

~~~
+groucho.example.com:192.168.0.2:3360
+groucho.example.com:192.168.0.2
=groucho.example.com:192.168.0.2:60
+*.groucho.example.com:192.168.0.2:60
+*.groucho.example.com:192.168.0.2
~~~

will all get updated if the host groucho.example.com does a request.

* Create a password file. This is of the format created by Apache's htpasswd
   and consists of one user per line in the following format:

~~~
username:crypted hash:optional,list,of,domains
~~~

- The script will run 'make' in the data directory. This enables you to
   concatenate your data files and whatever else before they are compiled. For
   instance, you may need to combine all your primary and seconary zones and
   then add the dynamic hosts before compiling.

   An example Makefile is included with some ideas.

- Start the service by symlinking this directory into your svscan directory
   (i.e. "ln $(pwd) /etc/service/" ).


The service operates over HTTP and should be reasonably close to the service
operated by DynDns.com having the following request format:

~~~
http://username:password@yourdnsserver.com/?hostname=yourhostname&myip=optionaladdress
~~~

The only required parameter is the hostname you wish to change. This can be a
comma separated list of hostnames to update. The IP address will be determined
automatically if the 'myip' parameter is missing.

The response codes are taken from here (not all of them):

<http://www.dyndns.com/developers/specs/return.html>

The Python code is basic and inefficient but it should work. I take no
responsibility for anything that may happen to any of your machines.
That said, please let me know if there are any issues.

## Source

It can be downloaded from [my Git
repository](http://git.userspace.com.au/tinydnsdyn/) or from
[GitHub](https://github.com/felix/tinydnsdyn).
