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

<form>
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
<label title="(52 * 5) - sick days - leave - holidays">Total work days =</label> <span id="workDays"></span>
<br>
<label title="work days * work hours">Total work hours =</label> <span id="workHours"></span>
<br>
<br>
<label>Superannuation rate (%)</label>
<input class="param" type="number" id="superRate" value="9.25" min="0"></input>
<br>
<label>Salary (pa)</label>
<input class="param" type="number" id="salary" value="" min="0"></input>
<br>
<br>
<label title="salary + super">Salary package =</label> <span id="totalSalary"></span>
<br>
<br>
<label title="salary package / work hour">Hourly rate =</label> <span id="hourlyRate"></span>
<br>
<label title="hourly rate * hours">Daily rate =</label> <span id="dailyRate"></span>
</fieldset>
</form>

<script>
var hoursEl = document.getElementById('hours')
var holidaysEl = document.getElementById('holidays')
var leaveEl = document.getElementById('leave')
var sickLeaveEl = document.getElementById('sickLeave')
var superRateEl = document.getElementById('superRate')
var salaryEl = document.getElementById('salary')

var hRateEl = document.getElementById('hourlyRate')
var dRateEl = document.getElementById('dailyRate')
var workDaysEl = document.getElementById('workDays')
var workHoursEl = document.getElementById('workHours')
var totalSalaryEl = document.getElementById('totalSalary')

var calculate = function () {
  var hours = parseFloat(hoursEl.value || 0, 10)
  var holidays = parseInt(holidaysEl.value || 0, 10)
  var leave = parseInt(leaveEl.value || 0, 10)
  var sickLeave = parseInt(sickLeaveEl.value || 0, 10)
  var superRate = parseFloat(superRateEl.value || 0, 10)
  var salary = parseInt(salaryEl.value || 0, 10)

  var workableDays = 52 * 5
  var restDays = holidays + leave + sickLeave
  var workDays = workableDays - restDays
  workDaysEl.textContent = workDays
  var workHours = workDays * hours
  workHoursEl.textContent = workHours

  var totalSalary = salary * (1 + superRate/100)
  totalSalaryEl.textContent = '$' + totalSalary.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,')

  var hourlyRate = totalSalary / workHours
  var dailyRate = hourlyRate * hours

  hRateEl.textContent = '$' + parseFloat(Math.round(hourlyRate * 100) / 100).toFixed(2)
  dRateEl.textContent = '$' + parseFloat(Math.round(dailyRate * 100) / 100).toFixed(2)
}
Array.prototype.forEach.call(document.querySelectorAll('.param'), function (e) {
  e.addEventListener('change', calculate)
  e.addEventListener('input', calculate)
})
calculate()
</script>
