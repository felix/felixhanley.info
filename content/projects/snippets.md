---
title: Snippets & One-liners
description: Snippets and one-liners I want to remember
date: 2011-01-01
updated_at: 2011-05-13
draft: true
---

Just stuff I need to write down so I don't have to go looking for them, again!

## Filesystem

- Find the _n_ largest files recursively. _n_ is 20 in this example:

      find . -type f -printf "%s %h/%f\n" | sort -gr | head -n 20

## Git

- Delete branches, local and remote

      # delete remote branch
      git push origin :branch-name

      # delete local branch also
      git branch -d branch-name

## Vim

- Format my CSS

      %s/\(;\|:\|{\|,\)\(\s\|\n\)*/\1/g

- Remove empty lines

      :g/^$/d

## Archlinux

- sort packages by installed size

      #!sh
      pacman -Qi|awk '/^Installed Size/{print int($4), name} /^Name/{name=$3}'|sort -n

## Mutt

- tag duplicate messages

      T ~=

## Music

- Split a flac file according to a separate cue file

      cuebreakpoints "sample album.cue" | shnsplit -o flac "sample album.flac"
      cuetag.sh "sample album.cue" split-track*.flac
