'use strict'

const ATTRIBUTE_RE = /\n[ \t]*\[\s*assembly\s*:\s*([a-zA-Z0-9]+)\s*\(([^\)]+)\)\s*\]/
    , SINGLE_QUOTE = `'`
    , DOUBLE_QUOTE = `"`

module.exports = function (source) {
  if (source == null) {
    source = ''
  } else if (Buffer.isBuffer(source)) {
    source = source.toString()
  } else if (typeof source !== 'string') {
    throw new TypeError('The source code, if provided, must be a string or buffer')
  }

  const attributes = {}
  const chunks = []

  let remainder = source
  let hasSuffixes = false
  let match

  while ((match = remainder.match(ATTRIBUTE_RE)) !== null) {
    const raw = match[0]
    const key = match[1]
    const args = match[2].trim()
    const value = parseAttributeValue(args)

    // Keep whitespace at beginning of line
    const start = match.index + raw.indexOf('[')
    const end = match.index + raw.length

    chunks.push(remainder.slice(0, start))
    chunks.push(raw.trim())

    remainder = remainder.slice(end)
    addAttribute(key, value, chunks.length - 1)
  }

  function addAttribute (fqk, value, index) {
    const isSuffixed = fqk.slice(-9) === 'Attribute'
    const key = isSuffixed ? fqk.slice(0, -9) : fqk

    if (isSuffixed) hasSuffixes = true
    else if (hasSuffixes) fqk = key + 'Attribute'

    return (attributes[key] = {
      set (newValue) {
        value = newValue
        chunks[index] = `[assembly: ${fqk}(${literal(value)})]`
      },
      get key    () { return key },
      get value  () { return value },
      get source () { return chunks[index] }
    })
  }

  if (remainder) {
    chunks.push(remainder)
  }

  return {
    get (key) {
      return attributes[key] ? attributes[key].value : null
    },

    set (key, value) {
      if (attributes[key]) {
        attributes[key].set(value)
      } else {
        if (chunks.length && !/\n\s*$/.test(chunks[chunks.length - 1])) {
          chunks.push('\n')
        }

        const index = chunks.push('') - 1
        addAttribute(key, value, index).set(value)
      }
    },

    toSource () {
      return chunks.join('')
    }
  }
}

function literal (value) {
  const t = typeof value

  if (t === 'boolean' || t === 'string' || t === 'number') {
    return JSON.stringify(value)
  } else {
    throw new TypeError('Unsupported type: ' + t)
  }
}

function parseAttributeValue (source) {
  if (source[0] === SINGLE_QUOTE) {
    if (source[source.length - 1] !== SINGLE_QUOTE) {
      throw new Error('Cannot parse: ' + source)
    }

    // Naive parsing of JS string
    const raw = source.slice(1, -1)
    const escaped = raw.replace(/"/g, '\\"').replace(/\\'/g, SINGLE_QUOTE)

    source = DOUBLE_QUOTE + escaped + DOUBLE_QUOTE
  }

  try {
    // Basic support of booleans, strings and numbers in C# and JS
    return JSON.parse(source)
  } catch (err) {
    throw new Error('Cannot parse: ' + source)
  }
}
