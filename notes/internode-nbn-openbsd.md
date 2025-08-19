---
title: Internode, NBN and OpenBSD
date: 2019-09-10
keywords: [internode,nbn,pf,openbsd]
description: Connecting OpenBSD to the NBN via Internode
---

I (used to) run an [OpenBSD](https://www.openbsd.org) router on a [PC Engines
APU2](https://pcengines.ch/apu2.htm) for my home network connectivity.
[Internode](https://internode.on.net) provides their HFC uplink on VLAN tagged
2. The APU2 has 3 RJ45 ports, em{0,1,2} with `em0` being my uplink, configured
   in `/etc/hostname.em0`:

```sh
up
```

My home network is a dual-stack IPv4/6 with a prefix delegation provided by
Internode. The existing PPPoE configuration in `/etc/hostname.pppoe0` looked
like this:

```sh
inet 0.0.0.0 255.255.255.255 0.0.0.1 \
        pppoedev authproto pap \
        authname 'xxxx@internode.on.net' \
        authkey 'xxxx' \
        up
inet6 eui64
inet6 autoconf -autoconfprivacy
!/sbin/route add default -ifp pppoe0 0.0.0.1
!/sbin/route add -inet6 default -ifp pppoe0 fe80::%pppoe0 -priority 8
```

To communicate over the VLAN we need to create another `/etc/hostname.vlan2`
file with the following contents:

```sh
vnetid 2 parent em0 txprio 1
up
```

This uses the same ethernet port as before but with the `vnetid` set to 2 for
VLAN tagging. `txprio 1` also needed to be added to ensure the wrapping worked.

We can now update the PPPoE configuration use the VLAN:

```sh
inet 0.0.0.0 255.255.255.255 0.0.0.1 \
        llprio 1 mtu 1440 \
        pppoedev vlan2 authproto pap \
        authname 'xxxx@internode.on.net' \
        authkey 'xxxx' \
        up
inet6 eui64
inet6 autoconf -autoconfprivacy
!/sbin/route add default -ifp pppoe0 0.0.0.1
!/sbin/route add -inet6 default -ifp pppoe0 fe80::%pppoe0 -priority 8
```

There was a bit of trial and error getting the final settings but the `llprio 1`
parameter was required for anything to work and the `mtu 1440` was needed
after some SSH sessions failed to start.
