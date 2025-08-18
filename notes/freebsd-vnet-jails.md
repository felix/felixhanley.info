---
title: FreeBSD VNET jails
keywords: [freebsd,jails]
---

Using `epair` devices requires a bridge:

```rc
cloned_interfaces="bridge0"
ifconfig_alc0="up"
ifconfig_bridge0="addm alc0 up"
```

The name of the device in the jail has to be `epairXX` where XX is a number.

Remember to add the default route in the jail.

The relevant part of `jail.conf.d/name.conf`:

```sh
$bridge = "bridge0";
$gateway = "10.0.3.1";
$epair = "epair${id}";
$ip = "10.0.3.${id}/24";

vnet.interface = "${epair}b";
vnet;

exec.prestart  = "/sbin/ifconfig ${epair} create up";
exec.prestart += "/sbin/ifconfig ${epair}a up descr jail:${name}";
exec.prestart += "/sbin/ifconfig ${bridge} addm ${epair}a up";
exec.start     = '/bin/sh /etc/rc';
exec.start    += "/sbin/ifconfig ${epair}b ${ip} up";
exec.start    += "/sbin/route add default ${gateway}";
exec.stop      = '/bin/sh /etc/rc.shutdown';
exec.poststop  = "/sbin/ifconfig ${bridge} deletem ${epair}a";
exec.poststop += "/sbin/ifconfig ${epair}a destroy";
```
