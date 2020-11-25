---
title: Contracting rate calculator
linktitle: Contract Rate
description: Calculate a good contractor rate
menu:
  main:
    parent: tools
tags:
- money
- tools
aliases:
- /articles/contracting-rate-calculator/
---

Calculate a contractor rate from a full-time (5 days a week) salary.

<!--more-->

This makes a few assumptions and you should note the following:

1. This is for the state of Victoria, Australia (11 public holidays a year).
2. It assumes no additional training, conferences etc.
3. It does not factor in taxes you may be required to charge such as GST.

Whether you will be able to get this rate is another thing but this should help
with the calculations a little.

<form id="contracting-calculator">
<fieldset class="aligned">
<label>Work day (hours)</label>
<input class="param" type="number" id="hours" value="7.5" min="0"></input>
<br>
<label>Public holidays (days)</label>
<input class="param" type="number" id="holidays" value="11" min="0"></input>
<br>
<label>Annual leave (days)</label>
<input class="param" type="number" id="leave" value="20" min="0"></input>
<br>
<label>Sick leave (days)</label>
<input class="param" type="number" id="sickLeave" value="10" min="0"></input>
<br>
<br>
<strong>Total work days = <span id="workDays"></span></strong> <em>= ((52 * 5) - sick days - leave - holidays</em>
<br>
<strong>Total work hours = <span id="workHours"></span></strong> <em>= work days * work hours</em>
<br>
<br>
<label>Superannuation rate (%)</label>
<input class="param" type="number" id="superRate" value="9.25" min="0"></input>
<br>
<label>Salary (pa)</label>
<input class="param" type="number" id="salary" value="" min="0"></input>
<br>
<br>
<strong>Salary package = <span id="totalSalary"></span></strong> <em>= salary + super</em>
<br>
<br>
<strong>Hourly rate = <span id="hourlyRate"></span></strong> <em>= salary package / work hour</em>
</fieldset>
</form>
