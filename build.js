'use strict'

var fs = require('fs')
var url = require('url')
var path = require('path')
var https = require('https')
var bail = require('bail')
var xtend = require('xtend')
var concat = require('concat-stream')
var iso = require('iso-639-3')

var fixtures = url.parse(
  'https://raw.githubusercontent.com/wooorm/franc/master/test/fixtures.json'
)

https
  .request(xtend(fixtures, {headers: {'User-Agent': 'request'}}), onrequest)
  .end()

function onrequest(response) {
  response.pipe(concat(onconcat))
}

function onconcat(buf) {
  var data = JSON.parse(buf)
  var list = {}
  var byCode = {}
  var fixtures = []

  iso.forEach(patch)
  Object.keys(data).forEach(add)

  fs.writeFile(
    path.join('src', 'list.json'),
    JSON.stringify(list, null, 2) + '\n',
    bail
  )

  fs.writeFile(
    path.join('src', 'fixtures.json'),
    JSON.stringify(fixtures, null, 2) + '\n',
    bail
  )

  function patch(info) {
    byCode[info.iso6393] = info.name
  }

  function add(key) {
    var code = data[key].iso6393
    list[code] = byCode[code]
    fixtures.push(data[key].fixture)
  }
}
