---
title: Diagnosing icmp unreach response
date: 2021-06-25
keywords: FreeBSD networking syslog
description: Diagnosing icmp unreach response
tags:
  - FreeBSD
  - networking
---

On a FreeBSD box I recently started getting a bunch of the following messages:

```console
+Limiting icmp unreach response from 1767 to 200 packets/sec
+Limiting icmp unreach response from 3614 to 200 packets/sec
+Limiting icmp unreach response from 3874 to 200 packets/sec
+Limiting icmp unreach response from 4600 to 200 packets/sec
+Limiting icmp unreach response from 4453 to 200 packets/sec
+Limiting icmp unreach response from 4734 to 200 packets/sec
+Limiting icmp unreach response from 5235 to 200 packets/sec
+Limiting icmp unreach response from 5854 to 200 packets/sec
+Limiting icmp unreach response from 6158 to 200 packets/sec
+Limiting icmp unreach response from 3719 to 200 packets/sec
+Limiting icmp unreach response from 331 to 200 packets/sec
+Limiting icmp unreach response from 1810 to 200 packets/sec
+Limiting icmp unreach response from 3153 to 200 packets/sec
```

...etc.

## Diagnosing the cause

From the logs we can see that something is sending packets (via UDP or TCP) to
a port that is closed.

The first step then, is to view some of those ICMP packets to determine the
protocol and port. Using tcpdump we need to capture packets that are ICMP and of type "destination unreachable and code "port unreachable".

```console
$ man icmp
ICMP(4)                FreeBSD Kernel Interfaces Manual                ICMP(4)

NAME
     icmp – Internet Control Message Protocol

...

Num  Abbrev.         Description
0    echorep         Echo reply
3    unreach         Destination unreachable

...

Num  Abbrev.         Type        Description
0    net-unr         unreach     Network unreachable
1    host-unr        unreach     Host unreachable
2    proto-unr       unreach     Protocol unreachable
3    port-unr        unreach     Port unreachable

...

```

we see it maps to ICMP type 3, code 3. So the `tcpdump` command to use is then:


```console
# tcpdump -ni em0 "icmp[0]=3 and icmp[1]=3"

tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on em0, link-type EN10MB (Ethernet), capture size 262144 bytes

12:49:51.182216 IP 10.0.1.2 > 10.0.1.1: ICMP 10.0.1.2 udp port 514 unreachable, length 269
12:49:51.182757 IP 10.0.1.2 > 10.0.1.1: ICMP 10.0.1.2 udp port 514 unreachable, length 130
12:50:01.353951 IP 10.0.1.2 > 10.0.1.1: ICMP 10.0.1.2 udp port 514 unreachable, length 254
12:50:01.354087 IP 10.0.1.2 > 10.0.1.1: ICMP 10.0.1.2 udp port 514 unreachable, length 253
```

So we can see that a syslog service (UDP port 514) is sending to a closed port. The _recipient_ of the `unreach` ICMP messages captured above indicates that host has an IP of `10.0.1.1`.

As it turns out, my syslog config was not allowed to receive logs from the peer `10.0.1.1`. An updated line in `rc.conf` fixed that:

```conf
syslogd_flags="-b 127.0.0.1 -b 10.0.1.2 -a 10.0.0.0/16"
```
