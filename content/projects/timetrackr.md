---
title: timetrackr - simple time tracking
linktitle: timetrackr
description: simple time tracking
tags:
- timetrackr
- ruby
menu:
  main:
    parent: projects
    weight: 100
---

A simple CLI time tracking utility.

<!--more-->

## Install

~~~bash
$ gem install timetrackr
~~~

## Example

(with a Bash alias of 'tt')

start a task:

~~~bash
$ tt start something
~~~

...view durations:

~~~bash
$ tt
something *     0h  0m  4s
~~~

...have two running tasks:

~~~bash
$ tt start another-thing
$ tt log
2011-05-18   something *     22:11            0h  0m 30s
             another-thing * 22:11            0h  0m 15s
~~~

...start with a note:

~~~bash
$ tt start one-more with a note
$ tt log
2011-05-18   something *     22:11            0h  0m 45s
             another-thing * 22:11            0h  0m 30s
             one-more *      22:13            0h  0m 15s  with a note
~~~

...restrict some:

~~~bash
$ tt log something
2011-05-18   something *     22:11            0h  1m 00s
~~~

...exclude some:

~~~bash
$ tt log something -n another-thing
2011-05-18   something *     22:11            0h  1m 15s
             one-more *      22:13            0h  0m 45s  with a note
~~~

...stop one (or more):

~~~bash
$ tt stop something
$ tt
something       0h  1m 20s
another-thing * 0h  1m 30s
one-more *      0h  1m 15s
~~~

...and delete one:

~~~bash
$ tt clear something
another-thing * 0h  1m 45s
    one-more *      0h  1m 30s
~~~

## Source

From [my Git repository](http://src.userspace.com.au/timetrackr) or on
[GitHub](https://github.com/felix/timetrackr).
