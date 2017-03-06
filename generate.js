var fs = require('fs');
var iso = require('iso-639-3');
var map = {};

iso.forEach(function (info) {
  map[info.iso6393] = info.name;
})

fs.writeFileSync('list.json', JSON.stringify(map, 0, 2) + '\n');