---
title: BSD on HP Spectre x360
date: 2016-08-09
keywords: freebsd dragonfly bsd hp spectre audio
description: Getting things working on an HP Spectre x360
tags:
- hardware
- bsd
- linux
aliases:
- /articles/bsd-on-hp-spectre-x360/
---

Current employment contract gives me an HP Spectre x360. It has an Intel i7 and
came with Windows 8.1 installed.

Windows was promptly removed. DragonflyBSD would have been my OS of choice but
it lacks ports for VirtualBox which I need at the moment. Debian ran fine
except for some minor things (never once shutdown cleanly and just general
systemd stupidness).

Recently FreeBSD gurus have started work on updated Intel i915 support so this
is what I am running now.

Here are some things to note:

## Specs

- Intel i7
- Intel Wireless 7265
- Intel HD Graphics 5500
- Intel Broadwell-U Audio Controller
- RTS5227 PCI Express Card Reader

## Networking

It has a USB dongle for ethernet which worked without issue. For wireless the iwm
driver seems to be fine with the correct firmware loaded in
`/boot/loader.conf`, though test it first:

    if_iwm_load="YES"
    iwm7265fw_load="YES"

## Graphics

FreeBSD's i915 support is a little old in STABLE so I am running a 12-CURRENT
world with a kernel based on
https://github.com/FreeBSDDesktop/freebsd-base-graphics/tree/drm-next-4.6 which
run quite well considering it is the bleeding edge.

## Audio

The ACPI seems to follow a load path for Windows 2012 or 2013 so these need to
be disabled in your `/boot/loader.conf`:

    hw.acpi.remove_interface="Windows 2012,Windows 2013"

I then had to reboot twice to get the analog audio device to be recognised.

The equivalent in Debian was an addition to the kernel parameter in Grub:

    GRUB_CMDLINE_LINUX_DEFAULT="quiet acpi_osi='!Windows 2013' acpi_osi='!Windows 2012'"


## Touchpad

Enable synaptics support in `/boot/loader.conf`:

    hw.psm.synaptics_support="1"

The touch pad is too big so I get palm-ing issues which are annoying. Synclient
cannot be used with this new driver yet so will need another solution.

## Touchscreen

Untested

## Bluetooth

Untested
