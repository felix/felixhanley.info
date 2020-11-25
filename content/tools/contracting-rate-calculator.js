window.addEventListener('DOMContentLoaded', (event) => {
  var hoursEl = document.getElementById('hours')
  var holidaysEl = document.getElementById('holidays')
  var leaveEl = document.getElementById('leave')
  var sickLeaveEl = document.getElementById('sickLeave')
  var superRateEl = document.getElementById('superRate')
  var salaryEl = document.getElementById('salary')

  var rateEl = document.getElementById('hourlyRate')
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

    rateEl.textContent = '$' + parseFloat(Math.round(hourlyRate * 100) / 100).toFixed(2)
  }
  Array.prototype.forEach.call(document.querySelectorAll('.param'), function (e) {
    e.addEventListener('change', calculate)
    e.addEventListener('input', calculate)
  })
  calculate()
})
