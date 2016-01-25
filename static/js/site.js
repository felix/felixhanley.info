document.querySelector('#nav-toggle').addEventListener('click', function(){
    this.classList.toggle('active')
})

// Add the ancient content warning
var items = document.getElementsByTagName('article')
for (var i = 0; i < items.length; i += 1) {
    if (!items[i].classList.contains('project')) {
        var createdAt = items[i].querySelectorAll('header .meta time.created')[0]
        var updatedAt = items[i].querySelectorAll('header .meta time.updated')[0]
        var recentDate = updatedAt || createdAt

        if (recentDate) {
            var date = Date.parse(recentDate.getAttribute('datetime'))
            var age = Math.floor((Date.now() - date) / 86400000)
            if (age > 365) {
                console.warn('This article is ' + age + ' days old')
                var warning = document.createElement('span')
                warning.appendChild(
                    document.createTextNode('This page has not been updated in ' + age + ' days! Here be dragons.')
                )
                warning.className = 'warning'
                items[i].querySelectorAll('header')[0].appendChild(warning)
            }
        }
    }
}
