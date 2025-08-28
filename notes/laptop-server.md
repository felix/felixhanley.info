---
title: Using a laptop as a headless server
keywords: [debian,laptop]
date: 2025-08-28
---

Got an old laptop (i7 whatever) that I use as a server for CI/CD etc.

Install Debian blah blah...

## Prevent suspend on lid close

Edit `/etc/systemd/logind.conf` and set 'HandleLidSwitchExternalPower':

```conf
HandleLidSwitchExternalPower=ignore
```

## Turn off console

Update `/etc/default/grub` and add the 'CONSOLEBLANK' setting to the kernel 
parameters:

```sh
GRUB_CMDLINE_LINUX="consoleblank=60"
```

Run `update-grub`. Reboot.
