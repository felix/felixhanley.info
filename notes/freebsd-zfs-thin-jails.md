---
title: FreeBSD thin jails using zfs snapshots
keywords: [freebsd,jails]
date: 2025-09-05
---

This is mostly documented already at 
<https://docs.freebsd.org/en/books/handbook/jails/#thin-jail> but that might go 
away?!

Done once per release to create the base:

```sh
# export FBSDREL=14.3-RELEASE
# zfs create -p "zroot/jails/templates/$FBSDREL"
# fetch "https://download.freebsd.org/ftp/releases/amd64/amd64/$FBSDREL/base.txz" -o "/usr/local/jails/media/$FBSDREL-base.txz"
# tar -xf "/usr/local/jails/media/$FBSDREL-base.txz" -C "/usr/local/jails/templates/$FBSDREL" --unlink
# cp /etc/resolv.conf "/usr/local/jails/templates/$FBSDREL/etc/resolv.conf"
# cp /etc/localtime "/usr/local/jails/templates/$FBSDREL/etc/localtime"
# freebsd-update -b "/usr/local/jails/templates/$FBSDREL/" fetch install
# zfs snapshot "zroot/jails/templates/$FBSDREL@base"
```

To create a jail based on that release:

```sh
# zfs clone "zroot/jails/templates/$FBSDREL@base" zroot/jails/containers/thinjail
```

Then configure the jail in `/etc/jail.conf`.
