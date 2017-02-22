---
title: Encoding conversion tool
linktitle: Convert encoding
keywords: javascript convert encoding base64 hex
description: A tool to convert encodings
date: 2016-02-19
tags:
- encoding
- javascript
- tools
menu:
  main:
    parent: projects
    weight: 30
---

Convert between HEX, Base64, ASCII or binary, from and to files.

<!--more-->

Auto detection is a bit hit-and-miss.

<select id="srcType">
  <option value="auto">Auto</option>
  <option value="hex">Hexadecimal</option>
  <option value="base64">Base64</option>
  <option value="ascii">ASCII</option>
  <option value="bin">Binary</option>
</select>
<label>from file <input type="checkbox" id="srcIsFile" value="1" /></label>
<br>
<textarea id="src" class="code"></textarea>
<input type="file" id="srcFile"></input>
<br>
<select id="dstType">
  <option value="hex">Hexadecimal</option>
  <option value="base64">Base64</option>
  <option value="ascii">ASCII</option>
  <option value="array">Byte array</option>
</select>
<label>to file <input type="checkbox" id="dstIsFile" value="1" /></label>
<label>80 char width <input type="checkbox" id="fixedWidth" value="1" /></label>
<br>
<textarea id="dst" class="code"></textarea>
<br>
<button id="convert">Convert</button>
<button id="srcReset">Clear</button>
</form>

<script src="/js/tools.js"></script>
