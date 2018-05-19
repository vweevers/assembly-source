'use strict'

const test = require('tape')
const fs = require('fs')
const path = require('path')
const Assembly = require('../')

test('read cs', function (t) {
  const source = read(fixture('AssemblyInfo.cs'))
  const assembly = Assembly(source)

  t.is(assembly.get('AssemblyTitle'), 'Test"Product')
  t.is(assembly.get('AssemblyDescription'), 'escape\'this"')
  t.is(assembly.get('AssemblyConfiguration'), '')
  t.is(assembly.get('AssemblyCompany'), '')
  t.is(assembly.get('AssemblyProduct'), 'TestProduct')
  t.is(assembly.get('AssemblyCopyright'), 'Copyright © TestCompany 2017')
  t.is(assembly.get('AssemblyTrademark'), '')
  t.is(assembly.get('AssemblyCulture'), '')

  t.is(assembly.get('ComVisible'), false)
  t.is(assembly.get('AssemblyVersion'), '1.0.0')
  t.is(assembly.get('InternalsVisibleTo'), 'FooBar')

  t.is(assembly.get('nope'), null)
  t.is(assembly.toSource(), source, 'source code unchanged')

  t.end()
})

test('modify cs', function (t) {
  const source = read(fixture('AssemblyInfo.cs'))
  const assembly = Assembly(source)

  assembly.set('AssemblyTitle', 'ModifiedTitle')
  assembly.set('AssemblyCompany', 'ModifiedCompany')
  assembly.set('AssemblyTrademark', 'ModifiedTrademark')

  t.is(assembly.get('AssemblyTitle'), 'ModifiedTitle')
  t.is(assembly.get('AssemblyCompany'), 'ModifiedCompany')
  t.is(assembly.get('AssemblyTrademark'), 'ModifiedTrademark')

  // Add new attributes
  assembly.set('NewAttrA', true)
  assembly.set('NewAttrB', 'beep')

  t.is(assembly.get('NewAttrA'), true)
  t.is(assembly.get('NewAttrB'), 'beep')

  t.is(assembly.toSource().trim(), read(fixture('AssemblyInfo-modified.cs')).trim())
  t.end()
})

test('modify jscript', function (t) {
  const source = read(fixture('AssemblyInfo.js'))
  const assembly = Assembly(source, { language: 'jscript' })

  assembly.set('AssemblyTitle', 'ModifiedTitle')
  assembly.set('AssemblyCompany', 'ModifiedCompany')
  assembly.set('AssemblyTrademark', 'ModifiedTrademark')

  t.is(assembly.get('AssemblyTitle'), 'ModifiedTitle')
  t.is(assembly.get('AssemblyCompany'), 'ModifiedCompany')
  t.is(assembly.get('AssemblyTrademark'), 'ModifiedTrademark')

  // Add new attributes
  assembly.set('NewAttrA', true)
  assembly.set('NewAttrB', 'beep')

  t.is(assembly.get('NewAttrA'), true)
  t.is(assembly.get('NewAttrB'), 'beep')

  t.is(assembly.toSource().trim(), read(fixture('AssemblyInfo-modified.js')).trim())
  t.end()
})

test('generate', function (t) {
  const assembly = Assembly()

  assembly.set('AssemblyTitle', 'GeneratedProduct')
  assembly.set('ComVisible', true)

  t.is(assembly.toSource().trim(), read(fixture('AssemblyInfo-generated.cs')).trim())
  t.end()
})

test('generate jscript', function (t) {
  const assembly = Assembly({ language: 'jscript' })

  assembly.set('AssemblyTitle', 'GeneratedProduct')
  assembly.set('ComVisible', true)

  t.is(assembly.toSource().trim(), read(fixture('AssemblyInfo-generated.js')).trim())
  t.end()
})

test('read duplicates', function (t) {
  const source = [
    '[assembly: AssemblyTitle("one")]',
    '[assembly: AssemblyTitle("two")]'
  ].join('\n')

  const assembly = Assembly(source)

  t.is(assembly.get('AssemblyTitle'), 'two')
  t.is(assembly.toSource(), source, 'source code unchanged')

  assembly.set('AssemblyTitle', 'modified')
  t.is(assembly.get('AssemblyTitle'), 'modified')

  const modified = [
    '[assembly: AssemblyTitle("one")]',
    '[assembly: AssemblyTitle("modified")]'
  ].join('\n')

  t.is(assembly.toSource(), modified, 'source code modified')
  t.end()
})

function read (file) {
  return fs.readFileSync(file, 'utf8')
}

function fixture (file) {
  return path.join(__dirname, 'fixtures', file)
}
