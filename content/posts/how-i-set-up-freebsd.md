---
draft: true
title: How I set up FreeBSD
date: 2020-08-19
keywords: freebsd
description: Setting up a dev machine using FreeBSD
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

Then boot of this and go through the install. Most options are defaults but I
choose the following:

- ZFS on root
- encrypted root

I create a user for myself and ensure I am also in the additional 'wheel' group.

## Initial configuration

Once rebooted I usually do the following to get started (not always in this order):

- Run `freebsd-update fetch install` to get the latest release. I usually reboot after this.
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

If using sway (like i3 but uses Wayland) then I also install alacritty, otherwise I just use xterm.

### Sway configuration

See my dotfiles for my current config. To get things working on FreeBSD there
are a few required tweaks. First is access to the `/dev/input/*` devices which
by default are only accessible by root. I add the following to
`/etc/devfs.conf`:

	[localrules]

