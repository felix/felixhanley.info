---
title: FreeBSD on PCEngines APU2
keywords: [freebsd,hardware]
---

This is my router.

- mini-memdisk if have internet connection since all has to be fetched
- Press F10 at boot to select boot media
- At FreeBSD boot menu select '5' to change to console
- Install using BIOS disk mode (for APU2)
- After install and before rebooting drop to shell to configure

Add this to `/boot/loader.conf` to enable console on boot:

```
boot_serial="YES"
console="comconsole"
comconsole_speed="115200"
```
