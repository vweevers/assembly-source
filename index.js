'use strict'

const isOptions = require('is-options')
const { pascalCase } = require('pascal-case')
const esprima = require('esprima')

const ATTRIBUTE_RE = /(^|\r?\n)\s*\[\s*assembly\s*:[^]+?\]/

module.exports = function (source, opts) {
  if (isOptions(source)) {
    opts = source
    source = ''
  } else if (source == null) {
    source = ''
  } else if (Buffer.isBuffer(source)) {
    source = source.toString()
  } else if (typeof source !== 'string') {
    throw new TypeError('The source code, if provided, must be a string or buffer')
  }

  if (!opts) opts = {}

  const attributes = {}
  const chunks = []
  const language = opts.language

  let match
  let remainder = source
  let enableSuffix = language === 'jscript'

  while ((match = remainder.match(ATTRIBUTE_RE)) !== null) {
    const raw = match[0]
    const expr = raw.trim()

    // Keep indentation
    const start = match.index + raw.indexOf('[')
    const end = match.index + raw.length

    chunks.push(remainder.slice(0, start))
    chunks.push(expr)

    const { key, value } = parseAttribute(expr)

    remainder = remainder.slice(end)
    addAttribute(key, value, chunks.length - 1)
  }

  function addAttribute (fqk, value, index) {
    const isSuffixed = fqk.slice(-9) === 'Attribute'
    const key = pascalCase(isSuffixed ? fqk.slice(0, -9) : fqk)

    enableSuffix = enableSuffix || isSuffixed
    fqk = enableSuffix ? key + 'Attribute' : key

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
      key = pascalCase(key)
      return attributes[key] ? attributes[key].value : null
    },

    set (key, value) {
      key = pascalCase(key)

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

    attributes () {
      const res = {}

      for (let k in attributes) {
        res[k] = attributes[k].value
      }

      return res
    },

    toSource (opts) {
      if (!opts) opts = {}
      let src = chunks.join('')

      if (language === 'jscript' && opts.preamble !== false && src !== '') {
        if (!/import\s+System\.Reflection/.test(src)) {
          src = 'import System.Reflection;\n' + src
        }
      }

      return src
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

function parseAttribute (src) {
  const js = '{' + src.slice(1, -1) + '}'
  const body = esprima.parseScript(js).body
  const stmt = body[0].body[0].body || {}
  const { type, callee, arguments: args, name } = stmt.expression || {}

  // E.g. [assembly: SuppressIldasm]
  if (stmt.type === 'ExpressionStatement' && type === 'Identifier') {
    return { key: name, value: null }
  }

  if (stmt.type !== 'ExpressionStatement' || type !== 'CallExpression') {
    throw new Error('expected ExpressionStatement with CallExpression')
  }

  if (callee.type !== 'Identifier' || args.length !== 1 || args[0].type !== 'Literal') {
    throw new Error('expected Identifier callee and one Literal argument')
  }

  return {
    key: callee.name,
    value: args[0].value
  }
}
