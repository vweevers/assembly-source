# assembly-source

**Create or change .NET assembly attributes in C# and JScript source code.**

[![npm status](http://img.shields.io/npm/v/assembly-source.svg)](https://www.npmjs.org/package/assembly-source)
[![node](https://img.shields.io/node/v/assembly-source.svg)](https://www.npmjs.org/package/assembly-source)
[![Travis build status](https://img.shields.io/travis/vweevers/assembly-source.svg)](http://travis-ci.org/vweevers/assembly-source)

## Usage

```js
const Assembly = require('assembly-source')
const fs = require('fs')

// Construct from source code
const assembly = Assembly(fs.readFileSync('./AssemblyInfo.cs'))

// Read attributes (strings, booleans and numbers)
console.log(assembly.get('AssemblyVersion'))

// Modify and add attributes
assembly.set('AssemblyVersion', '1.2.3')
assembly.set('ComVisible', true)

// Then save
fs.writeFileSync('./AssemblyInfo.cs', assembly.toSource())
```

Or create metadata from scratch for JScript:

```js
const assembly = Assembly({ language: 'jscript' })

assembly.set('AssemblyFileVersion', '1.2.3.4')
assembly.set('AssemblyInformationalVersion', '1.2.3')

const js = assembly.toSource({ preamble: true })
```

## Install

With [npm](https://npmjs.org) do:

```
npm install assembly-source
```

## License

[MIT](LICENSE) © Vincent Weevers
