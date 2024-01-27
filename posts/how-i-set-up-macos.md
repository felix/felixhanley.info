---
draft: true
title: How I set up macos
date: 2020-08-19
keywords: macos
description: Setting up a work machine using macos
tags:
- macos
- hardware
---

I am not sure I would ever but a Mac for development but my current employer
provides a fancy MacBook Pro so I have no complaints. These are some of the
things I do to make it workable for myself:

## Install MacPorts

I don't like Homebrew as it seems to take liberties with `su` or `sudo` and
from a BSD background I feel more comfortable with MacPorts.

Some strange reason the office network restricts outgoing rsync (to port 873)
so a standard install won't work, so I install using the Git repository.

I then install the following ports:

- tmux
- neovim
- Go
- neomutt (yes)
- pass
- pass-otp
- pinentry-mac

and that should get me going.
