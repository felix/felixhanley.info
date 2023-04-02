var base64Regexp = /^([0-9a-z+/]{4})*(([0-9a-z+/]{2}==)|([0-9a-z+/]{3}=))?$/i
var hexRegexp = /^([0-9a-f][0-9a-f])+$/i

// Convert hex to Uint8 array
var hexToBytes = function (hex) {
  var bytes = []
  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return new Uint8Array(bytes)
}

// Convert Uint8 array to hex
var bytesToHex = function (bytes) {
  if (!bytes.length) {
    throw new TypeError('Typed array required')
  }
  var hex = []
  for (var i = 0; i < bytes.length; i += 1) {
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xF).toString(16))
  }
  return hex.join('')
}

// Convert string to Uint8 array
var strToBytes = function (str) {
  var encoder = new TextEncoder()
  return encoder.encode(str)
}

// Convert Uint8 array to string
var bytesToStr = function (bytes) {
  var decoder = new TextDecoder()
  return decoder.decode(bytes)
}

var bytesToBits = function (bytes) {
  var out = ''
  for (var i = 0; i < bytes.length; ++i) {
    if (i > 0) {
      out += ' '
    }
    var b = bytes[i]
    if (b < 0 || b > 255) {
      throw new Error('Invalid byte value')
    }
    for (var j = 7; j > -1; --j) {
      out += 0x01 & (b >> j);
    }
  }
  return out
}

var bytesToBase64 = function (bytes) {
  var base64 = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  bytes = new Uint8Array(bytes)
  var byteLength = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength = byteLength - byteRemainder
  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    // 16515072 = (2^6 - 1) << 18
    a = (chunk & 16515072) >> 18
    // 258048   = (2^6 - 1) << 12
    b = (chunk & 258048) >> 12
    // 4032     = (2^6 - 1) << 6
    c = (chunk & 4032) >> 6
    // 63       = 2^6 - 1
    d = chunk & 63

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength]
    // 252 = (2^6 - 1) << 2
    a = (chunk & 252) >> 2
    // Set the 4 least significant bits to zero
    // 3   = 2^2 - 1
    b = (chunk & 3) << 4
    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
    // 64512 = (2^6 - 1) << 10
    a = (chunk & 64512) >> 10
    // 1008 = (2^6 - 1) << 4
    b = (chunk & 1008) >> 4
    // Set the 2 least significant bits to zero
    // 15 = 2^4 - 1
    c = (chunk & 15) << 2
    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  return base64
}

var base64ToBytes = function (input) {
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

  var lkey = encodings.indexOf(input.charAt(input.length - 1))
  if (lkey === 64) {
    input = input.substring(0, input.length - 1)
  }

  var bytes = parseInt((input.length / 4) * 3, 10)

  var chr1, chr2, chr3
  var enc1, enc2, enc3, enc4
  var j = 0

  var out = new Uint8Array(bytes)

  input = input.replace(/[^A-Za-z0-9+/=]/g, '')

  for (var i = 0; i < bytes; i += 3) {
    // Get the 3 octects in 4 ascii chars
    enc1 = encodings.indexOf(input.charAt(j++))
    enc2 = encodings.indexOf(input.charAt(j++))
    enc3 = encodings.indexOf(input.charAt(j++))
    enc4 = encodings.indexOf(input.charAt(j++))

    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4

    out[i] = chr1
    if (enc3 !== 64) out[i + 1] = chr2
    if (enc4 !== 64) out[i + 2] = chr3
  }

  return out
}

// Present download of byte array
var bytesToFile = function (data) {
  document.location = 'data:Application/octet-stream,' + encodeURIComponent(data)
}

window.addEventListener('DOMContentLoaded', (event) => {
  var srcEl = document.getElementById('src')
  var srcIsFileEl = document.getElementById('srcIsFile')
  var srcFileEl = document.getElementById('srcFile')
  var dstEl = document.getElementById('dst')
  var srcTypeEl = document.getElementById('srcType')
  var dstTypeEl = document.getElementById('dstType')
  var dstIsFileEl = document.getElementById('dstIsFile')

  // Output data as requested
  var output = function (data) {
    var dstType = dstTypeEl.options[dstTypeEl.selectedIndex].value
    //console.log('Input data', data)
    console.log('Output set to', dstType)
    var fixedWidth = document.getElementById('fixedWidth').checked
    var out
    if (dstType === 'utf8') {
      out = bytesToStr(data)
    } else if (dstType === 'hex') {
      out = bytesToHex(data)
    } else if (dstType === 'base64') {
      out = bytesToBase64(data)
    } else if (dstType === 'array') {
      out = data.toString().split(',').join(', ')
    } else if (dstType === 'bits') {
      out = bytesToBits(data)
    }
    if (fixedWidth) {
      out = out.replace(/(.{80})/g, '$1\n')
    }
    // console.log('Output data', out)
    if (dstIsFileEl.checked) {
      bytesToFile(out)
    } else {
      dstEl.value = out
    }
  }

  // Import data to Uint8 array
  var convert = function (evt) {
    evt.preventDefault()

    var srcType = srcTypeEl.options[srcTypeEl.selectedIndex].value
    console.log('Source set to', srcType)

    if (srcType === 'auto') {
      if (base64Regexp.test(srcEl.value)) {
        console.log('Could be base64')
        srcType = 'base64'
      }
      if (hexRegexp.test(srcEl.value)) {
        console.log('Could be hex')
        srcType = 'hex'
      }
      if (srcEl.value[0] == '[') {
        console.log('Could be binary array')
        srcType = 'array'
      }
    }

    // This is the default
    var convertFunc = function (src) {
        output(strToBytes(src))
    }

    if (srcType === 'hex') {
      convertFunc = function (src) {
        // Strip unknown chars
        src = src.replace(/[^0-9a-f]/gi, '')
        output(hexToBytes(src))
      }
    } else if (srcType === 'base64') {
      convertFunc = function (src) {
        // Strip unknown chars
        src = src.replace(/[^0-9a-z+/=]/gi, '')
        output(base64ToBytes(src))
      }
    } else if (srcType === 'utf8') {
      convertFunc = function (src) {
        output(strToBytes(src))
      }
    } else if (srcType === 'bin') {
      convertFunc = function (src) {
        output(src)
      }
    } else if (srcType === 'array') {
      convertFunc = function (src) {
        src = src.replace(/[\[\]]/g, '').split(/[\s,]/).map(x => parseInt(x))
        output(src)
      }
    }

    if (srcIsFileEl.checked) {
      var file = srcFileEl.files[0]
      var reader = new window.FileReader()
      reader.onload = function (e) {
        convertFunc(new Uint8Array(e.target.result))
      }
      reader.readAsArrayBuffer(file)
    } else {
      convertFunc(srcEl.value)
    }
  }

  // DOM manipulation
  document.getElementById('convert').addEventListener('click', convert)
  var srcReset = document.getElementById('srcReset')
  srcReset.addEventListener('click', function () {
    srcEl.value = ''
  })
  var swap = document.getElementById('swap')
  swap.addEventListener('click', function (evt) {
    evt.preventDefault()
    var tmp = srcEl.value
    srcEl.value = dstEl.value
    dstEl.value = tmp
  })
  srcIsFileEl.addEventListener('change', function () {
    if (srcIsFileEl.checked) {
      srcEl.style.display = 'none'
      srcFileEl.style.display = 'block'
    } else {
      srcEl.style.display = 'block'
      srcFileEl.style.display = 'none'
    }
  })
  srcIsFileEl.dispatchEvent(new window.Event('change'))

  dstTypeEl.addEventListener('change', function () {
    var dstType = dstTypeEl.options[dstTypeEl.selectedIndex].value
    if (dstType === 'file') {
      dstEl.style.display = 'none'
    } else {
      dstEl.style.display = 'block'
    }
  })
  dstTypeEl.dispatchEvent(new window.Event('change'))
})
