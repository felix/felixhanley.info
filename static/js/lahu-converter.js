/*
Qhe te lie, nawl hui bon chi qhe lawl-ot. Mvid naw ma qhot chied ve ngal hui
ve Awl pa-ol, nawl ve awl mie that yawt yan te pid lawl-ot. Nawl ve mvid
mil gal la pil-ot. Mvid naw ma qhot lo nawl ve a lof bid qhe, mil guil qhot
that thawd bid la pil-ot. Yat nyi lof ve cad tul dawl tul ted phaf, yat nyi
ngal hui that pet lal-ot. Shu ngal hui that te yat lad ve vend bat thar
ngal hui phied qha peul ve qha shuf shuf ngal hui ve vend bat that thawd
phied qha lal-ot. Vend bat bel ve awl qhad si ngal hui that tad qai pid.
Yat qhal, hail ve awl qhaw lo ngal hui that ponl lal-ot. Awl lawn qo, mvid
mil, kand pat lie awl met awl phond qha peu-el, co co taif taif nawl ve
yol. A menl.
*/

var tones = [
  { prot: 'ˆ', chin: 't' }, // high checked
  { prot: 'ˍ', chin: 'r' }, // very low
  { prot: 'ˇ', chin: 'd' }, // high falling
  { prot: 'ˬ', chin: 'l' }, // low falling
  { prot: 'ˉ', chin: 'q' }, // high rising
  { prot: '˰', chin: 'f' } // low checked
]
var vowels = [
  { prot: 'eh', chin: 'ie' },
  { prot: 'ui', chin: 'eu' }
]
var consonants = [
  { prot: 'kh\'', chin: 'qh' },
  { prot: 'k\'', chin: 'q' },
  { prot: 'hk', chin: 'kh' },
  { prot: 'tc', chin: 'z' },
  { prot: 'ts', chin: 'zh' },
  { prot: 'ht', chin: 'th' },
  { prot: 'hp', chin: 'ph' }
]

var srcEl = document.getElementById('src')
var srcOrthEl = document.getElementById('srcOrth')
var dstEl = document.getElementById('dst')
var dstOrthEl = document.getElementById('dstOrth')

function convert () {
  var input = srcEl.value
  var out = []
  var patterns = []
  // Build regexps
  patterns = patterns.concat(tones.map(function (t) {
    return {
      regexp: new RegExp(t[srcOrthEl.value] + '$', 'i'),
      replacement: t[dstOrthEl.value]
    }
  }))
  patterns = patterns.concat(vowels.map(function (v) {
    return {
      regexp: new RegExp(v[srcOrthEl.value], 'i'),
      replacement: v[dstOrthEl.value]
    }
  }))
  patterns = patterns.concat(consonants.map(function (c) {
    return {
      regexp: new RegExp('^' + c[srcOrthEl.value], 'i'),
      replacement: c[dstOrthEl.value]
    }
  }))
  // Catchall
  patterns = patterns.concat({ regexp: /^(.+)$/, replacement: '$1' })

  input.split(/([.-])|\s+/).filter(Boolean).forEach(function (word) {
    out.push(
      patterns.reduce(function (acc, pat) {
        return acc.replace(pat.regexp, pat.replacement)
      }, word)
    )
  })
  dstEl.value = out.join(' ')
}

document.getElementById('convert').addEventListener('click', convert)
var srcReset = document.getElementById('srcReset')
srcReset.addEventListener('click', function () {
  srcEl.value = ''
})
