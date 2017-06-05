# assembly-source

**Create or change assembly attributes in C# and JScript source code.**

[![npm status](http://img.shields.io/npm/v/assembly-source.svg?style=flat-square)](https://www.npmjs.org/package/assembly-source) [![node](https://img.shields.io/node/v/assembly-source.svg?style=flat-square)](https://www.npmjs.org/package/assembly-source) [![Travis build status](https://img.shields.io/travis/vweevers/assembly-source.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/assembly-source) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/assembly-source.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/assembly-source) [![Dependency status](https://img.shields.io/david/vweevers/assembly-source.svg?style=flat-square)](https://david-dm.org/vweevers/assembly-source)

## usage

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

## install

With [npm](https://npmjs.org) do:

```
npm install assembly-source
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
