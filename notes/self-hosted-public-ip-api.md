---
title: Self-hosted public IP API
date: 2020-03-26
keywords: [self-hosted]
description: Implementing a self-hosted IP service
---

Self hosting a 'whatismyip' service. Two parts are required, DNS resolution, and 
the API endpoint.

## API endpoint

With Caddy:

```caddyfile
http://ip.userspace.com.au, http://ip6.userspace.com.au, 
http://ip4.userspace.com.au,
https://ip.userspace.com.au, https://ip6.userspace.com.au, https://ip4.userspace.com.au {
    header @acceptsjson Content-Type application/json
	header Cache-Control no-store
	respond @acceptsjson 200 {
        body `{"ip":"{remote_host}"}`
	}
	respond {remote_host} 200
```

Or with nginx:

```nginx
server {
	server_name ip.example.com ip6.example.com ip4.example.com;

	location / {
		add_header Cache-Control no-store;

		if ($http_accept = 'application/json') {
			add_header Content-Type application/json;
			return 200 "{ \"ip\": \"$remote_addr\" }";
		}

		default_type text/plain;
		return 200 $remote_addr;
	}

}
```

The `server_name` ensures that we can answer requests to the 3 subdomains, one
for generic entries which will return IP6 or IP4, and then one for each IP
version that will return an appropriate response.

The location block also allows for both a JSON and a plain text response which
means a browser will see simple text but a programmatic client can extract
JSON. Very handy. Either way the response grabs the built in Nginx variable
`$remote_addr` which will be the public IP address we are after, either IP4 or
IP6.

## DNS resolution

To resolve the endpoints above we want an entry for each of the 3 server names:
`ip.example.com`, `ip4.example.com` & `ip6.example.com`.

The IP version endpoints will need a corresponding A or AAAA record for IP4 and
IP6 respectively:

```bind
;; BIND zone file extract
ip		CNAME	example.com ;; 
ip4		A	x.x.x.x ;; IP4 address of nginx
ip6		AAAA	x:x:x:x:x:x:x:x ;; IP6 address of nginx
```

This enables any client to use the generic endpoint `ip.example.com` and
dual-stack clients to use an endpoint other than their default resolution bias.
This works because CNAME records are used by both IP4 & IP6 and the
`ip4.example.com` and `ip6.example.com` records can only be resolved by IP4 and
IP6 capably clients respectively.

So now the following is possible (from a dual-stack network):

```sh
$ ifconfig |grep inet
	inet6 ::1 prefixlen 128
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x2
	inet 127.0.0.1 netmask 0xff000000
	inet6 fe80::2a16:adff:fe76:a485%lagg0 prefixlen 64 scopeid 0x4
	inet6 2001:44b8:dead:beef:2a16:adff:fe76:a485 prefixlen 64 autoconf
	inet 10.0.1.197 netmask 0xffffff00 broadcast 10.0.1.255

$ curl -4 ip.example.com
14.201.108.199

$ curl -6 ip.example.com
2001:44b8:dead:beef:2a16:adff:fe76:a485

$ curl ip4.example.com
14.201.108.199

$ curl -H 'Accept: application/json' ip.example.com
{ "ip": "2001:44b8:dead:beef:2a16:adff:fe76:a485" }
```
