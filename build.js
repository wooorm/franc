'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var https = require('https');
var bail = require('bail');
var xtend = require('xtend');
var concat = require('concat-stream');
var iso = require('iso-639-3');

var byCode = {};

iso.forEach(function (info) {
  byCode[info.iso6393] = info.name;
});

https
  .request(xtend(
    url.parse('https://raw.githubusercontent.com/wooorm/franc/master/test/fixtures.json'),
    {headers: {'User-Agent': 'request'}}
  ), onrequest)
  .end();

function onrequest(response) {
  response.pipe(concat(onconcat));
}

function onconcat(buf) {
  var data = JSON.parse(buf);
  var list = {};
  var fixtures = [];

  Object.keys(data).forEach(add);

  fs.writeFile(path.join('src', 'list.json'), JSON.stringify(list, 0, 2) + '\n', bail);
  fs.writeFile(path.join('src', 'fixtures.json'), JSON.stringify(fixtures, 0, 2) + '\n', bail);

  function add(key) {
    var code = data[key].iso6393;
    list[code] = byCode[code];
    fixtures.push(data[key].fixture);
  }
}
