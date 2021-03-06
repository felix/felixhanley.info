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
machine. I have done this a few times and this time I actually kept track of
the steps I took.

## OS installation

FreeBSD has been my main OS of choice for quite some time. I usually have an
install image on my file server and it does not matter if it is a version or
two too old. Put this on a USB stick:

```sh
dd if=FreeBSD-12.0-RELEASE-amd64-mini-memstick.img of=/dev/<the usb device> bs=1M
```

Then boot from this and go through the install. Most options are defaults but I
choose the following:

- partitions: ZFS on root, encrypted root
- services: enable moused, ssh, powerd, ntpd
- hardening: disable sendmail, clear tmp

I create a user for myself and ensure I am also in the additional 'wheel',
'operator', and 'video' groups.

## Initial configuration

Once rebooted I usually do the following to get started (not always in this order):

- Run `freebsd-update fetch install` to get the latest release. I usually reboot after this.
- Update `/etc/pkg/FreeBSD.conf` to use latest instead of quarterly.
- Add my own local package repository to `/usr/local/etc/pkg/repos/`.
- Run `pkg upgrade` which will install 'pkg' and do an update.

For accelerated graphics I usually need the intel DRM module installed and loaded at boot:

```sh
doas pkg install drm-kmod
sysrc kld_list+="/boot/modules/i915kms.ko coretemp"
```

I enable the following sysctl and powerd flags for suspend etc.:

```sh
echo 'hw.acpi.lid_switch_state=S3' >> /etc/sysctl.conf
sysrc powerd_flags="-N"
```

I like to shorten the boot time:

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

Install some basic packages I will need next:

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

At this stage I should be able to sync and configure some of my basic tools. I
start with a known set of files that I have on every machine. These are usually
synchronised via syncthing or rsync but for the initial install I copy them
from my file server or clone from git:

Copy my personal documents:

```sh
rsync -Pa felix@zappa:Documents/ ~/Documents/
```

Install my SSH key from the above documents:

```sh
cp ~/Documents/ssh/felix/id_ed25519* ~/.ssh/
ssh-add
```

Clone my password store and dotfiles:

```sh
git clone git@<my password url> ~/.password-store
git clone git@src.userspace.com.au:felix/dotfiles.git ~/.dotfiles
```

Run my dotfile sync script to get all my current configs and settings:

```sh
~/.dotfiles/bin/dm
```

## Package installation

I install a whole bunch of stuff as I work but the following are a list of
packages that I most _always_ want:

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

I am currently using Sway, see my dotfiles for my current config. To get things
working on FreeBSD there are a few required tweaks.

First is access to the `/dev/input/*` devices which by default are only
accessible by root. I still don't know if there is a proper fix for this but I
just add the following to `/etc/devfs.rules` so they are usable by the video
group (which is needed to run sway anyway):

```ini
[localrules=10]
add path 'input/*' mode 0660 group video
```

and then add `devfs_system_ruleset="localrules"` to /etc/rc.conf.
