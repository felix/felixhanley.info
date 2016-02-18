---
title: Encoding converter
description: Things to use
lastmod: 2016-02-18
---

Convert between HEX, Base64, ASCII or binary, from and to files.

<!--more-->

Auto detection is a bit hit-and-miss.

<select id="srcType">
  <option value="auto">Auto</option>
  <option value="hex">Hexidecimal</option>
  <option value="base64">Base64</option>
  <option value="ascii">ASCII</option>
  <option value="bin">Binary</option>
</select>
<label>from file <input type="checkbox" id="srcIsFile" value="1" /></label>
<br>
<textarea id="src"></textarea>
<input type="file" id="srcFile"></input>
<br>
<select id="dstType">
  <option value="hex">Hexidecimal</option>
  <option value="base64">Base64</option>
  <option value="ascii">ASCII</option>
  <option value="array">Byte array</option>
</select>
<label>to file <input type="checkbox" id="dstIsFile" value="1" /></label>
<br>
<textarea id="dst"></textarea>
<br>
<button id="convert">Convert</button>
<button id="srcReset">Clear</button>

<script src="/js/tools.js"></script>
