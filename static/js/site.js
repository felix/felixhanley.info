console.log('Hi there!')

// Mobile menu toggler
document.getElementById('nav-toggle').addEventListener('click', function () {
  this.parentNode.classList.toggle('menu--active')
})

// Change external links' targets
var links = document.getElementsByTagName('a')
if (links) {
  var re = new RegExp('^https?://(.+)?' + window.location.host)
  var arr = [].slice.call(links)
  arr.forEach(function (l) {
    if (!l.href.match(re)) {
      l.target = '_blank'
      console.log('Sending', l.href, 'to another tab')
    }
  })
}

var posts = document.getElementsByTagName('article')

var filter = document.getElementById('filter')
if (filter) {
  filter.addEventListener('keyup', function () {
    var term = this.value
    if (term.length > 1) {
      Array.prototype.forEach.call(posts, function (el, i) {
        var titles = Array.prototype.filter.call(el.querySelectorAll('.title'), function (el, i) {
          return new RegExp(term, 'i').test(el.textContent)
        })
        var tags = Array.prototype.filter.call(el.querySelectorAll('tag'), function (el, i) {
          return new RegExp(term, 'i').test(el.textContent)
        })
        if (titles.length || tags.length) {
          console.log('Filtering on', term)
          el.classList.remove('filtered')
        } else {
          el.classList.add('filtered')
        }
      })
    } else {
      Array.prototype.forEach.call(posts, function (el, i) {
        el.classList.remove('filtered')
      })
    }
  })
}
