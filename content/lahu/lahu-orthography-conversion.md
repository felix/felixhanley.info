---
title: Black Lahu orthography conversion
linktitle: Conversion
description: Convert between Black Lahu orthographies
date: 2017-02-22
tags:
- lahu
- conversion
aliases:
-  /lahu/black-2-chinese
menu:
  main:
    parent: lahu
    weight: 40
---

A simple experiment to convert Black Lahu script used in Thailand and Burma
into the script used by Black Lahu in China. It is the same spoken language
with only a different accent (it seems).

When going from Chinese back to Protestant be sure to check the vowels _ui_/_uh_, _eu_/_u_ and the consonants _n_/_ny_, _p_/_pf_/_hpf_ _b_/_bv_, _m_/_mv_. This is due to an overlap in the mapping.

<select id="srcOrth">
<option value="prot" selected>Protestant (Burma, Thailand)</option>
<option value="chin">Chinese</option>
</select>
<br>
<textarea id="src">Naw aw mehˇ a˰ hto mehˇ ve le?</textarea>
<br>
<br>
<select id="dstOrth">
<option value="prot">Protestant (Burma, Thailand)</option>
<option value="chin" selected>Chinese</option>
</select>
<br>
<textarea id="dst"></textarea>
<br>
<br>
<button id="convert">Convert</button>
<button id="srcReset">Clear</button>

<script src="/js/lahu-converter.js"></script>
