---
title: Lahu Dictionary
linktitle: Dictionary
description: Lahu dictionary
keywords: lahu dictionary
date: 2016-01-28
lastmod: 2016-11-02
tags:
- lahu
- dictionary
menu:
  main:
    parent: lahu
---

A Lahu-English and English-Lahu dictionary in a variety of formats.

<!--more-->

This is obviously a work in progress as I continue to use this language. The
[source for this dictionary is
available](http://github.com/felix/lahu-dictionary) in XDXF format and I
welcome suggestions and edits.

I have recently moved from the TEI format to XDXF simply due to the lack of
tools for converting between formats. Both provide a good structure for
databases (XDXF less so than TEI) but one of my goals is to have it used by
others and XDXF allows me to do this more easily.

There is also an online lookup using the same source data at
http://dict.felixhanley.info

[Download various formats](https://github.com/felix/lahu-dictionary/releases/latest)

Lookup words in my Lahu - English dictionary (and some others).

<input class="dict" id="query" />
<button class="dict" id="lookup">Lookup</button>
<section class="dict" id="results"></section>
<script src="/js/fetch.js"></script>
<script src="/js/dict.js"></script>
