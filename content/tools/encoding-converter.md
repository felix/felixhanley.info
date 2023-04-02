---
title: Encoding conversion tool
linktitle: Encoding
keywords: javascript convert encoding base64 hex
description: A tool to convert encodings
date: 2023-04-02
tags:
- encoding
- javascript
- tools
aliases:
- /articles/encoding-converter/
---

Convert between HEX, Base64, UTF-8 or binary, from and to files.

<!--more-->

Auto detection is a bit hit-and-miss.

<form>
<select id="srcType">
  <option value="auto">Auto</option>
  <option value="hex">Hexadecimal</option>
  <option value="base64">Base64</option>
  <option value="utf8">UTF-8</option>
  <option value="bin">Binary</option>
  <option value="array">Binary array</option>
</select>
<label>from file <input type="checkbox" id="srcIsFile" value="1" /></label>
<br>
<textarea id="src" class="textarea textarea--code"></textarea>
<input type="file" id="srcFile"></input>
<br>
<select id="dstType">
  <option value="hex">Hexadecimal</option>
  <option value="base64">Base64</option>
  <option value="utf8">UTF-8</option>
  <option value="array">Byte array</option>
  <option value="bits">Bits</option>
</select>
<label>to file <input type="checkbox" id="dstIsFile" value="1" /></label>
<label>80 char width <input type="checkbox" id="fixedWidth" value="1" /></label>
<br>
<textarea id="dst" class="textarea textarea--code"></textarea>
<br>
<button id="convert">Convert</button>
<button id="srcReset">Clear</button>
<button id="swap">Swap</button>
</form>
