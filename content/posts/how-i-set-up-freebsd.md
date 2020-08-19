---
title: How I set up FreeBSD
date: 2020-08-19
keywords: freebsd
description: Setting up a desktop machine using FreeBSD
tags:
- FreeBSD
- hardware
---

I recently reclaimed a laptop and provisioned it for use as a development
machine. I have done this a few times and this time I actually kept track of
the steps I took.

## OS installation

FreeBSD is my OS of choice at the moment. I usually have an install image on my
file server and it does not matter if it is a version or two too old. Put this
on a USB stick:

	dd if=FreeBSD-12.0-RELEASE-amd64-mini-memstick.img of=/dev/<your usb> bs=1M

Then boot from this and go through the install. Most options are defaults but I
choose the following:

- ZFS on root
- encrypted root
- enable moused service

I create a user for myself and ensure I am also in the additional 'wheel',
'operator', and 'video' groups.

## Initial configuration

Once rebooted I usually do the following to get started (not always in this order):

- Run `freebsd-update fetch install` to get the latest release. I usually reboot after this.
- Update `/etc/pkg/FreeBSD.conf` to use latest instead of quarterly.
- Add my own local package repository to `/usr/local/etc/pkg/repos/`.
- Run `pkg upgrade` which will install 'pkg' and do an update.
- Run `pkg install git tmux rsync password-store neovim neomutt`. I know I will use these so get them started.

At this stage I should be able to sync and configure some of my basic tools. I
start with a known set of files that I have on every machine. These are usually
synchronised via syncthing or rsync but for the initial install I copy them
from my file server or clone from git:

Copy my personal documents:

	rsync -Pa felix@zappa:Documents/ ~/Documents/

Install my SSH key from the above documents:

	cp ~/Documents/ssh/felix/id_ed25519* ~/.ssh/
	ssh-add

Clone my password store and dotfiles:

	git clone git@<my password url> ~/.password-store
	git clone git@src.userspace.com.au:felix/dotfiles.git ~/.dotfiles

Run my dotfile sync script to get all my current configs and settings:

	~/.dotfiles/bin/dm

## Package installation

I install a whole bunch of stuff as I work but the following are a list of
packages that I most _always_ want (in addition to the base packages above):

- go
- sway (or i3)
- dmenu
- i3status
- firefox

If using sway (like i3 but uses Wayland) then I also install alacritty,
otherwise I just use xterm. For many years I have used i3 but Wayland seems to
be getting easier to get running on BSD so it was a natural progression to
Sway.

### Sway configuration

See my dotfiles for my current config. To get things working on FreeBSD there
are a few required tweaks.

First is access to the `/dev/input/*` devices which by default are only
accessible by root. I still don't know if there is a proper fix for this but I
just add the following to `/etc/devfs.conf` so they are usable by the video
group (which is needed to run sway anyway):

	[localrules=10]
	add path 'input/*' mode 0660 group video

and then add `devfs_system_ruleset="localrules"` to /etc/rc.conf.

### Kernel modules

To actually get sway (and _any_ accelerated graphfics) there will need to be a
kernel module loaded which is appropriate for the graphics hardware. On most
machines I work with this means an Intel DRM module, installed like so:

	doas pkg install drm-kmod

which will install the relevant modules but they still need to be loaded at
boot time. Rather than putting them in `/boot/loader.conf` you can load it
later in the process by using the 'kld_list' config option in `/etc/rc.conf`:

	kld_list="/boot/modules/i915kms.ko coretemp"

Prior to rebooting it can be tested by loading the module and seeing if things
break. It is far easier to fix it now than reboot into a broken system. Load
the module manually like this:

	doas kldload /boot/modules/i915kms.ko

and hopefully it works.

If rebooting works and the kernel module load then it should be ready for the
Sway window manager to start after login.

