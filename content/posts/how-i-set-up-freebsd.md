---
title: How I set up FreeBSD
date: 2020-08-19
keywords: freebsd
lastmod: 2020-08-21
description: Setting up a desktop machine using FreeBSD
tags:
- FreeBSD
- hardware
---

I recently reclaimed a laptop and provisioned it for use as a development
machine. For reference, these are the steps I took.

## OS installation

Copy a new ISO onto a USB stick:

```sh
dd if=FreeBSD-12.0-RELEASE-amd64-mini-memstick.img of=/dev/<the usb device> bs=1M
```

Then boot from this and go through the install. Most options are defaults but I
choose the following:

- partitions: ZFS on root, encrypted root
- services: enable moused, ssh, powerd, ntpd
- hardening: disable sendmail, clear tmp

Create a user and ensure it is in the additional 'wheel', 'operator', and
'video' groups.

## Initial configuration

Once rebooted do the following to get started (not always in this order):

- Run `freebsd-update fetch install` to get the latest release. Reboot after this.
- Update `/etc/pkg/FreeBSD.conf` to use latest instead of quarterly.
- Add any local package repositories to `/usr/local/etc/pkg/repos/`.
- Run `pkg upgrade` which will install 'pkg' and do an update.

For accelerated graphics the intel DRM module is installed and loaded at boot:

```sh
doas pkg install drm-kmod
sysrc kld_list+="/boot/modules/i915kms.ko coretemp"
```

Enable the following sysctl and powerd flags for suspend etc.:

```sh
echo 'hw.acpi.lid_switch_state=S3' >> /etc/sysctl.conf
sysrc powerd_flags="-N"
```

Shorten the boot time:

```sh
echo 'autoboot_delay="0"' >> /boot/loader.conf
echo 'hw.usb.no_boot_wait="1"' >> /boot/loader.conf
```

Enable CPU micro-code updates:

```sh
pkg install devcpu-data
echo 'cpu_microcode_load="YES"' >> /boot/loader.conf
echo 'cpu_microcode_name="/boot/firmware/intel-ucode.bin"' >> /boot/loader.conf
```

Enable controlling screen brightness:

```sh
pkg install intel_backlight
echo 'acpi_video_load="YES"' >> /boot/loader.conf
cp /usr/local/share/examples/intel-backlight/acpi-video-intel-backlight.conf /usr/local/etc/devd/
```

Install some basic packages:

```sh
pkg install git tmux rsync
```

Aggregate the wifi and ethernet links:

```sh
sysrc wlans_iwm0="wlan0"
sysrc ifconfig_wlan0="WPA"
sysrc ifconfig_em0="ether $(ifconfig wlan0 ether |awk '/ether/ {print $2}')"
sysrc cloned_interfaces="lagg0"
sysrc ifconfig_lagg0="laggproto failover laggport em0 laggport wlan0 DHCP"

```

## Personalisation

At this stage sync and configure some basic tools. Start with a known set of
files that are on every machine. These are usually synchronised via syncthing
or rsync but for the initial install they are copied from a central file server
or cloned from git:

Copy personal documents:

```sh
rsync -Pa felix@zappa:Documents/ ~/Documents/
```

Install SSH keys from the above documents:

```sh
cp ~/Documents/ssh/felix/id_ed25519* ~/.ssh/
ssh-add
```

Clone password store and dotfiles:

```sh
git clone git@<password url> ~/.password-store
git clone git@src.userspace.com.au:felix/dotfiles.git ~/.dotfiles
```

Run dotfile sync script to get all current configs and settings:

```sh
~/.dotfiles/bin/dm
```

## Package installation

Install minimal set of packages:

```sh
pkg install git tmux rsync password-store
pkg install sway alacritty # for wayland or,
pkg install i3 xorg xterm # for x11
pkg install dmenu i3status
pkg install firefox libreoffice
pkg install go texlive-full
pkg install neovim neomutt
```

## Desktop configuration

If using Sway there are a few required tweaks.

First is access to the `/dev/input/*` devices which by default are only
accessible by root. Is a proper fix for this? Add the following to
`/etc/devfs.rules` so they are usable by the video group (which is needed to
run sway anyway):

```ini
[localrules=10]
add path 'input/*' mode 0660 group video
```

and then add `devfs_system_ruleset="localrules"` to /etc/rc.conf.
