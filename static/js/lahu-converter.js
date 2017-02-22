/*
 * Qhe te lie, nawl hui bon chi qhe lawl-ot. Mvid naw ma qhot chied ve ngal hui
 * ve Awl pa-ol, nawl ve awl mie that yawt yan te pid lawl-ot. Nawl ve mvid
 * mil gal la pil-ot. Mvid naw ma qhot lo nawl ve a lof bid qhe, mil guil qhot
 * that thawd bid la pil-ot. Yat nyi lof ve cad tul dawl tul ted phaf, yat nyi
 * ngal hui that pet lal-ot. Shu ngal hui that te yat lad ve vend bat thar
 * ngal hui phied qha peul ve qha shuf shuf ngal hui ve vend bat that thawd
 * phied qha lal-ot. Vend bat bel ve awl qhad si ngal hui that tad qai pid.
 * Yat qhal, hail ve awl qhaw lo ngal hui that ponl lal-ot. Awl lawn qo, mvid
 * mil, kand pat lie awl met awl phond qha peu-el, co co taif taif nawl ve
 * yol. A menl.
 */

var patterns = [
  { regexp: /(ˆ)$/, replacement: 't' }, // high checked
  { regexp: /(ˍ)$/, replacement: 'r' }, // very low
  { regexp: /(ˇ)$/, replacement: 'd' }, // high falling
  { regexp: /(ˬ)$/, replacement: 'l' }, // low falling
  { regexp: /(ˉ)$/, replacement: 'q' }, // high rising
  { regexp: /(˰)$/, replacement: 'f' }, // low checked
  { regexp: /(eh)$/, replacement: 'ie' },
  { regexp: /^(kh')/, replacement: 'qh' },
  { regexp: /^(hp)/, replacement: 'ph' },
  { regexp: /^(.+)$/, replacement: '$1' } // catchall
]

var srcEl = document.getElementById('src')
var dstEl = document.getElementById('dst')

function convert () {
  var input = srcEl.value
  var out = []
  input.split(/\s+/).filter(Boolean).forEach(function (word) {
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
