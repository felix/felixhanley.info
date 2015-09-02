---
order: 2
title: Lahu Language resources
description: Lahu language project page. A collection of information about the language spoken by the Lahu hill tribe group.
date: 2011-01-01
tags:
- lahu
- unicode
- font
---

_I am currently trying to learn both Thai and Lahu.  These languages are not
similar at all so it is proving to be quite a challenge. I am by no means an
expert in Lahu so if you find any mistakes or have suggestions then please let
me know._

_Ngaˬ Lahu laˇ henˇ nyi chehˇ ve yoˬ. Haˬ jaˆ._
{: .lahu}

<!--more-->

The Lahu language (ISO 639-3 code ‘lah’) is the language spoken by the Lahu
people in Burma, Thailand, Laos and China. See also [the Wikipedia
entry](http://en.wikipedia.org/wiki/Lahu_language) for Lahu.

There are not many resources around to help with this language. James Mattisof,
a linguistics professor at Berkley university, has produced a dictionary and
grammar for the language but is not for the average reader and is pretty much
useless for the Lahu themselves. Paul Lewis, a Baptist missionary, produced an
English-Lahu-Thai dictionary that is comprehensive but is a little more biased
towards the Burmese Lahu it seems.

## Lahu characters and fonts

Unicode version 5 has the necessary characters to represent the tone marks in
the Lahu written language. There are not many fonts around that actually
include them. One good resource is [SIL](http://www.sil.org) which produces at
least two nice fonts that are capable of representing these characters. Both
[CharisSIL](http://scripts.sil.org/CharisSILfont) and
[DoulosSIL](http://scripts.sil.org/DoulosSILfont) are at Unicode version 5.

## Dictionary

This is a work in progress. It is mainly just collection of Lahu words often
used. A dictd server should be up soon. The current word list can be found in
[the git repository](http://git.seconddrawer.com.au/).

## Lahu-English Bible

With a little bit of script 'hackery' a version of the Lahu New Testament along
side an English version has been made. Using LaTeX the verses are synchronised
to make comparisons easier. Here is a [sample of the Lahu-English New
Testament](/files/bible_sample.pdf).

## Keyboard Layout

The Lahu language uses various tone marks that are difficult to use with a
standard keyboard layout. A [Lahu keyboard layout for
Windows](/files/lahu_keyboard.zip) is available and there are
also some brief [instructions and patches for Linux](/projects/lahu/keyboard/).

Both the above methods will make the following mappings:

- \[ = <span class="lahu"></span> (Unicode U+F1E7)
- \] = <span class="lahu">ˬ</span> (Unicode U+02EC)
- \\ = <span class="lahu">ˍ</span> (Unicode U+02CD)
- \{ = <span class="lahu">ˆ</span> (Unicode U+02C6)
- \} = <span class="lahu">ˇ</span> (Unicode U+02C7)
- \| = <span class="lahu">ˉ</span> (Unicode U+02C9)

Hopefully the pattern should be clear. Note, to see the correct characters you
will need to have the CharisSIL font installed.

## Other Resources

- [The English-Lahu Lexicon](http://books.google.com/books?id=DpPw5oNvKyQC) by
  James A. Matisoff. While being a comprehensive collection it uses his own
  phonetic system which is unlike most others and notably unlike the actual
  written language of the Lahu.
- [Lahu New Testament at the Myanmar Bible
  society](http://www.myanmarbible.com/bible/Lahu/html/index.html) can be
  useful for online study of the language. Get yourself a hard copy if you can,
  its so much easier.
- [Simple Thai to English translation with phonetics](http://thai2english.com)
