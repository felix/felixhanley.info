---
title: Ducky One 2 Mini on macOS
date: 2020-03-19
keywords: ducky macOS
description: Fixing regular disconnects for Ducky One 2 mini on macOS
tags:
- hardware
- macOS
---

I have a [Ducky One 2 Mini
keyboard](https://www.duckychannel.com.tw/en/Ducky-One2-Mini-RGB) with Cherry
Reds which is a reasonably solid, compact keyboard for work. It works fine with
FreeBSD and Linux but on macOS it has a habit of disconnecting regularly. This
is a fix for the disconnection issue that works for me.

## Cause

As found in a couple of forum posts, it only occurs when macOS does an update
check. This is confirmed by forcing a check from system preferences. The
keyboard will disconnect and require a _hard_ reconnect using the USB cable.

## Fix

The fix found requires re-programming the keyboard to appear to be an 'Apple
Magic' USB keyboard. Enter the following:

1. Press & hold <kbd>Fn</kbd> + <kbd>Alt</kbd> + <kbd>p</kbd> for 3 seconds (several keys will light up red and remain on).
2. Type `05aC024f` (or for ISO layout `05ac0250`).
3. Unplug the keyboard to restart it.

The code entered (`024f`) sets the VID and PID to an Apple authorised USB keyboard.

To restore the original VID and PID codes, perform the following to reset to factory defaults:

1. Press and hold <kbd>left win</kbd> + <kbd>right win</kbd> for 3s.
2. Unplug the keyboard to restart it.
