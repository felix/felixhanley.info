---
order: 2
title: timetrackr - simple time tracking
kind: article
description: simple time tracking
date: 2012-04-04
updated_at: 2011-04-04
tags:
- timetrackr
- ruby
---

A simple CLI time tracking utility.

## Install

    $ gem install timetrackr

## Example

(with a Bash alias of 'tt')

start a task:

    $ tt start something

...view durations:

    $ tt
    something *     0h  0m  4s

...have two running tasks:

    $ tt start another-thing
    $ tt log
    2011-05-18   something *     22:11            0h  0m 30s
                 another-thing * 22:11            0h  0m 15s

...start with a note:

    $ tt start one-more with a note
    $ tt log
    2011-05-18   something *     22:11            0h  0m 45s
                 another-thing * 22:11            0h  0m 30s
                 one-more *      22:13            0h  0m 15s  with a note

...restrict some:

    $ tt log something
    2011-05-18   something *     22:11            0h  1m 00s

...exclude some:

    $ tt log something -n another-thing
    2011-05-18   something *     22:11            0h  1m 15s
                 one-more *      22:13            0h  0m 45s  with a note

...stop one (or more):

    $ tt stop something
    $ tt
    something       0h  1m 20s
    another-thing * 0h  1m 30s
    one-more *      0h  1m 15s

...and delete one:

    $ tt clear something
    another-thing * 0h  1m 45s
    one-more *      0h  1m 30s

## Source

From [my Git repository](http://git.seconddrawer.com.au/timetrackr) or on
[GitHub](https://github.com/felix/timetrackr).
