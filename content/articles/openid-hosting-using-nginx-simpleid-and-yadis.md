---
kind: article
date: 2009-02-09
title: Hosting your own OpenID with Nginx, SimpleID and Yadis
keywords: nginx openid simpleid yadis delegate
description: How to host your own OpenID with Nginx and SimpleID
tags:
- nginx
---
Just updated my OpenID hosting on seconddrawer.com.au to make it that little
bit smoother. In the past I had been using the MyPhpId script to do this, I
recently switched to [SimpleID](http://simpleid.sourceforge.net/) for no other
reason than to try it out. I also wanted to clean up the delegation stuff.

Installing SimpleID is easy. Follow the installation step ensuring the correct
directory locations and cache permissions. Setup your identity using 'sreg'
extensions if you want too.

Usually to setup your delegation for OpenID you need to include two headers in
your html page like this:

    <link rel="openid.server" ref="http://seconddrawer.com.au/openid/" />
    <link rel="openid.delegate" ref="http://seconddrawer.com.au/" />

The first link is where the openid server is located. Naturally this is my own.
The second link is what I want my OpenID URL to be and what the server knows me
as. This is the URL used in my identity file.

While this is fine, it can do with some improvements. Firstly, it is
[recommended to seperate the OpenID v1 and v2
links](http://wiki.openid.net/OpenID-Authentication-2_0-Errata#WhenusingHTMLbaseddiscoveryseparateoutOpenID11andOpenID20links)
so my links then look like this:

    <link rel="openid2.provider" href="http://seconddrawer.com.au/openid/" />
    <link rel="openid2.local_id" href="http://seconddrawer.com.au/" />
    <link rel="openid.server" href="http://seconddrawer.com.au/openid/" />
    <link rel="openid.delegate" href="http://seconddrawer.com.au/" />

This can also be improved. This means that to find the delegate information a
client has to download the entire page just for this small amount of
information. [Yadis](http://yadis.org/wiki/What_is_Yadis) is a service
discovery system to allow easy discovery of the protocol used. Primarily used
for single sign on such as OpenID. So here we can provide a Yadis file to speed
up the authentication process.

It is quite simple to convert the link based system above into a static Yadis
file that can be served up to clients wanting the delegate information. My
Yadis file looks like this:

    <?xml version="1.0" encoding="UTF-8"?>
    <xrds:XRDS xmlns:xrds="xri://$xrds" xmlns="xri://$xrd*($v*2.0)">
        <XRD>
            <Service priority="10">
                <Type>http://specs.openid.net/auth/2.0/signon</Type>
                <URI>http://seconddrawer.com.au/openid/</URI>
                <LocalID>http://seconddrawer.com.au/</LocalID>
            </Service>
            <Service priority="20" xmlns:openid="http://openid.net/xmlns/1.0">
                <Type>http://openid.net/signon/1.0</Type>
                <URI>http://seconddrawer.com.au/openid/</URI>
                <openid:Delegate>http://seconddrawer.com.au/</openid:Delegate>
            </Service>
        </XRD>
    </xrds:XRDS>

This file needs to be served as an 'application/xrds+xml' mime type. Now any
client wanting this information will have an accept header set accordingly so
with a simple rewrite in my Nginx config file I can serve this information
quickly.

    if ($http_accept ~* application/xrds\+xml) {
      rewrite ^ /yadis.xrdf break;
    }
