'use strict'

if (!window.Promise) {
  console.warn('No promises')
}

if (!window.fetch) {
  console.warn('No fetch')
}

var dictURI = 'http://dict.felixhanley.info/define/'
// var dictURI = 'http://localhost:8080/define/'
var queryEl = document.getElementById('query')
var resultsEl = document.getElementById('results')

var lookupBtn = document.getElementById('lookup')

// Group results
function processResults (json) {
  return json.reduce(function (res, e) {
    if (!res[e.dictionary]) {
      res[e.dictionary] = []
    }

    res[e.dictionary].push(e)
    return res
  }, {})
}

function escapeHTML (html) {
  var escape = document.createElement('textarea')
  escape.textContent = html
  var result = escape.innerHTML
  escape.remove()
  return result
}

function lookup () {
  var word = queryEl.value

  window.fetch(dictURI + word)
    .then(function (response) {
      return response.json()
    }).then(function (json) {
      console.log('parsed json', json)
      var frag = document.createDocumentFragment()
      resultsEl.innerHTML = ''

      if (json.code) {
        var span = document.createElement('span')
        span.innerHTML = json.message
        frag.appendChild(span)
      } else {
        var results = processResults(json)
        console.log(results)
        Object.keys(results).forEach(function (db) {
          frag.appendChild(document.createElement('h3')).innerHTML = db
          results[db].forEach(function (def, i) {
            var article = document.createElement('article')
            article.innerHTML = escapeHTML(def.definition)
            frag.appendChild(article)
          })
        })
      }
      resultsEl.appendChild(frag)
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    })
}

lookupBtn.addEventListener('click', lookup)
queryEl.addEventListener('keyup', function (evt) {
  if (evt.keyCode === 13) {
    lookupBtn.click()
  }
})
