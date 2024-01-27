---
title: Making Jumbo frames play nicely with others
date: 2021-01-07
keywords: jumbo frames, vlan
description: Mixing standard and jumbo frames in a LAN
tags:
- networking
- performance
---

I am beginning to settle on DigiKam as a shared photo & image organiser on
multiple devices (FreeBSD & macos) but the speed of pulling the larger files
over NFS was making it a little tedious. RAW files are particularly slow to
work with.

So to improve this situation I have enabled "jumbo frames" on a segment of the
network. These are Ethernet frames larger than the standard 1500 bytes, in my
case they are 9000 bytes.

These are the results, between the same two machines:

With standard MTU (1500)

```sh
$ iperf3 -c 10.0.1.1
Connecting to host 10.0.1.1, port 5201
[  5] local 10.0.1.167 port 50210 connected to 10.0.1.1 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  31.8 MBytes   267 Mbits/sec    0    100 KBytes
[  5]   1.00-2.00   sec  39.6 MBytes   332 Mbits/sec    0    167 KBytes
[  5]   2.00-3.00   sec  43.3 MBytes   363 Mbits/sec    0    243 KBytes
[  5]   3.00-4.00   sec  44.7 MBytes   375 Mbits/sec    0    297 KBytes
[  5]   4.00-5.00   sec  47.2 MBytes   396 Mbits/sec    0    361 KBytes
[  5]   5.00-6.00   sec  49.6 MBytes   416 Mbits/sec    0    423 KBytes
[  5]   6.00-7.00   sec  43.1 MBytes   362 Mbits/sec    0    488 KBytes
[  5]   7.00-8.00   sec  48.2 MBytes   405 Mbits/sec    0    553 KBytes
[  5]   8.00-9.00   sec  49.8 MBytes   418 Mbits/sec    0    621 KBytes
[  5]   9.00-10.00  sec  50.0 MBytes   420 Mbits/sec    0    685 KBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec   447 MBytes   375 Mbits/sec    0             sender
[  5]   0.00-10.00  sec   444 MBytes   372 Mbits/sec                  receiver

iperf Done.
```

With Jumbo frames (9000)

```sh
$ iperf3 -c 10.0.5.1
Connecting to host 10.0.5.1, port 5201
[  5] local 10.0.5.3 port 43754 connected to 10.0.5.1 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  33.2 MBytes   278 Mbits/sec    0    105 KBytes
[  5]   1.00-2.00   sec  68.8 MBytes   577 Mbits/sec    0    184 KBytes
[  5]   2.00-3.00   sec  96.0 MBytes   805 Mbits/sec    0    245 KBytes
[  5]   3.00-4.00   sec   113 MBytes   945 Mbits/sec    0    315 KBytes
[  5]   4.00-5.00   sec   114 MBytes   954 Mbits/sec    0    384 KBytes
[  5]   5.00-6.00   sec   117 MBytes   984 Mbits/sec    0    454 KBytes
[  5]   6.00-7.00   sec   117 MBytes   985 Mbits/sec    0    507 KBytes
[  5]   7.00-8.00   sec   117 MBytes   981 Mbits/sec    0    577 KBytes
[  5]   8.00-9.00   sec   117 MBytes   985 Mbits/sec    0    647 KBytes
[  5]   9.00-10.00  sec   117 MBytes   981 Mbits/sec    0    725 KBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  1010 MBytes   847 Mbits/sec    0             sender
[  5]   0.00-10.00  sec  1009 MBytes   846 Mbits/sec                  receiver

iperf Done.
```

846Mbits/s compared to 372Mbits/s is a nice improvement, and it is noticeable
in applications.

You may notice that they are on a different subnet. The 10.0.5.0/24 subnet is
separated via a VLAN (id 5 in this case). This allows a FreeBSD NAS to serve
NFS exports on both subnets but on the 10.0.5.0/24 to have a MTU of 9000.

Running VLANs and jumbo frames will require the intermediate hardware to
support it. I am using a TP-Link TL-SG108PE which provides 802.1Q VLAN
configuration for individual ports. Another "dumb" switch I have used does not
support VLANs nor even large Ethernet frames so it cannot be used in those
subnets.

## Configuration

### FreeBSD

The FreeBSD server has the following permanent configuration:

```
ifconfig_alc0="mtu 9000"
vlans_alc0="5"
ifconfig_alc0_5="inet 10.0.5.2/24"
```

which is the equivalent of the following commands:

```sh
ifconfig alc0 mtu 9000
ifconfig alc0.5 create vlan 5 vlandev alc0 inet 10.0.5.2/24
```

Note that the VLAN virtual device inherits the MTU of the underlying physical
device. In my case the `alc0` is a secondary interface that is only on the VLAN
subnet.

### Linux

On a Linux host (where the above iperf3 runs were made) the following `ip`
commands are used (enp2s0 being the physical device):

```sh
ip link set enp2s0 mtu 9000
ip link add link enp2s0 name enp2s0.5 type vlan id 5
ip addr add 10.0.5.3/24 dev enp2s0.5
```

Since the OS is voidlinux in this case the commands are simply added to
`/etc/rc.local` for persistence.

### Macos

Sadly the USB-C dongle I am using for Ethernet connectivity does not handle
Ethernet frames larger than 1500 so there is no point joining the VLAN. But at
least the NFS server is still available on the untagged network with standard
frame sizes.

### NFS & Samba

By default NFS clients seemed to negotiate with a rsize and wsize of 131072
using NFSv3 (because it is simpler) so they are already larger than the MTU
being used. Adjusting this smaller and larger seemed to make no difference to
the rate of reading and writing, generally 120MB/s and 90MB/s respectively.
